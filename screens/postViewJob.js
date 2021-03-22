import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions,  StatusBar,Text,FlatList , Button, Alert, AsyncStorage, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {URL, imageUrl} from '../api';
import NetInfo from "@react-native-community/netinfo";
import { NetworkInfo } from "react-native-network-info";

let urlsDomain = "https://stcapp.stcwallpaper.com";
export default class postViewJob extends Component{

 constructor(props){
     super(props);

     this.state = {
         pattern_number:this.props.route.params.pattern_number,
         order_image:this.props.route.params.order_image.replace("\\", "/"),
         supportive_image:this.props.route.params.supportive_image,
         button_show:this.props.route.params.button_show,
         order_id:this.props.route.params.order_id,
         ip_address:""
     } 
 }

 componentDidMount(){
     console.log(this.state.order_image);
    NetworkInfo.getIPV4Address().then(ipv4Address => {
        this.setState({
            ip_address:ipv4Address
        })
      });
 }

 approveJob = () =>{

    AsyncStorage.getItem("user_id")
    .then(result =>{
        if(result){
            console.log(result);
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/distributor_approve_order_status_by_order_id", {
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        method:"POST",
                        body:"order_id="+ this.state.order_id+ "&user_id="+ result+ "&created_by_ip="+ this.state.ip_address
                    }).then(response => response.json())
                    .then(result =>{
                        console.log(result);
                        if(result){
                            this.setState({
                                button_show:"No"
                            });

                            Alert.alert(
                                "Success Message",
                                "Approve Successfully"
                            )
                            this.props.navigation.replace("onGoingJob");
                        }
                    }).catch(error =>{
                        console.log(error);
                    })
                }else{
                    Alert.alert(
                        "Network Error",
                        "Please check your Internet connection"
                    )
                }
            })
        }else{

        }
    })
   
 }
    render(){
       
        return (
           <View style={{
               flex:1
           }} >
                <View style={{
                flex:1
            }} >
                <StatusBar barStyle="default" backgroundColor="#62463e" />
                <View style={{
                    justifyContent:"space-between",
                    height:170,
                    width:Dimensions.get("screen").width,
                    backgroundColor:"#62463e",
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    flexDirection:"row",

                }} >
                  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                  <Icon name="arrow-back" style={{
                        margin:20
                    }} size={18} color="#FFFF" />
                  </TouchableOpacity>

                    <Text style={{
                        textAlign:"center",
                        fontSize:18,
                        color:"#FFF",
                        margin:20
                    }} >Post View Job</Text>
                    <View style={{
                        height:40,
                        width:60
                    }} />

                </View>

                <View style={{
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width -45,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    position:"absolute",
                    top:70,
                    left:24,
                    right:24,
                    backgroundColor:"#fff",
                    flex:1
                }} >
                   <ScrollView 
                    vertical={false}
                    showsVerticalScrollIndicator={false}
                   contentContainerStyle={{
                       paddingBottom:150
                   }} >
                        <Text style={{
                        fontSize:16,
                        fontWeight:"normar",
                        margin:10
                    }} >Pattern Number</Text>

<Text style={{
                        fontSize:16,
                        fontWeight:"normar",
                        margin:10,
                        color:"blue"
                    }} >{this.state.pattern_number}</Text>
                    <Image source={{uri:urlsDomain+""+this.state.order_image}}  
                        style={{
                            height:140,
                            width:160,
                            borderRadius:4,
                            elevation:5,
                            margin:10,
                            borderWidth:1,
                            borderColor:"#eeee"
                        }}
                    />

                {
                    this.state.supportive_image.length > 0 ? (
                        <View>
                             <Text style={{
                        fontSize:14,
                        margin:20,
                        marginTop:20
                    }} >Suppert Images:</Text>

                    <FlatList
                  numColumns={2}
                   
                        data={this.state.supportive_image}
                        renderItem={(items) =>{
                            return(
                                <View style={{
                                    flex:1,
                                    alignItems:"center"
                                }} >
                                    <Image source={{uri:imageUrl+"/"+items.item.image_url}} style={{
                                        height:120,
                                        width:130,
                                        borderWidth:1,
                                        borderColor:"#EEEE",
                                        borderRadius:3,
                                        elevation:6,
                                        margin:10,
                                        borderWidth:0.6,
                                        borderColor:"black"
                                    }} />

                                    </View>
                            )
                        }}
                        keyExtractor={(item) => item.id}
                    />
                            </View>
                    ) :(
                        <View style={{
                            justifyContent:"center",
                            alignItems:'center',
                            marginTop:20
                        }} >
                            <Text style={{
                                fontSize:16,
                                color:"grey"
                            }} >No supportive image fround</Text>

                            </View>
                    )
                }

                {/* {
                    this.state.button_show == "Yes" ? (
                        <View style={{
                     flex:0.7,
                            justifyContent:"center",
                            alignItems:"center"
                        }} >
                 
                                <View style={{
                                    height:45,
                                    width :180,
                                    
                                }} >
                                   <Button title="Approvrd" onPress={() => this.approveJob() } color="green" />
                                </View>
                 

                            </View>
                    ) :( <View style={{
                       flex:0.7,
                        justifyContent:"center",
                        alignItems:"center"
                    }} >
                       
                            <View style={{
                                height:45,
                                width :180,
                            }} >
                                  <Button title="Approvrd" disabled={true} color="green" />
                            </View>
           

                        </View>)
                } */}

                   </ScrollView>
                   

                </View>

            </View>
               

            {
                    this.state.button_show == "Yes" ? (
                        <View style={{
                
                            justifyContent:"center",
                            alignItems:"center"
                        }} >
                 
                              <TouchableOpacity onPress={() =>this.approveJob() } >
                              <View style={{
                                    height:40,
                                    width :Dimensions.get("screen").width,
                                    backgroundColor:"green",
                                    justifyContent:"center",
                                    alignItems:"center"
                                    
                                }} >
                                   {/* <Button title="Approvrd" onPress={() => this.approveJob() } color="green" /> */}

                                   <Text style={{
                                       textAlign:"center",
                                       color:"#FFFF",
                                       fontSize:16
                                   }} >Approve Job</Text>
                                </View>
                              </TouchableOpacity>
                 

                            </View>
                    ) :( <View style={{
                    
                        justifyContent:"center",
                        alignItems:"center"
                    }} >
                       
                            {/* <View style={{
                                height:30,
                                width :Dimensions.get("screen").width,
                            }} >
                                  <Button title="Approvrd" disabled={true} color="green" />
                            </View> */}

                            <TouchableOpacity onPress={() => this.approveJob() } >

                            <View style={{
                                    height:40,
                                    width :Dimensions.get("screen").width,
                                    backgroundColor:"grey",
                                    justifyContent:"center",
                                    alignItems:"center"
                                    
                                }} >
                                   {/* <Button title="Approvrd" onPress={() => this.approveJob() } color="green" /> */}

                                   <Text style={{
                                       textAlign:"center",
                                       color:"#FFFF",
                                       fontSize:16
                                   }} >Approve Job
                                   </Text>
                                </View>
                            </TouchableOpacity>
           

                        </View>)
                }
           </View>
        )
    }
}