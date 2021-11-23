import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, Image, Dimensions, StatusBar, AsyncStorage,Alert } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import DeviceInfo from 'react-native-device-info';
import { URL } from '../api.js';

import NetInfo from "@react-native-community/netinfo";

export default class Onboard extends Component{

    constructor(props){
        super(props);

        this.state = {
            token:""
        }
    }

    componentDidMount(){
        AsyncStorage.setItem("app_token", "app_enter_token");
    }

  
onDoneFunction = () =>{
    let devices_id = DeviceInfo.getUniqueId();

    AsyncStorage.setItem("device_id", devices_id.toString());


         NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_User_Details_By_Device_Id",{
                    method:"POST",
                    headers:{
             
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body:'device_id=' +devices_id
            
                }).then(response =>response.json()) 
                .then(  res =>{
                console.log(res);
                    
                    // if(result.error == true){
                    //     this.props.navigation.navigate("login");
                        
                    // }else{
                    //     AsyncStorage.setItem("device_id", result.devices_id);
                    //     AsyncStorage.setItem("user_id", result.id.toString());
    
                    //    this.props.navigation.navigate("home");
                    // }
                   
                    if(res.devices_id === devices_id){
                        AsyncStorage.setItem("device_id", res.devices_id);
                        AsyncStorage.setItem("user_id", res.id.toString());
                           this.props.navigation.replace("home");
                       }else{
                           this.props.navigation.replace("login");
                       }
            
                }).catch(error =>{
                    console.log(error)
                })
            }else{
                Alert.alert(
                    "NetWork Error",
                    "Please Check Yout Inter net connection and Restart app !!",
                    [
                        {
                            text:"Ok",
                            onPress:() => RNRestart.Restart(),
                            style:"success"
                        }
                    ]
                );
    
            }
        })
}


 
     render(){
         return(
             <View style={{
                 flex:1
             }} >
                 <StatusBar barStyle="light-content" backgroundColor="#FFF" />
                 <Onboarding
                 onDone={() => this.onDoneFunction()}
                 onSkip ={() => this.onDoneFunction()}
                 titleStyles={{
                     fontFamily:"Roboto-Bold",
                     
                 }}
                 imageContainerStyles ={{
                    padding:20
                 }}
                 subTitleStyles ={{
                     fontFamily:"Roboto-Thin"
                 }}
  pages={[
    {
      backgroundColor: "#c2cbd7",
      image: <Image source={require("../assets/newDash1.jpg")} style={{
          height:200,
          width:280
      }} />,
      title: 'SELECT',
      subtitle: 'Choose The Quality of the media paper on Which you want to Peint',
    },
    {
        backgroundColor: '#ffeec5',
        image: <Image source={require("../assets/newDash2.png")} style={{
            height:200,
            width:280
        }} />,
        title: 'CHOOSE',
        subtitle: 'Choose Any Design from the Collection or Provide your Custom Design ',
       
      },
      {
        backgroundColor: '#e3effe',
        image: <Image source={require("../assets/newDash3.png")} style={{
            height:200,
            width:280
        }} />,
        title: 'SUBMIT',
        subtitle: 'Submit The information we shall send you for approval',
      },
      {
        backgroundColor: '#fafafa',
        image: <Image source={require("../assets/newDash4.png")} style={{
            height:150,
            width:180
        }} />,
        title: 'FINAL',
        subtitle: 'You Approve it we print it ',
      },
  ]}
/>
             </View>
         )
     }
}