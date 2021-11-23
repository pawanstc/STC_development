import React, { Component } from 'react';
import Orientation from 'react-native-orientation-locker';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView, AsyncStorage, Alert,ImageBackground, BackHandler } from 'react-native';

import TabBarContainer from './TabnarComponent';
import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import * as Animatable from 'react-native-animatable';
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
  import SkeletonPlaceholder from "react-native-skeleton-placeholder";
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
        user_id:""

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
                    text:"Cancle",
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
      console.log(result);
          
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
                    if(result){
                        ;
                        this.setState({
                            user_name:result.first_name
                        });
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
        console.log(this.state.timeFormate)
        return(
        
            <View style={{
                flex:1
            }} >
           
                <View style={{
                flex:1,
               
                alignItems:"center",
             
             }} >
             <StatusBar barStyle="light-content" backgroundColor="#62463e" />
 
             <View style={ styles.headerBar } >
             <View style={{
                 flexDirection:"column"
             }} >
                {
                    this.state.user_name !="" ? (
                     <Text style={{
                         color:"#FFF",
                         margin:11,
                         fontSize:18,
                         fontFamily:'Roboto-Bold',
                         marginTop:23
                     }} > {this.state.timeFormate}, {this.state.user_name}! </Text>
                    ) :(null)
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
            <TouchableOpacity activeOpacity={2} onPress={() =>this.props.navigation.navigate("profile")} >
            <Image source={require("../assets/userProfile.png")}
             style={{
                 height:40,
                 width:40,
                 borderRadius:40/2,
                 margin:20
             }}
             />
            </TouchableOpacity>
                 </View>
 
             <View style={styles.buttonTabView} >
                 {
                     this.state.isVisable ? (
                         <View style={{
                             flexDirection:"column",
                       
                             flex:1,
                             alignItems:"center",
                           
                         }} >
                  <Text style={{
                       textAlign:"left",
                      
                       fontSize:16,
                       marginTop:14,
                       fontWeight:"normal",
                       marginTop:20,
                 
                       padding:15, 
                       lineHeight:20,
                      
                       fontFamily:"OpenSans-Italic - Copy"
                   }} >Welcome to STC Wallpaper Mobile App. Now you can check stock, order custom design and do lot more with your finger tips.
                   </Text>
 
                   <View style={{
                       flex:0.6,
                       justifyContent:"center",
                       alignItems:'center'
                   }}>
                     <View style={styles.buttonContainer} >
           
           <TouchableOpacity activeOpacity={0.9} onPress={() =>{
               this.props.navigation.navigate("stockEnquery", {
                   value:""
               })
           }} >
           
           <View style={{
               height:130,
               backgroundColor:"#FFF",
               width:130,
             
           
               justifyContent:"center",
               alignItems:"center",
         
             borderBottomWidth:0.3
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
           
           <TouchableOpacity activeOpacity={0.9} onPress={()=>{
               this.props.navigation.navigate("customWp", {
                   image:""
               })
           } } >
           
           <View style={{
               height:130,
               backgroundColor:"#FFF",
               width:140,
            
                   justifyContent:"center",
               alignItems:"center",
               marginRight:10,
              borderBottomWidth:0.3,
              borderLeftWidth:0.3
              
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
           
            <View  style={styles.buttonContainer} >
           
           <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate("onGoingJob")} >
           
           <View   style={{
               
               height:130,
               backgroundColor:"#FFF",
               width:130,
            
           
               justifyContent:"center",
               alignItems:"center",
              borderRightWidth:0.3
              
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
           
           <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate("seeOnYourWall") } >
           
           <View style={{
               height:130,
               backgroundColor:"#FFF",
               width:149,
          
           
               justifyContent:"center",
               alignItems:"center",
               
              
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
               }} >View all Distributer
               </Text>
           
           </View>
           
           </TouchableOpacity>
           
           </View> 

{/* <ImageBackground  source={require('../assets/backgrondImage.jpg')} style={{
    height:250,
    width:290,
    borderRadius:6,
    elevation:4
}}>

    <View style={{
        flexDirection:"column",
        justifyContent:"center",
    
    }} >
        <View style={{
            flexDirection:"row",
            justifyContent:"space-between"
        }} >
            <TouchableOpacity style={{
                justifyContent:"center",
                alignItems:"center",
                padding:10
            }} >
            <Icon name="document-outline" color="#1c54b2" size={34} />
               <Text style={{
                   textAlign:"center",
                   fontSize:14,
                   // fontWeight:"bold",
                   marginTop:5,
                 
                   textShadowRadius:5
                   
               }} >Stock Inquiry</Text>
               <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6,
               fontFamily:'Roboto',
           
               }} >WallPaper Stock Inquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                justifyContent:'center',
                alignItems:"center",
                padding:4
            }}  activeOpacity={0.9} onPress={()=>{
               this.props.navigation.navigate("customWp", {
                   image:""
               })
           } } >
           
         
               <Icon name="copy-outline" color="#4caf50" size={34} />
               
               <Text style={{
                  textAlign:"center",
                  fontSize:12,
           
                  marginTop:5,
                width :200,
                  textShadowRadius:5
                 
               }} > CustomizeWallPaper</Text>
           
           <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6
               }} >Stc Customize WallPaper
               </Text>
        
           
           </TouchableOpacity>
        </View>

        <View style={{
            flexDirection:"row",
            justifyContent:"space-between"
        }} >
            <TouchableOpacity style={{
                justifyContent:"center",
                alignItems:"center",
                padding:10
            }} >
            <Icon name="document-outline" color="#1c54b2" size={34} />
               <Text style={{
                   textAlign:"center",
                   fontSize:14,
                   // fontWeight:"bold",
                   marginTop:5,
                 
                   textShadowRadius:5
                   
               }} >Stock Inquiry</Text>
               <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6,
               fontFamily:'Roboto',
           
               }} >WallPaper Stock Inquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                justifyContent:'center',
                alignItems:"center",
                padding:4
            }}  activeOpacity={0.9} onPress={()=>{
               this.props.navigation.navigate("customWp", {
                   image:""
               })
           } } >
           
         
               <Icon name="copy-outline" color="#4caf50" size={34} />
               
               <Text style={{
                  textAlign:"center",
                  fontSize:12,
           
                  marginTop:5,
                width :200,
                  textShadowRadius:5
                 
               }} > CustomizeWallPaper</Text>
           
           <Text style={{
               textAlign:"center",
               fontSize:10,
               color:"#2979ff",
               margin:6
               }} >Stc Customize WallPaper
               </Text>
        
           
           </TouchableOpacity>
        </View>

    </View>
      
    </ImageBackground>
  */}
           </View>
           
                         </View>
                     ) :(
                         <View style={{
                             flex:1,
                         }} >
            <View style={{
                             flex:0.6,
                             justifyContent:'center'
                         }} >
                             <BallIndicator color='#62463e'
                             size={34}
                         />
     
                             </View>
           </View>
                     )
                 }
 
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
        justifyContent:"space-between"

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