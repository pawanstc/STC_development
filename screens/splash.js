import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Animated, Easing, Dimensions, ImageBackground, Image, AsyncStorage, Alert } from 'react-native';
import {URL} from '../api.js';
import NetInfo from "@react-native-community/netinfo";
import * as Animatable from 'react-native-animatable';
import Orientation from 'react-native-orientation-locker';
import RNRestart from 'react-native-restart'; // Import package from node modules
import Svg, {
    Circle,
    Ellipse,
    G,

    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
  } from 'react-native-svg';

import { interpolatePath } from "d3-interpolate-path"
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

const startPath = "M0,64L48,90.7C96,117,192,171,288,181.3C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z";
const endPath = "M0,192L48,160C96,128,192,64,288,69.3C384,75,480,149,576,176C672,203,768,181,864,197.3C960,213,1056,267,1152,266.7C1248,267,1344,213,1392,186.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z";


export default class SplashComponent extends Component{

constructor(props){
    super(props);



 this.state = {
    animatedValue: new Animated.Value(0)
 }
    
}

componentDidMount(){
   
    Orientation.lockToPortrait()
    const pathInterpolate = interpolatePath(startPath, endPath);

        this.state.animatedValue.addListener(({value}) =>{
            const path = pathInterpolate(value);

            this._path.setNativeProps({
                d:path
            });
        })

    Animated.sequence([
        Animated.timing(this.state.animatedValue, {
            toValue:1,
            duration:2900,
            useNativeDriver:false
        }),
        
    ]).start(  () =>{ console.log("checkuser") 
     this.checkUser()});

   
}

checkUser =  () =>{
   
    console.log("function called!!")
    let uniqueId =   DeviceInfo.getUniqueId();
   AsyncStorage.getItem("app_token")
   .then(result =>{
       console.log(result)
       console.log("hello");
       if(result){
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                console.log("hello netinfo connected");
                fetch(URL+"/get_User_Details_By_Device_Id", {
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method:"POST",
                    body:'device_id=' +uniqueId
                }).then(response =>{ response.json()
                    console.log(URL)
                    console.log(response)})
                .then(result =>{
                    console.log(result);
                  
                   
                    if(result.devices_id === uniqueId & result !=null){
                        this.props.navigation.replace("home");
                    }else{
                        this.props.navigation.replace("login");
                    }
                })

            }else{
                Alert.alert(
                    "Network Error",
                    "Please check Your Internet connection !",
                    [
                        {
                            text:"Reload",
                            onPress:() => RNRestart.Restart()
                        }
                    ]
                )
            }
        })
       }else{
        this.props.navigation.navigate("onBoard");
       }
   })

  
}


setToken =   () =>{
   AsyncStorage.getItem("device_id")
   .then( async result =>{
        if (result){
            this.props.navigation.replace("login");
        }else{
            this.props.navigation.replace("onBoard");
           await AsyncStorage.setItem("UserToken2","token");
        }
   });



     let uniqueId =  DeviceInfo.getUniqueId();
     AsyncStorage.setItem("device_id", uniqueId.toString()); 
}


    render(){
    const animatedHeight = this.state.animatedValue.interpolate({
        inputRange:[0,1],
        outputRange:[0,160]
    });

  
    
        return(
           <View style={{
               flex:1,
               backgroundColor:"#FFF"
           }} >
            <StatusBar backgroundColor="#62463e" />

                <Animated.View style={{
                height:animatedHeight,
                width:Dimensions.get("screen").width,
                backgroundColor:'#62463e'
               

            }} >


                <Svg 
               
                    viewBox="0 0 1440 320"
                    height={"250%"}
                    width="100%"
                   

                    style={{
                        position:"absolute",
                        top:0
                    }}
                    
                >
                    <Path
                       fill="#62463e"
                       d={startPath}
                       ref={path => this._path = path}
                   
                    //    source={{uri:'https://www.stcwallpaper.com/admin/upload/original/1579590104_c6558381f91d6cae68062211036695a3.jpg'}}
                    >
                    </Path> 
                   
                </Svg>

            </Animated.View>

                    <View style={{
                        justifyContent:"center",
                        flex:0.7,
                        alignItems:"center"
                    }} >
                    <Image source={require("../assets/logo45454.png")} 
                        style={{
                            height:200,
                            width:200,
                            marginTop:50
                        }}
                    />



                    </View>
                    {/* <Animatable.Text style={{
          textAlign:"center",
          fontSize:15,
          fontWeight:"bold",
          marginBottom:15
      }} animation="zoomInUp">Powered By STC wallpaper</Animatable.Text> */}
           </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#FFF"
    }
})