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
         ip_address:"",
         prev_img:'',
         distributer_approve:false,
         dealer_approve:false,
         user_type:'',
         status:'',
         upld_stat:true,
        user_id:'',
        description:''

     } 
 }
 setUserType=()=>{
    fetch(URL+"/get_user_details_by_user_id",{
        method:'POST',
        body:"user_id="+this.state.user_id
    }).then(response=>response.json())
    .then(result=>{
        this.setState({user_type:result.user_role_name})
        console.log(this.state.user_type)
    })
}

 componentDidMount(){
     console.log(this.state.order_image);
    NetworkInfo.getIPV4Address().then(ipv4Address => {
        this.setState({
            ip_address:ipv4Address
        })
      });

      AsyncStorage.getItem("user_id")
      .then(result=>this.setState({user_id:result}));

    ()=>setUserType()

      
       fetch(URL+"/get_latest_order_status_by_post_job_order_id",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        method:"POST",
        body:"post_job_order_id="+this.state.order_id
    }).then(response=>response.json())
    .then(result=>{
        console.log(result);
        console.log(result.status_details)
        let st=result.status_details
        console.log(st)
        if(result){
            this.setState({
               
                status:st[0].order_status_id
                
            })
            console.log("helolo")
            console.log("h")
            console.log(this.state.status);
            if(this.state.status==9){this.get_prevImage()}
        }
    }).catch(error=>console.log(error))
 
}

get_prevImage=()=>{
console.log("heloo preview")
    fetch(URL+"/get_approve_image_by_order_id",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        method:"POST",
        body:"post_job_order_id="+this.state.order_id
    }).then(response=>response.json())
    .then(result=>{
        if(result){
            
        this.setState({
            prev_img:result.upload_image_url
        })
        console.log(this.state.prev_img)}else{Alert.alert("Failed",'Failed to get preview image')}

    })
       if(this.state.status==9 && this.state.user_type=='Dealer'){
           
        this.setState({upld_stat:false})
    console.log(this.state.upld_stat)}
       else if(this.state.status==10 && this.state.user_type=='Distributer')this.setState({upld_stat:false})
}



     setStatus=()=>{
         if(this.state.user_type=='Dealer')this.setState({status:10})
         else if(this.state.user_type=='Distributer')this.setState({status:8})
     }
     rejectStatus=()=>{
        if(this.state.user_type=='Dealer')this.setState({status:11})
        else if(this.state.user_type=='Distributer')this.setState({status:12})
     }
     
 
rejectJob=()=>{
    this.rejectStatus()

    NetInfo.fetch().then(state =>{
        if(state.isConnected){
            fetch(URL+"/order_accep_reject_by_order_id", {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"order_id="+ this.state.order_id+ "&user_id="+ result+ "&created_by_ip="+ this.state.ip_address+"&status_id="+this.state.status+"&description="+this.state.description
            }).then(response => response.json())
            .then(result =>{
                console.log(result);
                if(result){
                    this.setState({
                        button_show:"No"
                    });

                    Alert.alert(
                        "Success Message",
                        "Rejected"
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
    
}


 approveJob = () =>{
    this.setStatus()

    AsyncStorage.getItem("user_id")
    .then(result =>{
        if(result){
            console.log(result);
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/order_accep_reject_by_order_id", {
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        method:"POST",
                        body:"order_id="+ this.state.order_id+ "&user_id="+ result+ "&created_by_ip="+ this.state.ip_address+"&status_id="+this.state.status+"&description="+this.state.description
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
                    vertical={true}
                    showsVerticalScrollIndicator={true}
                   contentContainerStyle={{
                       paddingBottom:180
                   }} >
                        <Text style={{
                        fontSize:16,
                        fontWeight:"normal",
                        margin:8
                    }} >Pattern Number</Text>

<Text style={{
                        fontSize:16,
                        fontWeight:"normal",
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
                    }} >Support Images:</Text>

                    <FlatList
                  numColumns={2}
                   
                        data={this.state.supportive_image}
                        renderItem={(items) =>{
                            return(
                                <View style={{
                                    flex:1,
                                    alignItems:"center"
                                }} >
                                   <Image source={{uri:urlsDomain+"/"+items.item.image_url}}  
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

                                    </View>
                            )
                        }}
                        keyExtractor={(item) => item.id}
                    />
                            </View>
                    ) :(
                        <View style={{
                            justifyContent:"center",
                            
                            marginTop:20
                        }} >
                            <Text style={{
                                fontSize:16,
                                color:"grey"
                            }} >No supportive image found</Text>

                            </View>
                    )
                }

<Text style={{ fontSize:14,
                        margin:20,
                        marginTop:20
                    }} >Preview Images:</Text>
                {this.state.prev_img?(<TouchableOpacity onPress={()=>{this.props.navigation.navigate('preview',{uri:urlsDomain+""+this.state.prev_img,order_id:this.state.order_id})}}>
                <Image source={{uri:urlsDomain+""+this.state.prev_img}}  
                        style={{
                            height:140,
                            width:160,
                            borderRadius:4,
                            elevation:5,
                            margin:10,
                            borderWidth:1,
                            borderColor:"#eeee"
                        }}
                    /></TouchableOpacity>
                                        ):(<Text>No Preview image Found</Text>)}

                   </ScrollView>
                   

                </View>

            </View>
            
               

            
                       

                      
                          
                        <View style={{
                            flex:0.1,
                            justifyContent:"center",
                            alignItems:"center",
                            flexDirection:"row"
                        }}  >
                             <TouchableOpacity disabled={this.state.upld_stat} onPress={()=>this.rejectJob}  >

<View style={{
        height:40,
        width :Dimensions.get("screen").width/2,
        backgroundColor:"#f58634",
        justifyContent:'center',
        //alignItems:"center"
        flexGrow:0.5,
        borderRadius:10,
        margin:10
        
    }} >
       

       <Text style={{
           textAlign:"center",
           color:"#FFFF",
           fontSize:16
       }} >Reject Job
       </Text>
    </View>
</TouchableOpacity>
                 
                              <TouchableOpacity disabled={this.state.upld_stat} onPress={() =>this.approveJob() } >
                              <View style={{
                                    height:40,
                                    width :Dimensions.get("screen").width/2,
                                    backgroundColor:"#81b214",
                                    justifyContent:"center",
                                    //alignItems:"center"
                                    flexGrow:0.5,
                                    borderRadius:10,
                                    margin:10
                                }} >
                                  

                                   <Text style={{
                                       textAlign:"center",
                                       color:"#FFFF",
                                       fontSize:16
                                   }} >Approve Job</Text>
                                </View>
                              </TouchableOpacity>
                 

                          
                            
                    
                       
                            
                           
           

                        </View>
                       
                        </View>
                       
    
                               
    
    
                           
                        
           
        )
                                
                                }
                            }

