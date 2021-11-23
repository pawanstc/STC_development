import  React, { Component } from 'react';

import  { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, TextInput, Button,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CountDown from 'react-native-countdown-component';
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
export default class ChangePassword extends Component{
    constructor(props){
        super(props);

        this.state = {
            mobile_number:"",
            is_enter_number:false,
            opt_field:"",
            is_timer_finished:true,
            opt_field2:"",
            timer_time:"",
            user_id:""
            
        }
    }

    check_if_mobile_number = ()=>{
        if(this.state.mobile_number){
            return true;
        }else{
            return false
        }
    }

    sendOtp = () =>{
        if(this.state.mobile_number ===""){
            Alert.alert(
                "Validation",
                "Please Fill the form field"
            )
            return;
        }
        NetInfo.fetch().then(state =>{
            if (state.isConnected){
                this.setState({
                    timer_time:60,
                   
                });
                fetch(URL+"/get_user_send_otp_by_mobile_no",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    body:"mobile_no="  +this.state.mobile_number
                }).then(response => response.json())
                .then(result =>{
                   console.log(result);
            
                  
                    if(result.error ==false){
                        this.setState({
                            opt_field:result.otp,
                            is_enter_number:true,
                            user_id:result.user_id
                        })
                    }else{
                        Alert.alert(
                            "Mobile Number",
                            result.msg
                        );

                        this.setState({
                            is_enter_number:false
                        })
                    }
                }).catch(error =>{
                    console.log(error);
                })
            } else{
                Alert.alert(
                    "Warning",
                    "Please Check Your Internet connection"
                )
            }
        })
        
    }
    reSendOtp = () =>{
       this.setState({
           is_timer_finished:true
       });
       NetInfo.fetch().then(state =>{
           if(state.isConnected){
            fetch(URL+"/get_user_send_otp_by_mobile_no", {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"mobile_no=" + this.state.mobile_number
            }).then(response => response.json())
            .then(result =>{
                if(result.error == false){
                    this.setState({
                        opt_field2:result.otp
                    })
                }else{
                    this.setState({
                        is_timer_finished:false
                    })
                }
            })
           }else{
            Alert.alert(
                "Network Error",
                 "Please check your Internet connection"
            )
           }
       })
    }

   submitOtp = () =>{
       console.log(this.state.mobile_number);
       NetInfo.fetch().then(state =>{
           if(state.isConnected){
            fetch(URL+"/get_user_otp_check", {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"otp=" + this.state.opt_field+ "&mobile_no=" + this.state.mobile_number
            }).then(response => response.json())
            .then(result =>{
             
                if(result.error == false){
                    this.props.navigation.navigate("passwordUpdate",{
                        user_id:this.state.user_id,
                        mobile_number:this.state.mobile_number
                    });
                }else{
                    Alert.alert(
                        "Error Message",
                        "Please Try again"
                    )
                    this.setState({
                        is_enter_number:true
                    })
                }
            }).catch(error =>{
                console.log(error);
            });
           }else{
            Alert.alert(
                "Network Error",
                "Please check Your Internet connection"
            )
           }
       })
   }
    render(){
        return(
            <View style={{
                flex:1,
                
            }} >
               <StatusBar barStyle="light-content" backgroundColor="#62463e" />
               <View style={{
                   height:170,
                   width:Dimensions.get("screen").width,
                   backgroundColor:'#62463e',
                   borderBottomLeftRadius:18,
                   borderBottomRightRadius:18,
              
               
                   flexDirection:"row",
                  justifyContent:"space-between"
               }} >

             <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
               <Icon name="arrow-back" color="#FFF" style={{
                margin:22
               }} size={18} />
             </TouchableOpacity>
                 
                   <Text style={{
                       margin:20,
                       fontSize:18,
                        color: "#FFF",
                       textAlign:"center"
                   }} > Change Password</Text>
                    <View style={{
                        height: 50,
                        width:60
               }} />

                   
               </View>

               <View style={{
                   height:Dimensions.get("screen").height,
                   width:Dimensions.get("screen").width -45,
                   backgroundColor:'#FFF',
                   position:'absolute',
                   top:75,
                   left:24,
                   right:0,
                   borderTopRightRadius:20,
                   borderTopLeftRadius:20,
           
                   alignITems:'center'
               }} >
                   <View style={{
                  flex:0.3,
                    justifyContent:"center",
                    alignItems:"center"
                   }} >
                  {
                     this.state.is_enter_number == false ? (
                         <View style={{
                        
                           
                            alignItems:"center"
                         }} >
                              <Text style={{
                  fontSize:16,
                  fontWeight:"bold",
                  marginTop:"35%"
                
                   }} >Enter Mobile Number</Text>

                   <View style={{
                       flexDirection:'row',
                       marginTop:30

                   }} >
                        <Icon name="phone-portrait-outline" size={20} color="grey" style={{
                           position:'absolute',
                        top:28,
                        left:40
                       }} />
                        <TextInput 
                        keyboardType="number-pad"
                        placeholderTextColor="black"
                        onChangeText={(value) => this.setState({
                            mobile_number:value
                        })}
                        placeholder=" Enter Mobile Number"
                        style={{
                            height:40,
                            width:"80%",
                            borderBottomWidth:0.4,
                            borderBottomColor:'black',
                            margin:22,
                            marginHorizontal:42,
                            marginTop:20,
                            paddingLeft:30,
                         
                        }}
                       />
                      

                   </View>

                   {/* <View style={{
                       flexDirection:'row',

                   }} >
                        <TextInput 
                        secureTextEntry={true}
                        placeholder="New Password"
                        style={{
                            height:40,
                            width:220,
                            borderBottomWidth:0.4,
                            borderBottomColor:'black',
                            margin:22,
                            textAlign:'center',
                            marginHorizontal:47,
                          
                        }}
                       />
                       <Icon name="lock-closed" size={18} color="grey" style={{
                           position:'absolute',
                        top:32,
                        left:50
                       }} />

                   </View>

                   <View style={{
                       flexDirection:'row',

                   }} >
                        <TextInput 
                        secureTextEntry={true}
                        placeholder="Confrm Password"
                        style={{
                            height:40,
                            width:220,
                            borderBottomWidth:0.4,
                            borderBottomColor:'black',
                            margin:22,
                            textAlign:'center',
                            marginHorizontal:47,
                            
                        }}
                       />
                       <Icon name="lock-closed" size={18} color="grey" style={{
                           position:'absolute',
                        top:32,
                        left:50
                       }} />

                   </View> */}
                  <TouchableOpacity activeOpacity={0.9} onPress={() =>  this.sendOtp()} >
                  <View style={{
                       justifyContent:'center',
                       alignItems:"center",
                       backgroundColor:'#62463e',
                       height:40,
        width:270,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:40,
        borderRadius:5
                   }} >
                       <Text style={{
                           textAlign:'center',
                           color:"#FFF",
                         
                           fontSize:18
                       }} >Submit</Text>

                   </View>
                  </TouchableOpacity>

                             </View>
                     ) :(
           
                           
                             <View style={{
                                 flex:0.1
                             }} >
                             
                             <Text style={{
                                fontSize:16,
                                fontWeight:"bold",
                                marginBottom:"20%",
                                textAlign:"center"
                            }} >Verify Mobile Number</Text>

<TextInput 
                                    
                                    placeholder="Enter Otp "
                                    onChangeText={(value) => this.setState({
                                        opt_field:value
                                    })} 
                                    
                                    style={{
                                        height:40,
                                        width:250,
                                        borderBottomWidth:0.3,
                                        borderBottomColor:"black"
                                    }}
                                    placeholderTextColor="black"
                                />

                                <View style={{
                                      flexDirection:"row",
                                      marginTop:25,
                                 
                                      justifyContent:"space-between"
                                }} >
                                      <CountDown
                size={18}
                until={ this.state.timer_time }
                onFinish={() => this.setState({
                    is_enter_number:false,
                    opt_field:""
                })}
                digitStyle={{backgroundColor: '#FFF', borderWidth: 0.2, borderColor: '#62463e'}}
                digitTxtStyle={{color: 'black'}}
                timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                separatorStyle={{color: "black"}}
                timeToShow={[ 'M', 'S']}
                timeLabels={{m: null, s: null}}
                showSeparator
              />
                <View style={{
                  height:50,
                  width:120,
             
              }} >
                  <Button
                    title="Submit Otp"
                    onPress={() => this.submitOtp()}
                    color="#62463e"
                   />
        
                  </View>
                                    

                                </View>                                    

                        
                             </View>

                     )
                  }

                    </View>
               </View>
            </View>
        )
    }
}