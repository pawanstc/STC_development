import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions,  StatusBar,Text,FlatList , Button, Alert, AsyncStorage, ScrollView,  TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal'
import Icons from 'react-native-vector-icons/Ionicons';
import trackPlayerService from './track_services'
import {URL, imageUrl} from '../api';
import NetInfo from "@react-native-community/netinfo";
import { NetworkInfo } from "react-native-network-info";
import Sound from 'react-native-sound'
import TrackPlayer from 'react-native-track-player';
import Textarea from 'react-native-textarea';
let urlsDomain = "https://stcapp.stcwallpaper.com/";
let {height,width} = Dimensions.get('screen')
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
        prev_img_desc:'',
        modalvisibale:false,
        remark:'No remarks',
        approve_action:false,
        dealer_remarks:'',
        distributer_remarks:'',
        remark_button:true,
        job_id:''
     } 
 }
 
 componentDidMount(){
    if(width>height){
        let temp = width;
        width= height;
        height=temp;
       
        
    }
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

    fetch(URL+"/get_job_details_by_order_id",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
       },
       method:"POST",
       body:"post_job_order_id="+this.state.order_id
       

    }).then(response=>response.json()).then(result=>{
        //console.log("result",result)
        if(result){
            console.log(result)
           this.setState({
               distributer_remarks:result.distributor_preview_description,
               dealer_remarks:result.dealer_preview_description,
               job_id:result.order_id
           })
            
        }

    }).catch(err=>console.log("error",err))

    


 
}
setOptions=()=>{
    if(this.state.status && this.state.user_type){
        
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
                      this.setState({dealer_approve:'Change/Reject Request',distributer_approve:'Pending',isDisabled:true})
                      if(this.state.dist_only==true)this.setState({dealer_approve:null})
                      break;
                  case 12:
                      this.setState({dealer_approve:'Change/Reject Request',distributer_approve:'Change/Reject Request',isDisabled:true})   
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
                    this.setState({dealer_approve:'Change/Reject Request',distributer_approve:'Pending',isDisabled:true})
                    if(this.state.dist_only==true)this.setState({dealer_approve:null})
                    break;
                case 12:
                    this.setState({dealer_approve:'Change/Reject Request',distributer_approve:'Change/Reject Request',isDisabled:true})
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
                body:"order_id="+ this.state.order_id+ "&user_id="+ result+ "&created_by_ip="+ this.state.ip_address+"&status_id="+this.state.status+"&description="+this.state.remark
            }).then(response => response.json())
            .then(result =>{
                console.log(result);
                if(!result.error){
                   

                    Alert.alert(
                        "Success Message",
                        "Preview Change/Reject Requested"
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
                        body:"order_id="+ this.state.order_id+ "&user_id="+ result+ "&created_by_ip="+ this.state.ip_address+"&status_id="+this.state.status+"&description="+this.state.remark
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
     this.setState({approve_action:false})
     this.setState({modalvisibale:true})
 }

    rejectJobAlert=()=>{
        

    Alert.alert(
        "Change/Reject Preview",
        "Are You Sure You Want To Change/Reject This Preview?",
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
     this.setState({approve_action:true})
    
        this.setState({modalvisibale:true})
 }
 approveJobAlert=()=>{
     if(this.state.user_type=='Distributor'){
  
    Alert.alert(
        "Approve Preview",
        `Are You Sure You Want To Approve This Preview?\n \nNote: Once approved order cannot be cancelled.`,
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
    )}else{
        Alert.alert(
            "Approve Preview",
            "Are You Sure You Want To Approve This Preview?",
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
 }
 checkAction=(flag)=>{
     if(flag){
    if(this.state.remark==='No remarks'){
        Alert.alert("Note!","Please add remarks!")
        return
    }
}
     
    this.setState({modalvisibale:false})
   

     if(this.state.approve_action){this.approveJobAlert()}else{
         this.rejectJobAlert()
     }
 }

 
    render(){
       
        return (
           <View style={{
               flex:1
           }} >
                <Modal backdropOpacity={0.3}
                     
         isVisible={this.state.modalvisibale}
         
         onBackButtonPress={()=>{Alert.alert("No update performed")
         this.setState({modalvisibale:false})}} >
            <View style={{flex:1}}>
             <View style={{height:380,width:'88%',marginTop:200,alignSelf:'center',backgroundColor:'white',elevation:5,borderRadius:5}}>
                 <TouchableOpacity onPress={()=>{this.setState({modalvisibale:false})}} style={{width:50,height:50,alignSelf:'flex-end'}}>
             <Icon name='x-circle' size={20} color='#62463e' style={{alignSelf:'flex-end',padding:10}}/>
             </TouchableOpacity>
                 <Text style={{color:'#62463e',fontSize:18,alignSelf:'center',fontWeight:'bold'}}>Please enter your remarks below:-</Text>
            <Textarea
             maxLength={1000}
             onChangeText={(value) =>this.setState({remark:value}) 
                
             }
containerStyle={{
    height:150,
    width:"88%",
    borderWidth:0.3,
    margin:20
}}
maxLength={80}
placeholder={'Add a remark for the following action! '}
placeholderTextColor={'#c7c7c7'}
underlineColorAndroid={'transparent'}
/>
<TouchableOpacity  onPress={()=>{this.checkAction(true)}} style={{height:40,width:80,backgroundColor:'#62463e',alignSelf:'center',alignContent:'center',marginBottom:10}}>
    <Text style={{color:'white',alignSelf:'center',fontWeight:'bold',marginTop:10,}}>NEXT</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>{this.checkAction(false)}} style={{height:40,width:200,alignSelf:'center',backgroundColor:'white',alignContent:'center',}}>
    <Text style={{color:'#62463e',alignSelf:'center',marginTop:10,}}>Skip without remarks</Text>
</TouchableOpacity>



             </View>
             </View>

         </Modal>
               
                <View style={{
                flex:1
                
            }} >
                <StatusBar barStyle="default" backgroundColor="#62463e" />
                <View style={{
                    justifyContent:"space-between",
                    height:170,
                    width:width,
                    backgroundColor:"#62463e",
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    flexDirection:"row",

                }} >
                  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                  <Icons name="arrow-back" style={{
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
                    height:height,
                    width:width -45,
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

                                       <Text style={{textAlign:'left',fontSize:18,color:'#62463e',marginLeft:10,marginTop:10}}>Job Description:</Text>
                                      
                                       <Text style={{
                                padding:20,           
                                fontSize:16,
                                color:"grey",
                                textAlign:'left'}}>{this.state.job_description}</Text>
                                   </View>
                                   
                                  
                                     
                                       <Text style={{textAlign:'left',fontSize:18,color:'#62463e',marginTop:10,marginLeft:10}}>Job Audio:</Text>
                                       
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
                            width:width*0.9,
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
                {this.state.prev_img?(<View><TouchableOpacity onPress={()=>{this.props.navigation.navigate('preview',{uri:imageUrl+""+this.state.prev_img,order_id:this.state.job_id})}}>
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
                                textAlign:'left'}}
                                selectable={true}
                                >{this.state.prev_img_desc}</Text>
                    </View>
                         <View style={{
                            width:'100%',
                            justifyContent:"center",
                            alignItems:"center",
                            flexDirection:"row",
                            
                        }}  >
                             <TouchableOpacity disabled={this.state.isDisabled} onPress={()=>this.rejectJobConf()}  >

<View style={this.state.isDisabled?styles.rejectbutton_disabled:styles.rejectbutton_enabled} >
       

       <Text style={this.state.isDisabled?styles.rejecttext_disabled:styles.rejecttext_enabled} >Change/Reject Preview
       </Text>
    </View>
</TouchableOpacity>
                 
                              <TouchableOpacity disabled={this.state.isDisabled} onPress={() =>this.approveJobconf() } >
                              <View style={this.state.isDisabled?styles.approvebutton_disabled:styles.approvebutton_enabled} >
                                  

                                   <Text style={this.state.isDisabled?styles.approvetext_disabled:styles.approvetext_enabled} >Approve Preview</Text>
                                </View>
                              </TouchableOpacity>
                 

                          
                            
                    
                       
                            
                           
           

                        </View>
                       
                        {this.state.dealer_approve?(<View><Text style={{
                      
                                            fontSize:16,
                                            padding:10,
                                            color:"grey",
                                            textAlign:'left'
                                            }}>Dealer Status:-{this.state.dealer_approve}</Text>
                                            <Text style={{
                      
                      fontSize:16,
                      padding:10,
                      color:"grey",
                      textAlign:'left'}}>Dealer Remarks:-{this.state.dealer_remarks}</Text></View>):null}
                                            {this.state.distributer_approve?(<View><Text style={{
                                            fontSize:16,
                                            padding:10,
                                            color:"grey",
                                            textAlign:'left'}}>Distributor Status:-{this.state.distributer_approve}</Text>
                                            <Text style={{
                                                fontSize:16,
                                                padding:10,
                                                color:"grey",
                                                textAlign:'left'}}>Distributor Remarks:-{this.state.distributer_remarks}</Text></View>):null}
                                            
               
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
        width:width*0.43,
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
        width:width*0.43,
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
        width:width*0.43,
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
        width:width*0.43,
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