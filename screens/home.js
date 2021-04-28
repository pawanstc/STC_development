import React, { Component,useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView, AsyncStorage, Alert,ImageBackground, BackHandler } from 'react-native';

import TabBarContainer from './TabnarComponent';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import {imageUrl, URL} from '../api.js';
import * as Animatable from 'react-native-animatable';
import ImageLoad from 'react-native-image-placeholder';
import messaging from '@react-native-firebase/messaging'

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
import WebView from 'react-native-webview';

export default class HomeComponent extends Component{

 constructor(props){
     super(props)

     this.state = {
        timeFormate :"",
        time:"",
        loginTime:"",
        isVisable:true,
        isModel:true,
        user_name:"",
        user_id:"",
        profile_image:"",
        company_logo:""

     }
 }

 
   
 


 backAction = () =>{
 
    if(this.props.navigation.isFocused()){
        this.props.navigation.push("home");
        console.log("yes")
        Alert.alert(
            "Exit App",
            "Are You Sure to Exit App",
            [
                {
                    text:"Ok",
                    onPress:() => BackHandler.exitApp()
                },
                {
                    text:"Cancel",
                    onPress:() => null
                }
            ]
        )
      
    }else{
       console.log("no");
    }
}
_unsubscribeSiFocus = this.props.navigation.addListener('focus', e => {
    console.warn('focus signIn');
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
});
_unsubscribeSiBlur = this.props.navigation.addListener('blur', e => {
    console.warn('blur signIn');
    BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButton,
    );
});
 componentDidMount(){
   
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
 this._unsubscribe = this.props.navigation.addListener("focus", () =>{
    this.getUsers();
    AsyncStorage.getItem("user_name")
     .then(result =>{
         console.log(result);
         this.setState({
             user_name:result
         })
     })
     this.timeFormateMessage();

     this.setState({
         loginTime:moment().calendar()
     });
 });



     setTimeout(() => {
        this.setState({
            isVisable:true
        })
     },1000)
     Orientation.lockToPortrait()
     console.log("mounted home")
    

this.requestUserPermission();
 }


 requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getFcmToken() //<---- Add this
      console.log('Authorization status:', authStatus);

      console.log(messaging().isDeviceRegisteredForRemoteMessages)
      const per = messaging().hasPermission()
      messaging().registerDeviceForRemoteMessages();
    }
  }


  getFcmToken = async () => {
    const fcmToken = await messaging().getToken()
    if (fcmToken) {
        console.log("hello token")
     
     console.log("Your Firebase Token is:", fcmToken);
     Alert.alert("Token",fcmToken)
    } else {
     console.log("Failed", "No token received");
    }
  }

 componentWillUnmount(){

    
    this._unsubscribe();
    this._unsubscribeSiFocus();
    this._unsubscribeSiBlur();
   
 }

 // time formate message

 timeFormateMessage = () =>{
    var time = new Date().toLocaleString( { hour: 'numeric', minute: 'numeric', hour12: true })
    this.setState({
        time:time
    })

   
     var formate = "";
     var time = new Date();
     var hr = time.getHours();
     console.log(time);

     if(hr <12){
        console.log("Good morning")
         this.setState({
             timeFormate:"Good Morning"
         })
     }else if(hr >= 12 && hr <=17){
         console.log("Good Afternoon")
           this.setState({
            timeFormate:"Good Afternoon"
        })
     }else if(hr >=17 && hr <= 24){
        console.log("Good Evening")
        this.setState({
            timeFormate:"Good Evening"
        });
     }
 }

   getUsers =  async ()=>{
    
     await AsyncStorage.getItem("user_id")
      .then(result =>{
      console.log("user_id"+result);
          
          NetInfo.fetch().then(state =>{
              if(state.isConnected){
                fetch(URL+"/get_user_details_by_user_id", {
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    method:"POST",
                    body:"user_id=" +result
                }).then(response => response.json())
                .then(result =>{
                   console.log(result);
                    if(result.error == false){
                        
                       

                        if(result.profilePicture == null  && result.profilePicture == ""){
                            this.setState({
                                user_name:result.first_name,
                                profile_image:"",
                               
                            });
                        }else if(result.profilePicture == null){
                            this.setState({
                                user_name:result.first_name,
                                profile_image:"",
                               
                            });
                        }else if(result.profilePicture == ""){
                            this.setState({
                                user_name:result.first_name,
                                profile_image:"",
                               
                            });
                        }
                        else{
                            console.log(result.profilePicture);
                            this.setState({
                                user_name:result.first_name,
                                profile_image:result.profilePicture,
                                
                            });
                        }

                        if(result.company_logo == null && result.company_logo ==""){
                            this.setState({
                                company_logo:""
                            })
                        }else if(result.company_logo == null){
                            this.setState({
                                company_logo:""
                            })
                        }else if(result.company_logo == ""){
                            this.setState({
                                company_logo:""
                            })
                        }
                        else{
                            this.setState({
                                company_logo:result.company_logo
                            })
                        }
                    }else{
                        this.props.navigation.navigate("login");
                    }
                }).catch(error =>{
                    console.log(error);
                })
              }else{
                  Alert.alert(
                      " Warning",
                      "Please check your Internet connection"
                  )
              }
          })
      })
   }
    render(){
        
    console.log("company_logo"+this.state.company_logo);
        return(
        
            <View style={{
                flex:1,
              justifyContent:"center"
            }} >
           
                <View style={{
               flex:1,
               height:"100%",
              
                alignItems:"center",
    
             
             }} >
             <StatusBar barStyle="light-content" backgroundColor="#62463e" />
 
             <View style={ styles.headerBar } >




             <View style={{
                 width:"75%"
             }}  >
                {
                    this.state.user_name !="" || this.state.user_name != null ? (
                     <Text numberOfLines={1} style={{
                         color:"#FFF",
                         margin:11,
                         fontSize:18,
                         fontFamily:'Roboto-Bold',
                         marginTop:23,
                         
                     }} > {this.state.timeFormate}, {this.state.user_name}! </Text>
                    ) :(
                       <View style={{
                           height:40,
                           width:Dimensions.get("screen").width -85
                       }} >
                           </View>
                    )
                }
             
             {/* <Text style={{
                 fontWeight:"bold",
                 textAlign:"center",
                 fontSize:17,
                 color:"#FFF"
             }} >{this.state.loginTime}</Text> */}
             </View>
              {/* <View>
              <Moment>{this.state.time}</Moment>
              </View> */}
            {
                 this.state.company_logo === ""    ? (
                  <View>
                  
                      {
                            this.state.profile_image === "" ? (
                             
                                <TouchableOpacity activeOpacity={2} onPress={() =>this.props.navigation.navigate("profile")} >
                                
                                <Image source={require("../assets/userProfile.png")}
                         style={{
                             height:50,
                             width:50,
                             borderRadius:50/2,
                             margin:10,
                            
                         }}
                         />
                        </TouchableOpacity>


                          ) :(
                            <TouchableOpacity activeOpacity={2} onPress={() =>this.props.navigation.navigate("profile")} >
                            {/* <Image source={{uri:imageUrl+"/"+this.state.profile_image}}
                            style={{
                            height:50,
                            width:50,
                            borderRadius:50/2,
                            margin:10,
                            
                            }}
                            /> */}
                             <ImageLoad
                                 isShowActivity={false}
                                    style={{
                                        height:50,
                                        width:50,
                                        borderRadius:40,
                                        margin:10,
                                        
                                        }}
                                    loadingStyle={{ size: 'large', color: '#62463e' }}
                                    borderRadius={6}
                                    source={{uri:imageUrl+"/"+this.state.profile_image}}
                                />
                            </TouchableOpacity>
                          )
                      }
                      </View>
                ) :(
                    <View>
                    <TouchableOpacity activeOpacity={2} onPress={() =>this.props.navigation.navigate("profile")} >
                    {/* <Image source={{uri:imageUrl+"/"+this.state.company_logo}}
             style={{
                 height:50,
                 width:50,
                 borderRadius:50/2,
                 margin:10,
                
             }}
             /> */}
             <ImageLoad
                                    isShowActivity={false}
                                    style={{
                                        height:50,
                                        width:50,
                                        borderRadius:25,
                                        margin:10,
                                       
                                    }}
                                    loadingStyle={{ size: 'large', color: '#62463e' }}
                                    borderRadius={6}
                                    source={{uri:imageUrl+"/"+this.state.company_logo}}
                                />
            </TouchableOpacity>
                    </View>
                )
            }

        
                 </View>
 
            <View style={{
                height:Dimensions.get("screen").height * 0.178,
                width:Dimensions.get("screen").width -40,
                backgroundColor:"#FFF",
                borderRadius:8,
                backgroundColor:"#FFF",
                position:"absolute",
                top:83,
                left:22,
                right:22,
                justifyContent:"center",
                alignItems:"center",
                elevation:10
            }} >
               <Text style={{
                       textAlign:"left",
                      
                       fontSize:16,
                    
                       fontWeight:"normal",
                       padding:15, 
                       lineHeight:20,
                      
                       fontFamily:"OpenSans-Italic - Copy"
                   }} >Welcome to STC Wallpaper Mobile App. Now you can check stock, order custom design and do lot more with your finger tips.
                   </Text>
            </View>
              <View style={{
                flex:4,
                justifyContent:"center",
                alignitems:"center"
              }}>
                   <View style={{
                       flexDirection:"column",    
                   }} >
                       {/* first position  */}
                   <View style={{
                       flexDirection:"row",
                      
                   }} > 

                  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("stockEnquery",{
                      value:""
                  })} >
                  <View style={{
                       height:135,
                       width:Dimensions.get("screen").width *0.44,
                       backgroundColor:"#FFF",
                       borderRadius:8,
                       marginTop:20,
                       margin:6,
                       justifyContent:"center",
                       alignItems:'center',
                       elevation:6
                   }} >
                        <Icon name="document-outline" color="#1c54b2" size={34} />
               <Text style={{
                   textAlign:"center",
                   fontSize:14,
                   // fontWeight:"bold",
                   marginTop:5,
                 
                   textShadowRadius:5
                   
               }} >Stock Enquiry</Text>
               <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6,
               fontFamily:'Roboto',
           
               }} >Wallpaper Stock Enquiry</Text>
                   </View>
                  </TouchableOpacity>


                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("customWp",{
                       image:""
                   })} >
                   <View style={{
                       height:135,
                       width:Dimensions.get("screen").width *0.44,
                       backgroundColor:"#FFF",
                       borderRadius:8,
                       marginTop:20,
                       margin:6,
                       justifyContent:"center",
                       alignItems:"center",
                       elevation:6
                   }} >
                      <Icon name="copy-outline" color="#4caf50" size={34} />
               
               <Text style={{
                  textAlign:"center",
                  fontSize:14,
           
                  marginTop:5,
            
                  textShadowRadius:5
                 
               }} > Customize Wallpaper </Text>
               <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6
               }} >STC Customize Wallpaper
               </Text>
                   </View>
                   </TouchableOpacity>

                   </View>
                       { /* seccond position */ }

                         {/* first position  */}
                   <View style={{
                       flexDirection:"row",
                     
                       

                   }} > 

               <TouchableOpacity activeOpacity={2}onPress={() => this.props.navigation.navigate("onGoingJob")} >
               <View style={{
                        height:135,
                        width:Dimensions.get("screen").width *0.44,
                        backgroundColor:"#FFF",
                        borderRadius:8,
                        marginTop:20,
                        margin:6,
                        justifyContent:"center",
                        alignItems:'center',
                        elevation:6,
                        
                   }} >
                       <Icon  name="cube-outline" color="#673ab7" size={34} />
               <Text style={{
                   textAlign:"center",
                   fontSize:14,
            
                   marginTop:5,
                  
                   textShadowRadius:5,
                   width:250
               }} >On Going Job List</Text>
           
           <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6
               }} >View All Job List
               </Text>
                   </View>
               </TouchableOpacity>


              <TouchableOpacity activeOpacity={2 } onPress={() => this.props.navigation.navigate("seeOnYourWall")} >
              <View style={{
                         height:135,
                         width:Dimensions.get("screen").width *0.44,
                         backgroundColor:"#FFF",
                         borderRadius:8,
                         marginTop:20,
                         margin:6,
                         justifyContent:"center",
                         alignItems:'center',
                         elevation:6
                   }} >
                       <Icon name="flash-outline" color="#cddc39" size={34} />
           
           <Text style={{
               textAlign:"center",
               fontSize:14,
               marginTop:5,
               textShadowRadius:5
           }} >See On Your Wall</Text>
       
       <Text style={{
           textAlign:"center",
           fontSize:10,
           color:"#2979ff",
           margin:6
           }} >View All Distributer
           </Text>
                   </View>
              </TouchableOpacity>

                   </View>
                       { /* seccond position */ }
                   </View>

             </View>
             </View>
    
     <TabBarContainer navigate={this.props.navigation} />
    
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:175,
        width:Dimensions.get("screen").width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection:"row",
        

    },
    buttonTabView:{
        height:Dimensions.get("screen").height,
        width:Dimensions.get("screen").width -45,
        position:"absolute",
        top:75,
        left:25,
        right:25,
        alignItems:"center",
        justifyContent:"center",

        

        backgroundColor:"#FFF",
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        flex:1
    },
    buttonContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:'center',
      
    },
    tabContainer:{
      
        height:60,
        width:Dimensions.get("screen").width,
        backgroundColor:"#FFF",
        elevation:5,
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        justifyContent:"center",
        alignItems:"center",
      

    },
    tabItems:{
        // justifyContent:"space-around",
        alignItems:"center",
        flexDirection:"row",
        
    }
})