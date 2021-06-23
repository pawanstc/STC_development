import React, { Component } from 'react';

import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, TextInput ,AsyncStorage, Alert, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import { NetworkInfo } from "react-native-network-info";
import DeviceInfo from 'react-native-device-info';
export default class UpdatePassword extends Component{

    constructor(props){
        super(props)
        this.state = {
            oldPassword:"",
            newPassword:"",
            ipAddress:"",
            device_id:"",
            reEnterPassword:""
        }
    }

    componentDidMount(){
  
        
        this.getIpAddress();
        

    }

    getIpAddress = () =>{
        NetworkInfo.getIPAddress().then(result =>{
            this.setState({
                ipAddress:result
            });
        })
    }

    ChangePassword = () =>{
         
        if(this.state.oldPassword==''){
            Alert.alert(
                "Validation",
                "Please enter Old Password"
                )
                return;
        }else if(this.state.newPassword==''){
            Alert.alert(
                "Validation",
                "Please enter New password"
            )
        return;}else if(this.state.reEnterPassword==''){
                Alert.alert(
                    "Validation",
                "You can't leave re-enter new password field blank."
                )
                return;
            }else if(this.state.oldPassword==this.state.newPassword){
                Alert.alert(
                    "Error",
                    "New password cannot be same as old password."
                )
                return;
            }else if(this.state.newPassword!=this.state.reEnterPassword){
                Alert.alert(
                    "Validation",
                    "New password and re-enter new password do not match"
                )
                return;
            }
      
       AsyncStorage.getItem("device_id")
       .then(result =>{
        console.log(result);
                
               
               this.setState({
                   device_id:result
               })
               this.state.device_id= DeviceInfo.getUniqueId();
            AsyncStorage.getItem("user_id")
            .then(user_id =>{
               console.log(this.state.device_id)
                NetInfo.fetch().then(state =>{
                    if(state.isConnected){
                        fetch(URL+"/update_password_by_user_id",{
                            headers:{
                                "Content-Type":"application/x-www-form-urlencoded"
                            },
                            method:"POST",
                            body:"new_password=" +this.state.newPassword+ "&old_password="+this.state.oldPassword+ "&device_id="+ this.state.device_id+
                                "&modify_by_id="+ user_id+ "&modify_by_ip=" +this.state.getIpAddress+ "&user_id=" +user_id+"&retype_password="+this.state.reEnterPassword
                        }).then(response => response.json())
                        .then(result =>{
                       
                           console.log(result);
                            if(result.error == false){
                            AsyncStorage.removeItem("user_id");
                                this.props.navigation.replace("login");
                            }else{
                                Alert.alert(
                                    "Error",
                                    result.msg
                                )
                            }
                        }).catch(error =>{
                            console.log(error);
                        })
                    }else{
                        Alert.alert(
                            "NetWork Error",
                            "Please check your Internet connection"
                        );
                    }
                })
            })
        
       })
    }
    render(){
        
        return(
            <View style={{
                flex:1,
                
            }} >
               <View style={{
                   height:170,
                   width:Dimensions.get("screen").width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:"space-between"
               }} >
                  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                  <Icon name="arrow-back" size={18} color="#FFF" style={{
                       margin:20
                   }} />
                  </TouchableOpacity>
                   <Text style={{
                       fontSize:18,
                       textAlign:'center',
                    color:"#FFF",
                    margin:20
                   }} >Change Password</Text>

                    <View style={{
                        height:40,
                        width:40
                    }} />
               </View>

               <View style={{
                   flex:1,
                   justifyContent:'center',
                   alignItems:"center",
                   height:Dimensions.get("screen").height,
                   width:Dimensions.get("screen").width -45,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20,
                   position:"absolute",
                   top:75,
                   left:24,
                   right:24,
                   backgroundColor:"#FFF",
           
               }} >
                   <View style={{
                       flex:0.7,
                       width:'100%',
                       marginLeft:20,
                       paddingLeft:20
                       
                   }} >
                       
                  
                <TextInput 
                    placeholder="Enter Old Password"
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({
                        oldPassword:value
                    })}
                    style={{
                        height:45,
                        width:'90%',
                        borderWidth:0.6,
                        borderColor
                        :"#62463e",
                        padding:12,
                        borderRadius:8,
                        fontFamily:"Roboto-Bold"
                        
                    }}
                />
                 <Text style={{
                       fontSize:15,
                       color:"#62463e",
                       backgroundColor:"#FFF",
                       marginLeft:25,
                       position:'absolute',
                       top:-8,
                   }} >Enter Old Password</Text>
<TextInput 
                    placeholder="Enter New Password"
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({
                        newPassword:value
                    })}
                    style={{
                        height:45,
                        width:'90%',
                        borderWidth:0.6,
                        borderColor
                        :"#62463e",
                        padding:12,
                        borderRadius:8,
                        marginTop:30,
                        fontFamily:"Roboto-Bold"
                    }}
                />
                 <Text style={{
                       fontSize:15,
                       color:"#62463e",
                       backgroundColor:"#FFF",
                       marginLeft:25,
                       position:"absolute",
                       top:64,
                   }} >Enter New Password</Text>


<TextInput 
                    placeholder="Re-enter New Password"
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({
                        reEnterPassword:value
                    })}
                    style={{
                        height:45,
                        width:'90%',
                        borderWidth:0.6,
                        borderColor
                        :"#62463e",
                        padding:12,
                        borderRadius:8,
                        marginTop:30,
                        fontFamily:"Roboto-Bold"
                    }}
                />
                 <Text style={{
                       fontSize:15,
                       color:"#62463e",
                       backgroundColor:"#FFF",
                       marginLeft:25,
                       position:"absolute",
                       top:140,
                   }} >Re-enter New Password</Text>

                <TouchableOpacity onPress={() => this.ChangePassword()} activeOpacity={2} >
                    <View style={{
                        height:45,
                        width:'80%',
                        backgroundColor:"#62463e",
                        marginTop:45,
                        marginLeft:'5%',
                        borderRadius:6,
                        justifyContent:'center',
                        alignItems:'center',
                        
                    }} >
                        <Text style={{
                            color:"#FFF",
                            textAlign:'center',
                            fontSize:18
                        }} >Change Password</Text>

                    </View>
                </TouchableOpacity>
   
                   </View>

               </View>
            </View>
        )
    }
}