import React, {  Component } from 'react';

import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Dimensions, TextInput, Animated, Easing, AsyncStorage, Alert } from 'react-native';

import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { URL } from '../api.js';
import DeviceInfo from 'react-native-device-info';
export default class LoginComponent extends  Component{

constructor(props){
    super(props)
    
    this.animatedValue = new Animated.Value(0);

    this.state = {
       mobile_number:"",
            password:"",
            device_id:""
    }
}

componentDidMount(){
    this.animation();
}

// button animation

animation = () =>{
    this.animatedValue.setValue(0);

    const createAnimation = function(value, duration,easing, delay =0){
        return Animated.timing(value,{
            toValue:1,
            duration,
            easing,
            delay,
            useNativeDriver:false,
           
        })
    }
    Animated.parallel([
       createAnimation(this.animatedValue, 1200,Easing.ease,50)
    ]).start();
}

navigate = () =>{
    this.props.navigation.replace("dashboard");
}

login = async () =>{

    let device_id = DeviceInfo.getUniqueId();
    NetInfo.fetch().then( async state => {
        if(state.isConnected){
            await AsyncStorage.getItem("device_id")
   .then(result =>{
      console.log("device_id"+result);
    if(this.state.username == "" || this.state.password ===  ""){
        alert("Mobile Number and Password field is required");
    }else{
        fetch(URL+"/get_loginInfoByMobileAndPassword",{
            method:"POST",
            headers:{
                  'Content-Type': 'application/x-www-form-urlencoded',
            },
           body:"mobile_number=" +this.state.mobile_number+ "&password="+ this.state.password+ "&device_id="+device_id
        }).then( response=>response.json())
        .then(result =>{
         
            if(result.error == true){
                Alert.alert(
                    "Error",
                    result.msg
                )

               
            }else{
             
                AsyncStorage.setItem("device_id", result.devices_id.toString());
                AsyncStorage.setItem("user_id", result.id.toString());
                fetch(URL+"/get_user_details_by_user_id",{
                    method:'POST',
                    body:"user_id="+result.id.toString()
                }).then(response=>response.json())
                
                .then(result=>{
                    console.log(result)
                    if(result.user_role_name.toString()=="Admin"){Alert.alert("Access Denied","You do not have permission to login")
                this.props.navigation.replace("login")}else{
                    this.props.navigation.replace("home");
                }
                })
                
            }
        }).catch(error =>{
            console.log(error);
        })
    }
   })
        }else{
            Alert.alert(
                "NetWork Error",
                "Please Check Your Internet connection and Restart app !!",
                [
                    {
                        text:"Ok",
                        onPress:() => RNRestart.Restart(),
                        style:"success"
                    }
                ]
            );
        }
      });
   
  

    
}
    render(){
        console.log(this.state.device_id)
        const introForm = this.animatedValue.interpolate({
            inputRange:[0,1],
            outputRange:[500,4]
        });
        return(
            <View style={{
                flex:1,
            }} >
  <StatusBar barStyle="light-content" backgroundColor="#62463e" />
      <View style={ styles.barContainerStyle } >
          <View style={ styles.barTextContainer } >
    

          </View>

      </View>

  <Animated.View style={{
      top:introForm,position:'absolute',
      justifyContent:"center",
      alignItems:"center",

  }} >
  <View style={ styles.formContainer } >
   <View style={{
       flex:0.7,
       justifyContent:"center",
       alignItems:'center'

   }} >
       <Image source={require("../assets/logo45454.png")} style={{
           height:100,
           width:150,
      
       }} />
 <View style={{
     flexDirection:'row'
 }} >
    <Icon name="phone-portrait-outline" style={{
       position:"absolute",
       top:-4,
       right:0,
       left:30,
       marginTop:14
    }} size={20} color="grey" />
 <TextInput 
    placeholder="Enter Mobile Number"
    onChangeText={(value) => this.setState({
        mobile_number:value
    })}
    keyboardType="number-pad"
    style={{height:40,
        width:"80%",
        borderRadius:10,
        paddingLeft:40,
        marginHorizontal:20,
        borderBottomWidth:0.4,

        marginBottom:0,

        }}
    placeholderTextColor="black"
    />
    
 </View>
 <View style={{
     flexDirection:'row',
     marginTop:30
 }} >
    <Icon name="lock-closed-outline" style={{
          position:"absolute",
          top:8,
          right:0,
          left:30,
    }} size={20} color="grey" />
  <TextInput 

  password={true}
    placeholder="Enter Password"
    onChangeText={(value) => this.setState({
        password:value
    })}
    secureTextEntry={true}
    style={{height:40,
        width:"80%",
        borderRadius:10,
        paddingLeft:40,
        marginHorizontal:20,
        borderBottomWidth:0.4,

        marginBottom:0,

     
     
     
        }}
        onChangeValue={(value) => this.setState({
          password:value
        })}
    placeholderTextColor="black"
    maxLength={8}
    />
    
 </View>


 <View style={{
  justifyContent:'center',
  alignItems:'center'
}} >

<TouchableOpacity activeOpacity={2} onPress={() => this.login()  }  style={styles.loginButton} >
   <Text style={{
       textAlign:'center',

       color:"#FFF",
       fontSize:16,
        lineHeight:30,
        padding:5
   }} >Sign In</Text>
 </TouchableOpacity>
</View>

<TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("forgotPassword")} >
<Text style={{
        textAlign:"center",
        fontFamily:'Roboto-Bold',
        fontSize:14,
        marginTop:12,
        color:'#62463e'
    }} >Forgot Password ?</Text>
</TouchableOpacity>
   </View>
   
      </View>
  </Animated.View>

  {/* <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      height:300,
      width:400,
      backgroundColor:'#FFF'
  }} >  

  </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    barContainerStyle:{
        backgroundColor:"#62463e",
          height:170,
          width:Dimensions.get("screen").width,
          borderBottomRightRadius:15,
          borderBottomLeftRadius:15
    },
    barTextContainer:{
     
        justifyContent:"center",
        alignItems:"center"
    },
   
    formContainer:{

        position:"absolute",
        top:60,
        left:0,
        right:0,
        backgroundColor:"#FFF",
        height:Dimensions.get("screen").height,
        width:Dimensions.get("screen").width -50,
        marginHorizontal:30,
        borderRadius:20,
        flex:1,
        // justifyContent:"center",
        alignItems:"center",
        color:'grey'
    },
    textInputStyle:{
        height:40,
        width:"100%",
        textAlign:'center',
        
        marginHorizontal:30,
        borderBottomWidth:0.4,
        marginBottom:20,
        fontFamily:'Roboti-Bold',
        color:"grey"
    },
    loginButton:{
        height:40,
        width:250,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:40,
        borderRadius:5
    }
})
