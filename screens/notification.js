import React, { Component } from 'react';

import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, AsyncStorage, RefreshControl  } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Modal, { ModalContent,SlideAnimation } from 'react-native-modals';
import NetInfo from "@react-native-community/netinfo";
import TabBarContainer from './TabnarComponent.js';
import {route_notificationTojob,route_notificationToNotice} from '../screens/notification_route'
// import AnimatedLoader from "react-native-animated-loader";
import {URL,imageUrl} from '../api'

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

  let {height,width} = Dimensions.get('screen')
 
  
export default class Notification extends Component{

    

    constructor(props){
        super(props)

        this.state={
            notifications:[],
            userid:'',
            refreshing:false
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
                this.setState({refreshing:true})
     
        fetch("https://stcapp.stcwallpaper.com/backend/v1/get_notification_details_by_user_id",{
            
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"user_id="+this.state.userid
        }).then(response=>response.json())
        .then(result=>{
            this.setState({
                notifications:result.notification_details
            })
            console.log(this.state.notifications)
        }
            
            
        ).catch(err=>console.log(err))
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
            if(item.notification_type=="Job_Details"){
                var jd=[]
                route_notificationTojob(item.post_job_order_id).then(res=>{jd=res
                
                    console.log("jobdetails",jd)
                    if(jd!=undefined){
                        console.log("andar",jd)
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
                
             
             
                
                

            }else{
                
                var res=route_notificationToNotice(item.notification_doc_url)
                if(res=="pdf")this.props.navigation.navigate("showsPdf",{url:imageUrl+item.notification_doc_url})
                if(res=="jpg")this.props.navigation.navigate("preview",{uri:imageUrl+item.notification_doc_url})
            }
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
             {/* <View>
             <Moment>{this.state.time}</Moment>
             </View> */}
           {/* <Text style={{
               fontSize:18,
               fontWeight:"bold",
               color:"#FFF",
            margin:20,
            
            
           }} >Post Job</Text> */}
            {/* <Image source={{uri:'https://cdn1.vectorstock.com/i/1000x1000/31/95/user-sign-icon-person-symbol-human-avatar-vector-12693195.jpg'}} 
    style={{
        height:40,
        width:40,
        borderRadius:20,
        marginLeft:230,
        marginTop:10
    }}
    /> */}


    
                </View>

                <View style={ styles.formContainer } >
           
                 <Text style={{
                     textAlign:'center',
                     fontFamily:"Roboto-Bold",
                     fontSize:20,
                     marginTop:14
                 }} >Notification</Text>
                 <View style={{
									   padding:15,
									   borderBottomWidth:0.5,
                                       flex:1
								   }} ></View>
                                   
               
                 <FlatList style={{}}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    
                    data={this.state.notifications}
                    renderItem={(items) => {
                        return(
                            <View style={{paddingLeft:20,paddingRight:20,paddingBottom:10}}>
                            <View style={{height:65,width:width-80,flexDirection:'row'}}>
                                
                                      
                               
                            <View style={{flex:1,backgroundColor:'#FFFFFF',flexDirection:'column'}}>
                                
                            <TouchableOpacity  onPress={()=>this.Click(items.item)}>
                               <Text style={{fontSize:14}}>{items.item.notification_title}</Text>
                               <Text style={{fontSize:12}}>{items.item.notification_body}</Text>
                               <Text style={{fontSize:10}}>{items.item.date_time}</Text>
                               </TouchableOpacity>
                               
                               </View>
                               {items.item.notification_type=="Job_Details"?(
                               <Image source={{uri:imageUrl+items.item.notification_doc_url}} style={{height:50,width:50}}/>
                               ):(<Image source={require('../assets/pdflogo.jpg')} style={{height:50,width:50}}/>)
                               }
                              
                                   
                                   
                              
                               </View>
                               
                                  </View>
                            
                            
                            
                          

                         
                         
                          
                        )}
                }
                    keyExtractor={(item) => item.date_time}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getNotifications}/>}
                    scrollToOverflowEnabled={true}              
                    ListFooterComponent={<View style={{marginBottom:150,marginTop:10}}></View>}
                 />
         
       
      </View>
      
            </View>
            {/* <TabBarContainer navigate={this.props.navigation} /> */}

            {/* <Modal style={{
                height:240
            }} useNativeDriver={true}  isVisible={this.state.modelShow}>
          <View style={{ flex: 0.5,backgroundColor:"#FFF", height:240 }}>
            <View style={{
                flex:1,
                // justifyContent:"center",
                alignItems:"center"
            }} >
            <Text style={{
                textAlign:"center",
                fontFamily:'Roboto-Bold',
                fontSize:18,
            }} >{this.state.messageData.name}</Text>
            <View style={{
                flexDirection:"row",
            }} >
                <Text style={{
                    fontSize:14,
                    color:"grey",
                  
                }} >{this.state.messageData.des}</Text>

            </View>

            </View>
          </View>
        </Modal> */}
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