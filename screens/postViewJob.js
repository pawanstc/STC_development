import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions,  StatusBar,Text,FlatList , Button, Alert, AsyncStorage, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Ionicons';
import trackPlayerService from './track_services'
import {URL, imageUrl} from '../api';
import NetInfo from "@react-native-community/netinfo";
import { NetworkInfo } from "react-native-network-info";
import Sound from 'react-native-sound'
import TrackPlayer from 'react-native-track-player';
let urlsDomain = "https://stcapp.stcwallpaper.com/";
export default class postViewJob extends Component{

 constructor(props){
     super(props);

     this.state = {
         pattern_number:this.props.route.params.pattern_number,
         order_image:this.props.route.params.order_image,
         supportive_image:this.props.route.params.supportive_image,
         //button_show:this.props.route.params.button_show,
         order_id:this.props.route.params.order_id,
         ordered_by:this.props.route.params.ordered_by,
         job_description:this.props.route.params.job_description,
         audio:this.props.route.params.audio,
         order_user_type:this.props.route.params.user_type,
         ip_address:"",
         prev_img:'',
         distributer_approve:'',
         dealer_approve:'',
         user_type:'unknown',
         status:'',
         isDisabled:true,
        user_id:'',
        description:'',
        dist_only:false,
        prev_img_desc:''

     } 
 }
 
 componentDidMount(){
    if(this.state.order_user_type=="Distributor")this.setState({dist_only:true})
    
    console.log(this.state.dist_only)
TrackPlayer.setupPlayer().then(()=>{
    console.log("player set")

    
})
TrackPlayer.registerPlaybackService(()=>trackPlayerService)
    
console.log(this.state.job_description)
    console.log("ordered by")
    console.log(this.state.ordered_by)
     AsyncStorage.getItem("user_id")
     .then(result =>{
         
         NetInfo.fetch().then(state =>{
             if(state.isConnected){
                 console.log('fetching')
               fetch(URL+"/get_user_details_by_user_id", {
                   headers:{
                       "Content-Type":"application/x-www-form-urlencoded"
                   },
                   method:"POST",
                   body:"user_id=" +result
               }).then(response => response.json())
               .then(result =>{
                   if(result){
                       
                       console.log(result)
                       //console.log(result.user_role_name)
                       
                          this.setState({user_type:result.user_role_name})
                       console.log(this.state.user_type)
                    }
                })
            }
         })
        })
    
     console.log(this.state.user_type)
    NetworkInfo.getIPV4Address().then(ipv4Address => {
        this.setState({
            ip_address:ipv4Address
        })
      });

      AsyncStorage.getItem("user_id")
      .then(result=>this.setState({user_id:result}));

    

        console.log(this.state.order_id)
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
               
                status:st[0].order_status_id,
                description:st[0].status_name
            })
            console.log("helolo")
            console.log("h")
            console.log(this.state.status);
        this.get_prevImage()
        
        }
        
    }).catch(error=>console.log(error))

    


 
}
setOptions=()=>{
    if(this.state.status && this.state.user_type){
        console.log(this.state.user_type)
        console.log(this.state.status)
        console.log("chana badam")
        console.log(this.state.order_image)
        console.log(this.state.supportive_image)
      switch(this.state.user_type){
          case 'Dealer':
              switch (this.state.status) {
                  
                  case 9:
                      this.setState({dealer_approve:''})
                      this.setState({distributer_approve:''})
                      this.setState({isDisabled:false})
                      if(this.state.user_id==this.state.ordered_by)this.setState({isDisabled:false});else this.setState({isDisabled:true}) 
                      break;
                  case 10:
                      this.setState({dealer_approve:'Approved',distributer_approve:'Pending',isDisabled:true})
                      console.log(this.state.dealer_approve)
                      if(this.state.dist_only==true)this.setState({dealer_approve:''})
                      break;
                      case 8:
                          this.setState({dealer_approve:'Approved',distributer_approve:'Approved',isDisabled:true})
                          if(this.state.dist_only==true)this.setState({dealer_approve:null})
                          break;
                  case 11:
                      this.setState({dealer_approve:'Rejected',distributer_approve:'Pending',isDisabled:true})
                      if(this.state.dist_only==true)this.setState({dealer_approve:null})
                      break;
                  case 12:
                      this.setState({dealer_approve:'Rejected',distributer_approve:'Rejected',isDisabled:true})   
                      if(this.state.dist_only==true)this.setState({dealer_approve:null}) 
                  default:
                      this.setState({isDisabled:true})
                      break;
              }
              break;
          case 'Distributor':
              switch(this.state.status){
                case 9:
                    this.setState({dealer_approve:''})
                    this.setState({distributer_approve:''})
                    this.setState({isDisabled:true})
                    if(this.state.user_id==this.state.ordered_by)this.setState({isDisabled:false})
                    break;
                case 10:
                    this.setState({dealer_approve:'Approved',distributer_approve:'Pending',isDisabled:false})
                    if(this.state.user_id==this.state.ordered_by)this.setState({isDisabled:false})
                    if(this.state.dist_only==true)this.setState({dealer_approve:null})
                    break;
                    case 8:
                        this.setState({dealer_approve:'Approved',distributer_approve:'Approved',isDisabled:true})
                        if(this.state.dist_only==true)this.setState({dealer_approve:null})
                        break;
                        
                case 11:
                    this.setState({dealer_approve:'Rejected',distributer_approve:'Pending',isDisabled:true})
                    if(this.state.dist_only==true)this.setState({dealer_approve:null})
                    break;
                case 12:
                    this.setState({dealer_approve:'Rejected',distributer_approve:'Rejected',isDisabled:true})
                    if(this.state.dist_only==true)this.setState({dealer_approve:null})
                    break;    
                default:
                    this.setState({isDisabled:true})
                    break;
              }   
              
            default:
                
                break;  

      }   
    }

   
}

playSound=()=>{
    console.log(imageUrl+this.state.audio)
    var url=urlsDomain+this.state.audio
    var url1='https://stcapp.stcwallpaper.com/audio/audio-20210508151225.wav'
    url.toString();
  const track ={
      id:'1',
      url:url,
      title:"audio",
      artist:'new1'
  }
      TrackPlayer.add([track]).then(()=>{
        TrackPlayer.play();
    
      })
    

  
     
//SoundPlayer.loadUrl(url)
//SoundPlayer.play()
   
}

pauseSound=()=>{
    TrackPlayer.pause();
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
            console.log(result)
        this.setState({
            prev_img:result.upload_image_url,
            prev_img_desc:result.description
        })
        this.setOptions()
        console.log(this.state.prev_img)}else{Alert.alert("Failed",'Failed to get preview image')}
        console.log(this.state.order_image)
    })
      
}



     setStatus=()=>{
         console.log("setting status")
         console.log(this.state.user_type)
         if(this.state.user_type=='Dealer'){this.setState({status:10})
        console.log(this.state.status)}
         else if(this.state.user_type=='Distributor')this.setState({status:8})
     }
     rejectStatus=()=>{
        if(this.state.user_type=='Dealer')this.setState({status:11})
        else if(this.state.user_type=='Distributor')this.setState({status:12})
     }
     
 
rejectJob=()=>{
    
    this.rejectStatus()
    console.log('Rejecting')
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
                if(!result.error){
                   

                    Alert.alert(
                        "Success Message",
                        "Preview Rejected"
                    )
                    this.props.navigation.replace("onGoingJob");
                }
            }).catch(error =>{
                console.log(error)
                Alert.alert(
                    "Error Message",
                    {error}
                );
            })
        }else{
            Alert.alert(
                "Network Error",
                "Please check your Internet connection"
            )
        }
    }).catch(err=>console.log(err))
}
    })
}
levelCheck=()=>{
    let level=false
    if(this.state.status==9 && this.state.user_type=='Dealer')level=true;
    if(this.state.status==10 && this.state.user_type=='Distributor')level=true;
    return level
}

 approveJob = () =>{

    if(!this.levelCheck){Alert.alert('Error','You are not allowed to approve this job yet!');return}else{
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
                        console.log(this.state.order_id)
                        console.log("status update result")
                        console.log(result);
                        if(!result.error){
                            this.setState({
                                button_show:"No"
                            });

                            Alert.alert(
                                "Success Message",
                                "Preview Approved Successfully"
                            )
                            this.props.navigation.replace("onGoingJob");
                        }else{console.log(result.error)}
                    }).catch(error =>{
                        console.log(error);
                        Alert.alert(
                            "Error Message",
                            {error}
                        )
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
 }

 rejectJobConf=()=>{
    Alert.alert(
        "Reject Preview",
        "Are You Sure You Want To Reject This Preview",
        [
            {
                text:"Ok",
                onPress:() => this.rejectJob()
            },
            {
                text:"Cancel",
                onPress:() => null
            }
        ]
    )
 }
 approveJobconf=()=>{
    Alert.alert(
        "Approve Preview",
        "Are You Sure You Want To Approve This Preview",
        [
            {
                text:"Ok",
                onPress:() => this.approveJob()
            },
            {
                text:"Cancel",
                onPress:() => null
            }
        ]
    )
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
                    }} >PreView Job</Text>
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
                         <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} >

                                       <Text style={{textAlign:'center',fontSize:18,color:'#62463e',marginTop:10}}>JOB STATUS</Text>
                                       <Text style={{
                                fontSize:16,
                                color:"grey",
                                textAlign:'center'}}>{this.state.description}</Text>
                                   </View><View style={{elevation:2,marginBottom:4}}>

                                   <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} >

                                       <Text style={{textAlign:'left',fontSize:18,color:'#62463e',marginLeft:10,marginTop:10}}> Job Description:</Text>
                                      
                                       <Text style={{
                                padding:20,           
                                fontSize:16,
                                color:"grey",
                                textAlign:'left'}}>{this.state.job_description}</Text>
                                   </View>
                                   
                                  
                                     
                                       <Text style={{textAlign:'left',fontSize:18,color:'#62463e',marginTop:10}}>Job Audio:</Text>
                                       
                                       <View>
                                       {this.state.audio?(<View style={{flexDirection:'row'}}>
                                       <View style={{height:50,width:50}}>
                                       <Icons name="play" style={{
                                           height:50,
                                           width:50,
                                        marginTop:10,
                                        marginLeft:20
                                    }} color="blue" size={40}  onPress={() => this.playSound()} /></View>
                                   
                                    <View style={{height:50,width:50}}>
                                       <Icons name="pause" style={{
                                           height:50,
                                           width:50,
                                        marginTop:10,
                                        marginLeft:20
                                    }} color="blue" size={40}  onPress={() => this.pauseSound()} /></View>
                                     <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} />
                                    
                                    </View>
                                       
                                       ):
                                       <Text style={{
                                padding:20,           
                                fontSize:16,
                                color:"grey",
                                textAlign:'center'}}>No Job Audio</Text>}
                                   </View>
                                       
                                   <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} />
                        <View style={{
									  
									   
                                        flexDirection:'row',
                                        alignItems:'center'
								   }} >
                        <Text style={{
                        fontSize:18,
                        fontWeight:"normal",
                        margin:8,
                        color:'#62463e'
                    }} >Pattern:</Text>
                   
                    </View>


                    <Image source={{uri:imageUrl+""+this.state.order_image}}  
                        style={{
                            height:240,
                            width:'95%',
                            borderRadius:4,
                            elevation:5,
                            margin:10,
                           
                        }}
                    />
                     <View style={{
									  
									   borderBottomWidth:0.5,
   
								   }} >
                     <Text style={{
                        fontSize:18,
                        fontWeight:"normal",
                        margin:8,
                        color:"#62463e",
                        textAlign:'center'
                    }} >{this.state.pattern_number}</Text>
                    </View>
                    </View>
                    <View style={{marginBottom:4}}>
                    <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} >
                             <Text style={{
                        fontSize:18,
                        margin:10,
                        color:'#62463e',
                        textAlign:'left'
                    }} >Support Images:</Text>
                    </View>
                    <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} ></View>
                {
                    this.state.supportive_image.length > 0 ? (
                        <View>
                            
                    
                    <FlatList
                  numColumns={1}
                  horizontal={true}
                   
                        data={this.state.supportive_image}
                        renderItem={(items) =>{
                            return(
                               
                                <View style={{
                                    flex:1,
                                    alignItems:"center"
                                }} >
                                     <ScrollView
                                horizontal={true}
                                 showsHorizontalScrollIndicator={true}>
                                   <Image source={{uri:imageUrl+"/"+items.item.image_url}}  
                        style={{
                            height:240,
                            width:Dimensions.get('screen').width*0.80,
                            borderRadius:4,
                            elevation:5,
                            margin:10,
                            borderWidth:1,
                            borderColor:"#eeee"
                        }}
                    />
                     </ScrollView>

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
                                color:"grey",
                                textAlign:'center'
                            }} >No supportive image found</Text>

                            </View>
                    )
                }
                </View>
                <View style={{marginBottom:4,borderRadius:4}}>
                <View style={{
									   padding:10,
									   borderBottomWidth:0.5,
   
								   }} >
<Text style={{ fontSize:18,
                        
                        marginTop:10,
                        textAlign:'left',
                        color:'#62463e'
                    }} >Preview Images:</Text>
                    </View>
                {this.state.prev_img?(<View><TouchableOpacity onPress={()=>{this.props.navigation.navigate('preview',{uri:imageUrl+""+this.state.prev_img,order_id:this.state.order_id})}}>
                <Image source={{uri:imageUrl+""+this.state.prev_img}}  
                        style={{
                            height:240,
                            width:'97%',
                            borderRadius:4,
                            elevation:5,
                            marginTop:5,
                            alignSelf:'center',
                            //marginBottom:1,
                            borderWidth:1,
                            borderColor:"#eeee"
                        }}
                    /></TouchableOpacity>
                     <View style={{
									   
									   borderBottomWidth:0.5,
   
								   }} >
                             <Text style={{
                        fontSize:18,
                        margin:5,
                        color:'#62463e',
                        textAlign:'left'
                    }} >Description:</Text>
                     <Text style={{
                                padding:10,           
                                fontSize:16,
                                color:"grey",
                                textAlign:'left'}}>{this.state.prev_img_desc}</Text>
                    </View>
                         <View style={{
                            width:'100%',
                            justifyContent:"center",
                            alignItems:"center",
                            flexDirection:"row",
                            
                        }}  >
                             <TouchableOpacity disabled={this.state.isDisabled} onPress={()=>this.rejectJobConf()}  >

<View style={this.state.isDisabled?styles.rejectbutton_disabled:styles.rejectbutton_enabled} >
       

       <Text style={this.state.isDisabled?styles.rejecttext_disabled:styles.rejecttext_enabled} >Reject Preview
       </Text>
    </View>
</TouchableOpacity>
                 
                              <TouchableOpacity disabled={this.state.isDisabled} onPress={() =>this.approveJobconf() } >
                              <View style={this.state.isDisabled?styles.approvebutton_disabled:styles.approvebutton_enabled} >
                                  

                                   <Text style={this.state.isDisabled?styles.approvetext_disabled:styles.approvetext_enabled} >Approve Preview</Text>
                                </View>
                              </TouchableOpacity>
                 

                          
                            
                    
                       
                            
                           
           

                        </View>
                       
                        {this.state.dealer_approve?(<Text style={{
                      
                                            fontSize:16,
                                            padding:10,
                                            color:"grey",
                                            textAlign:'left'
                                            }}>Dealer Status:-{this.state.dealer_approve}</Text>):null}
                                            {this.state.distributer_approve?(<Text style={{
                                            fontSize:16,
                                            padding:10,
                                            color:"grey",
                                            textAlign:'left'}}>Distributor Status:-{this.state.distributer_approve}</Text>):null}
                                            
               
                    </View>
                                        ):(<Text style={{
                                            fontSize:16,
                                            color:"grey",
                                            textAlign:'center'
                                    
                                        }}>No preview image found</Text>)}
                                        
                                        </View>

                                      
                        
                   </ScrollView>
                      

                </View>
               
            </View>
           

            
                       

                      
                          
                     
                       
                        </View>
                       
    
                               
    
    
                           
                        
           
        )
                                
                                }
                            }

const styles = StyleSheet.create({
    rejectbutton_enabled:{
        backgroundColor:"#f4f4f4",
        height:44,
        width:Dimensions.get('window').width*0.43,
        justifyContent:'center',
        alignItems:"center",
        
        borderWidth:1.5,
        borderColor:'#be0000'

    },
    rejecttext_enabled:{
        textAlign:"center",
           color:'#be0000',
           
           fontSize:16

    },
    approvebutton_enabled:{
        backgroundColor:"#2b580c",
        height:44,
        width:Dimensions.get('window').width*0.43,
       justifyContent:"center",
        alignItems:"center",
        //flexGrow:0.5,
        //borderRadius:10,
        borderColor:'#2b580c',
        borderWidth:1.5
    },
    approvetext_enabled:{
        textAlign:"center",
        color:"#FFFF",
        marginBottom:2,
        fontSize:16

    },
    rejectbutton_disabled:{
        backgroundColor:"#f4f4f4",
        height:44,
        width:Dimensions.get('window').width*0.43,
        justifyContent:'center',
        alignItems:"center",
        
        borderWidth:1.5,
        borderColor:'#bababa'
    },
    rejecttext_disabled:{
        textAlign:"center",
           color:'#bababa',
           
           fontSize:16
    },
    approvebutton_disabled:{
        backgroundColor:"#f4f4f4",
        height:44,
        width:Dimensions.get('window').width*0.43,
        justifyContent:'center',
        alignItems:"center",
        
        borderWidth:1.5,
        borderColor:'#bababa'
    },
    approvetext_disabled:{
        textAlign:"center",
           color:'#bababa',
           
           fontSize:16
    }

});