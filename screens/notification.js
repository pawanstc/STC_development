import React, { Component } from 'react';

import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, AsyncStorage, RefreshControl  } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Modal, { ModalContent,SlideAnimation } from 'react-native-modals';
import NetInfo from "@react-native-community/netinfo";
import TabBarContainer from './TabnarComponent.js';

// import AnimatedLoader from "react-native-animated-loader";


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
       
       this.getNotifications();
        
    }

    componentDidUpdate(){
        
        console.log(this.state.userid)
       
   
    }
    getNotifications=()=>{
        this.setState({userid:this.props.route.params.user_id})
        NetInfo.fetch().then(state=>{
            if(state.isConnected){
                this.setState({refreshing:true})
     
        fetch("https://stcapp.stcwallpaper.com/backend/v1/get_notification_details_by_user_id",{
            
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"user_id=34"//+this.state.user_id
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
                                       
								   }} ></View>
                                   
               
                 <FlatList
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    data={this.state.notifications}
                    renderItem={(items) => {
                        return(
                            <View>
                                 <View style={{
									   padding:10,
									   borderBottomWidth:0.5,
                                       backgroundColor:'#eeeeee',
                                       
								   }} >
                            <View style={{height:55,width:Dimensions.get("screen").width -45,backgroundColor:'#eeeeee',borderRadius:10}}>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate("onGoingJob")}>
                               <Text style={{fontSize:18}}>{items.item.notification_title}</Text>
                               <Text>{items.item.notification_body}</Text>
                               </TouchableOpacity>
                            
                                   </View>
                            
                            
                            
                          

                         
                          </View>
                          </View>
                        )}
                }
                    keyExtractor={(item) => item.date_time}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getNotifications}/>}
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
        width:Dimensions.get("screen").width,
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
        height:Dimensions.get("screen").height,
        width:Dimensions.get("screen").width -45,
  
        borderRadius:20,
        flex:1,
        // justifyContent:"center",
        alignItems:"center"
    },
    tabContainer:{
      
        height:60,
        width:Dimensions.get("screen").width,
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