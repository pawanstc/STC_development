import React, { Component } from 'react';

import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, AsyncStorage, RefreshControl  } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Modal, { ModalContent,SlideAnimation } from 'react-native-modals';
import NetInfo from "@react-native-community/netinfo";
import TabBarContainer from './TabnarComponent.js';
import {route_notificationTojob,route_notificationToNotice} from '../screens/notification_route'
// import AnimatedLoader from "react-native-animated-loader";
import {URL,imageUrl} from '../api';

import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
import index from 'uuid-random';

let {height,width} = Dimensions.get('screen')
  
export default class Notification extends Component{
    constructor(props){
        super(props)

        this.state={
            notifications:[],
            userid:'',
            refreshing:false,
            totalRecord: 0,
            pageIndex: 0,
            pageSize: 20,
            isLoading: false
        }
    }

    componentDidMount(){
        if(width>height){
            let temp = width;
            width= height;
            height=temp;
        }

        AsyncStorage.getItem("user_id")
        .then(result =>{this.setState({
            userid:result
        })
            this.getNotifications();
        })
       
    }

    componentDidUpdate(){
        console.log(this.state.userid)
    }
    getNotifications=()=>{
        NetInfo.fetch().then(state=>{
            if(state.isConnected){
                AsyncStorage.getItem('role').then(role=>{
                    fetch(URL + "/get_all_notification_details",{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        method:"POST",
                        body:
                            "user_id="+
                            this.state.userid+
                            "&role="+
                            role+
                            "&page_index="+
                            this.state.pageIndex+
                            "&page_size="+
                            this.state.pageSize+
                            "&source="+
                            'mobile'
                    }).then(response=>response.json())
                    .then(result=>{
                        console.log('get_all_notification_details ', result);
                        this.setState({isLoading: false});
                        if (result.error === false) {
                            this.setState({
                                notifications: this.state.pageIndex === 0 ? result.notification_details : [...this.state.notifications, ...result.notification_details],
                                totalRecord: result.total_size
                            })
                        } else {
                            this.setState({notification: []})
                        }
                    }).catch(err=>console.log(err))
                })
            }
            this.setState({refreshing:false})
        })
    }
    

    modelPop = (data) =>{
        this.setState({
            modelShow:true,
            messageData:data
        });
    }


    Click=(item)=>{
            // if(item.notification_type=="Job_Details"){
                var jd=[]
                route_notificationTojob(item.post_job_order_id).then(res=>{jd=res
                
                    console.log("jobdetails-----------------",item, res)
                    if(jd!=undefined){
                        this.props.navigation.navigate("postViewJob",{
                            pattern_number:jd.pattern_no,
                            order_image:jd.pattern_image_url,
                            supportive_image:jd.support_image.image_details,
                            button_show:jd.button_show,
                            order_id:jd.id,
                            job_description:jd.description,
                            ordered_by:jd.order_by_user_id,
                            audio:jd.audio_url,
                        user_type:jd.user_role_name})}
                    }
                    ).catch(err=>console.log(err))
            // }else{
            //     var res=route_notificationToNotice(item.notification_doc_url)
            //     console.log('res, item.notification_doc_url======>', res, item.notification_doc_url)
            //     if(res==="pdf")this.props.navigation.navigate("showsPdf",{url:imageUrl+item.notification_doc_url})
            //     if(res==="jpg")this.props.navigation.navigate("preview",{uri:imageUrl+item.notification_doc_url})
            // }
    }

    render(){
        return(
           <View style={{
               flex:1
           }} >
                <View style={{
                flex:1,
                
                alignItems:"center"
                }} >
                <StatusBar barStyle="light-content" backgroundColor="#62463e" />
                <View style={ styles.headerBar } >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" size={20} style={{
                            margin:20
                        }}  color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={ styles.formContainer } >
            
                    <Text style={{
                        textAlign:'center',
                        fontFamily:"Roboto-Bold",
                        fontSize:20,
                        marginTop:14
                    }} >Notification</Text>

                    {this.state.notifications && this.state.notifications.length ? (
                        <>
                            <View style={{
                                padding:15,
                                borderBottomWidth:0.5,
                                flex:1
                            }}></View>
                            <FlatList style={{}}
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                data={this.state.notifications}
                                renderItem={(items) => {
                                    return (
                                        <View style={{paddingLeft:20,paddingRight:20,paddingBottom:10}}>
                                            <View style={{height:65,width:width-80,flexDirection:'row'}}>
                                                <View style={{flex:1,backgroundColor:'#FFFFFF',flexDirection:'column'}}>
                                                    <TouchableOpacity  onPress={()=>this.Click(items.item)}>
                                                        <View style={{ flexDirection: 'row'}}>
                                                            <Text style={{fontSize:14}}>{items.item.notification_title}</Text>
                                                            <Text style={{fontSize:14}}>Order id: (#{items.item.order_id})</Text>
                                                        </View>
                                                        <Text style={{fontSize:12}}>{items.item.notification_body}</Text>
                                                        <Text style={{fontSize:10}}>{items.item.date_time}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {items.item.notification_doc_url?(
                                                    <Image source={{uri:imageUrl+items.item.notification_doc_url}} style={{height:50,width:50, borderRadius: 25}}/>
                                                ):(
                                                    <Image source={require('../assets/images/logo45454.png')} style={{height:50,width:50, borderRadius: 25}}/>
                                                )}
                                            </View>
                                        </View>
                                    )
                                }}
                                keyExtractor={(_,index) => index.toString()}
                                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                                    this.setState({pageIndex: 0})
                                    this.getNotifications();
                                }}/>}
                                scrollToOverflowEnabled={true}              
                                ListFooterComponent={<View style={{marginBottom:130,marginTop:10}}>
                                    {this.state.isLoading ? <Text style={{ textAlign: 'center'}}>Loading...</Text> : null}
                                </View>}
                                onEndReached={() => {
                                    if (this.state.pageIndex < this.state.totalRecord / this.state.pageSize) {
                                        this.setState({pageIndex: this.state.pageIndex + 1, isLoading: true}) 
                                        this.getNotifications();
                                    }
                                }}
                                onEndReachedThreshold={0.1}
                            />
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', height: height - 120}}>
                            <Text style={{ textAlign:'center', fontFamily:"Roboto-Regular", fontSize:15, justifyContent: 'center' }}>No Data Found</Text>
                        </View>
                    )}           
                </View>
            </View>
        </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:170,
        width:width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection:"row",


    },
    formContainer:{

        position:"absolute",
        top:70,
        left:25,
        right:25,
        backgroundColor:"#FFF",
        height:height,
        width:width -45,
  
        borderRadius:20,
        flex:1,
        // justifyContent:"center",
        alignItems:"center"
    },
    tabContainer:{
      
        height:60,
        width:width,
        backgroundColor:"#FFF",
        elevation:5,
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        justifyContent:"center",
        // alignItems:"center",
        flex:0.1

    },
    tabItems:{
        justifyContent:"space-around",
        alignItems:"center",
        flexDirection:"row",
        
    },
    textInputStyle:{
        height:40,
        width:350,
        borderRadius:10,
        textAlign:'center',
        margin:5,
        marginHorizontal:25,
        borderBottomWidth:0.6,
        margin:20,
        marginBottom:20
    },
    loginButton:{
        height:40,
        width:300,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:20,
        borderRadius:10
    },
    lottie: {
        width: 100,
        height: 100
      }
})