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
      
        AsyncStorage.getItem("user_id")
        .then(user_id =>{
            console.log("user_id"+this.props.route.params.user_id);
            let uniqueId =   DeviceInfo.getUniqueId();
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/update_password_by_user_id",{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        method:"POST",
                        body:"new_password=" +this.state.newPassword+ "&old_password="+this.state.oldPassword+
                            "&modify_by_ip=" +this.state.getIpAddress+ "&mobile_no="+ this.props.route.params.mobile_number+ "&retype_password="+this.state.reEnterPassword
                    }).then(response => response.json())
                    .then(result =>{
                       console.log(result);
                        if(result.error == false){
                        AsyncStorage.removeItem("user_id");
                            this.props.navigation.replace("login");
                        }else{
                            Alert.alert(
                                "Error",
                                "Password update not successfully"
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
                   }} >Update Password</Text>

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
                       flex:0.7
                   }} >
                       
                  
                <TextInput 
                    placeholder="Enter Old Password"
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({
                        oldPassword:value
                    })}
                    style={{
                        height:45,
                        width:280,
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
                       position:"absolute",
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
                        width:280,
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
                        width:280,
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
                       position:"absolute",
                       top:140,
                   }} >Re-enter New Password</Text>

                <TouchableOpacity onPress={() => this.ChangePassword()} activeOpacity={2} >
                    <View style={{
                        height:45,
                        width:300,
                        backgroundColor:"#62463e",
                        marginTop:45,
                        borderRadius:6,
                        justifyContent:'center',
                        alignItems:'center'
                    }} >
                        <Text style={{
                            color:"#FFF",
                            textAlign:'center',
                            fontSize:18
                        }} >Update Password</Text>

                    </View>
                </TouchableOpacity>
   
                   </View>

               </View>
            </View>
        )
    }
}