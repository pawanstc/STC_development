import React, { Component } from 'react';

import { StyleSheet, View, Image,TouchableOpacity, Text, Dimensions, PermissionsAndroid, AsyncStorage, Alert, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {URL, imageUrl} from '../api.js';
import TabContainer from '../screens/TabnarComponent';


import ImagePicker from 'react-native-image-crop-picker';
import NetInfo from "@react-native-community/netinfo";
export default class Profile extends Component{

    constructor(props){
        super(props)

        this.state = {
            image: require("../assets/userProfile.png"),

            camImage:"https://www.enableds.com/products/azures21/images/avatars/2s.png",
            editPopup:false,
            first_name:"",
            mobile_number:"",
            state:"",
            district:"",
            pincode:"",
            address:"",
            company_name:"",
            last_name:"",
            email:"",
            office_address:"",
            city:"",
            role:"",
            profile_image:"",
            companyLogo:"",
            
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () =>{
            this.getUsers();
        })
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    getUsers =   ()=>{
        AsyncStorage.getItem("user_id")
        .then(result =>{
            
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
                      if(result){
                          console.log(result);
                          

                        if(result.profilePicture == null && result.profilePicture == ""){
                          this.setState({
                            profile_image:""
                          })
                        }else if(result.profilePicture == ""){
                            this.setState({
                                profile_image:""
                              })
                        }else if(result.profilePicture == null){
                            this.setState({
                                profile_image:""
                              })
                        }
                        else{
                            if(result.profilePicture.includes(".jpg")||result.profilePicture.includes(".png")||result.profilePicture.includes(".jpeg")){
                                this.setState({
                                  profile_image:result.profilePicture
                                })}else this.setState({profile_image:""})
                              }
                         

                      if(result.company_logo == null &&  result.company_logo ==""){
                        this.setState({
                          companyLogo:""
                        })
                      }else if(result.company_logo == ""){
                        this.setState({
                            companyLogo:""
                          })
                      }else if(result.company_logo == null){
                        this.setState({
                            companyLogo:""
                          })
                      }else {
                        if(result.company_logo.includes(".jpg")||result.company_logo.includes(".png")||result.company_logo.includes(".jpeg")){
                        this.setState({
                          companyLogo:result.company_logo
                        })}else this.setState({companyLogo:""})
                      }
                          this.setState({
                              first_name:result.first_name,
                              mobile_number:result.mobile_number,
                              state:result.state_name,
                              district:result.district_name,
                              address:result.office_address,
                              pincode:result.pin_code,
                              company_name:result.companyName,
                              email:result.email_id,
                              last_name :result.last_name,
                              office_address:result.office_address,
                              city:result.city_name,
                              role:result.user_role_name,
                             

                          });
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

    launchCamera = async () =>{

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title:"STC alert",
              message:"STC needs to access your camera",
              buttonNutral:"ask me latter",
              buttonNegative:"cancel",
              buttonPositive:"yes"
            }
        );

          if(granted === PermissionsAndroid.RESULTS.GRANTED){
            ImagePicker.openCamera({
  width: 300,
  height: 400,
  cropping: true,
}).then(image => {
  this.setState({
    camImage:image.path
  });
});
          }else{
            console.log("no")
          }
    }
    openMenu = () =>{
        this.setState({
            editPopup:true
        })
    }

    openMenu2 = () =>{
        this.setState({
            editPopup:false
        })
    }
    navigate = () =>{
        this.setState({
            editPopup:false
        });
        this.props.navigation.navigate("editProfile");
    }


    logout = async() =>{

        Alert.alert(
            "Logout Alert",
            "Do you really want to logout?",

            [
                {
                    text:"Yes",
                    onPress:() =>{
                        AsyncStorage.getItem("user_id")
                        .then(result =>{
                            if(result){
                                NetInfo.fetch().then(state =>{
                                    if(state.isConnected){
                                        fetch(URL+"/logout_by_user_id",{
                                            headers:{
                                                "Content-Type":"application/x-www-form-urlencoded"
                                            },
                                            method:"POST",
                                            body:"id=" + result
                                        }).then(response => response.json())
                                        .then(async result =>{ 
                                            
                                            if(result.error == false){
                                                await AsyncStorage.removeItem("user_id");
                                                await AsyncStorage.removeItem("device_id");
                                                this.props.navigation.reset({
                                                    index:0,
                                                    routes:[{name:"login"}]
                                                });
                                            }else{
                                            }
                                        })
                                    }else{
                                        Alert.alert(
                                            "Network Error",
                                            "Please check Your Internet connection"
                                        )
                                    }
                                })
                            }else{
                
                            }
                        })
                    }
                },
                {
                    text:"No",
                    onPress:() => null
                }
            ]
        )
       
      
        
    }
    render(){
        console.log(this.state.company_logo)
        return(
           <View style={{
               flex:1,
               alignItems:'center'
           }} >
               <StatusBar barStyle="light-content" backgroundColor="#62463e" />
              <View style={{
                  height:170,
                  width:Dimensions.get("screen").width,
                  borderBottomLeftRadius:20,
                  borderBottomRightRadius:20,
                backgroundColor:"#62463e",
                flexDirection:"row",
                justifyContent:"space-between"
              }} >
                 <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                 <Icon name="arrow-back-outline" color="#FFF" size={20} style={{
                      margin:15
                  }} />
                 </TouchableOpacity>
                  <Text style={{
                      fontSize:18,
                      fontWeight:"normal",
                      textAlign:"center",
                      color:"#FFF",
                      margin:15
                  }} >Profile</Text>
                  <View style={{
                      height:50,
                      width:50
                  }} >

                  </View>

              </View>

              <View style={{
                  position:"absolute",
                  top:55,
                  left:24,
                  right:24,
                 borderRadius:15,
                  backgroundColor:"#FFF",
                  width:Dimensions.get("screen").width -45,
                height:140,
                elevation:5,
                flex:1
              }} >
                 {
                     this.state.first_name != null || this.state.companyName || this.state.city ? (
                        <View style={{
                            flexDirection:"row",
                            margin:15
                            
                        }} >
                           {
                               !this.state.companyLogo   ?(
                                   <View>
                                       {
                                           this.state.profile_image == "" ? (
                                            <Image source={require("../assets/userProfile.png")} style={{
                                                height:60,
                                                width:60,
                                                borderRadius:30
                                            }} />
                                           ) : (
                                            <Image source={{uri:imageUrl+"/"+this.state.profile_image}} style={{
                                                height:40,
                                                width:40,
                                                borderRadius:20
                                            }} />
                                           )
                                       }
                                       </View>
                               ) :(
                                   <View>
                                   <Image source={{uri:imageUrl+"/"+this.state.companyLogo}} style={{
                                    height:50,
                                    width:50,
                                    borderRadius:25
                                }} />
                                   </View>
                               )
                           }
                           <View style={{
                               flexDirection:"column"
                           }} >
                                <Text numberOfLines={1} style={{
                                fontSize:24,
                                fontWeight:"bold",
                                paddingLeft:10,
                                width:200
                            }} >{ this.state.first_name }</Text>
                              <Text style={{
                                    fontSize:15,
                                    color:"grey",
                                    paddingLeft:10
                                }} >{ this.state.company_name }</Text>
                                <Text style={{
                                    fontSize:14,
                                    color:"grey",
                                    paddingLeft:10
                                }} >{this.state.role}</Text>
                                <Text style={{
                                    fontSize:15,
                                    color:"grey",
                                    paddingLeft:10
                                }} >{ this.state.state }</Text>
      
                           </View>
      
                           
      
                        </View>
                     ) :(
                         null
                     )
                 }

              </View>

              <View style={{
                  height:Dimensions.get("screen").height,
                  marginTop:45,
                  width:Dimensions.get("screen").width -45,
                  borderTopLeftRadius:20,
                  borderTopRightRadius:20,
                  backgroundColor:"#FFF",
                  elevation:4,
               
                  flex:1
            
                 
              }} >
                  {
                      this.state.first_name != null || this.state.last_name != null  ? (
                        <ScrollView 
                        contentContainerStyle={{
                              paddingBottom:50
                        }}
                          showsVerticalScrollIndicator={false}
                        style={{
                           flex:1,
                          height:Dimensions.get("screen").height +300                     
                        }} >
                        <View style={{
                            flexDirection:"row",
                            justifyContent:'space-between',
                            marginTop:12,
                            backgroundColor:"#FFF",
                            borderTopLeftRadius:30,
                            borderTopRightRadius:30,
                            alignItems:"center"
                            
                        }} >
                            <Text style={{
                                fontSize:22,
                                color:"black",
                               
                                fontWeight:"bold",
                                paddingLeft:20
                            }} >Basic Info</Text>
                            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("editProfile")} >
                            <Text style={{
                                fontSize:14,
                                fontWeight:"normal",
                                paddingRight:25,
                                marginTop:6,
                                marginBottom:6
                            }} >Edit Profile</Text>
                            </TouchableOpacity>
      
                        </View>
      
                        <View style={{
                            flex:1,
                            justifyContent:"center",
                      alignItems:"center",
                            marginTop:20
                        }} >
                          {/* first name section */}
                              <View  >
                              <Text style={{
                               color:"black",
                               fontSize:14,
                              width:100,
                              color:"#62463e",
                              fontWeight:"bold",
                              marginBottom:10
                           }} >
                               First Name
                           </Text>
                                  
                           <View style={{
                               height:45,
                               width:260,
                               borderWidth:0.4,
                               borderRadius:6,
                               borderColor:"#62463e"
                           }} >
                               <Text numberOfLines={1} style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.first_name }</Text>
                              <View  >
                                
                               
          
                              </View>
                           </View>
                              </View>
                           {/* end of first name section */}
      
                            {/* Last name section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <Text style={{
                                      color:"black",
                                      fontSize:14,
                                     width:100,
                                     color:"#62463e",
                                     fontWeight:"bold",
                                     marginTop:3,
                                     marginBottom:10
                                  }} >
                                      Last Name
                                  </Text>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold",
                                       
                                      }} >{ this.state.last_name }</Text>
                                     <View  >
                                       
                                       
                 
                                     </View>
                                  </View>
                                     </View>
                                  {/* end of Last name section */}
      
                                   {/* Email id section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View  >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:100,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Email Id
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.email }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of Email id section */}
      
                                       {/* Mobile Number id section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:185,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Mobile Number
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.mobile_number }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of Mobile Number id section */}
      
                                             {/* Company name id section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View  >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:180,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Company Name
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.company_name }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of company name id section */}
      
                                    {/* Company Address id section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View  >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:200,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Company Address
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.office_address }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of company address id section */}
      
                                   {/* state id section */}
                            <View style={{
                                marginTop:20
                            }} >
                                  <View >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:100,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    State
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.state }</Text>
                                   
                                  </View>
                                     </View>
                                  {/* end of state id section */}
      
                                   {/* city section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View  >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:100,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    City
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.city }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of city section */}
      
                                    {/* pincode section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:100,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Pin Code
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.pincode }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of pincode section */}
      
                                   {/* role section */}
                            <View style={{
                                marginTop:20
                            }} >
                                 <View  >
                                       
                                       <Text style={{
                                     color:"black",
                                     fontSize:14,
                                    width:100,
                                    color:"#62463e",
                                    fontWeight:"bold",
                                    marginBottom:10
                                 }} >
                                    Role
                                 </Text>
                
                                    </View>
                                  
                                  <View style={{
                                      height:45,
                                      width:260,
                                      borderWidth:0.4,
                                      borderRadius:6,
                                      borderColor:"#62463e",
                                      justifyContent:'center',
                                      alignSelf:"flex-end"
                                  }} >
                                      <Text style={{
                                          textAlign:"left",
                                          padding:12,
                                          fontWeight:"bold"
                                      }} >{ this.state.role }</Text>
                                    
                                  </View>
                                     </View>
                                  {/* end of role section */}
                        </View>
      
                        <View style={{
                            flexDirection:"column",
                            marginTop:20,
                            padding:20
                        }} >
                            <View style={{
                                flexDirection:"row",
                                justifyContent:'flex-start'
                            }} >
                               {
                                   this.state.profile_image != "" ? (
                                       <View>
                                            <Image source={{uri:imageUrl+"/"+this.state.profile_image}} style={{
                                    height:40,
                                    width:40,
                                    borderRadius:20
                                }} />
                                           </View>
                                   ) :(
                                       <View>
                                       <Image source={require("../assets/userProfile.png")} style={{
                                        height:40,
                                        width:40,
                                        borderRadius:20
                                    }} />
                                       </View>
                                   )
                               }
                                <Text style={{
                                    fontSize:12,
                                    fontWeight:"bold",
                                    marginTop:13,
                                    textAlign:"center",
                                    paddingLeft:10
                                }} >Profile Picture</Text>
      
                            </View>
      
                            <View style={{
                                flexDirection:"row",
                                justifyContent:'flex-start',
                                marginTop:20
                            }} >
                              {
                                  this.state.companyLogo !="" ? (
                                    <Image source={{uri:imageUrl+"/"+this.state.companyLogo}} style={{
                                        height:40,
                                        width:40,
                                        borderRadius:20
                                    }} />
                                  ) :(
                                    <Image source={require("../assets/companyLogo.jpg")} style={{
                                        height:40,
                                        width:40,
                                        borderRadius:20
                                    }} />
                                  )
                              }
                                <Text style={{
                                    fontSize:12,
                                    fontWeight:"bold",
                                    marginTop:13,
                                    paddingLeft:10
                                }} >Company Logo</Text>
      
                            </View>
      
                        </View>
      
                        <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("changePassword")} activeOpacity={2} >
                            <Text style={{
                                fontSize:18,
                                fontWeight:"bold",
                                textAlign:'center'
                            }} >Click Here To Change Password</Text>
                            </TouchableOpacity>
      
                            <TouchableOpacity activeOpacity={2} onPress={() => this.logout() } >
                                <Icon name="log-out" size={30} style={{
                                    marginTop:20
                                }} color="black" />
                                <Text style={{
                                    fontSize:16,
                                    textAlign:"center"
                                }} >Logout</Text>
                            </TouchableOpacity>
      
                        </View>
                        </ScrollView>
      
                      ) :(
                          <View style={{
                              justifyContent:'center',
                              alignItems:'center',
                              flex:0.6
                          }} >
                              <ActivityIndicator size="large" color="fff" />
                              </View>
                      )
                  }
              </View>

              {/* <View style={{
                  height:250,
                  width:Dimensions.get("screen").width -45,
                  justifyContent:'center',
                borderRadius:15,
                elevation:2,
                backgroundColor:"#FFF"
              }} >


              </View> */}

           </View>
        )
    }
}