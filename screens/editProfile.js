import React, { Component } from 'react';

import { View, StyleSheet, Image, TouchableOpacity,Text, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, Keyboard, PermissionsAndroid, AsyncStorage,   Alert, ImageComponent  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabContainer from '../screens/TabnarComponent';
import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-picker';
import { NetworkInfo } from "react-native-network-info";
import NetInfo from "@react-native-community/netinfo";
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import {imageUrl, URL} from '../api.js';




import * as Progress from 'react-native-progress';
// import { Dropdown } from 'react-native-material-dropdown';
export default class EditProfile extends Component{
    constructor(props){
        super(props)

        this.state = {
            camImage:"",
            first_name:"",
            last_name:"",
            company_name:"",
            office_address:"",
            ip_address:"",
            city_id:"",
            pin_code:"",
            district_id:"",
            state_id:"",
            user_id:"",
            toastMessage:"",
            states:[],
            city:[],
            district:[],
            state_name:[],
            mobile_number:"",
            imgObj:null,
            fileType:"",
            filename:"",
            progress:"",
            progressStat:false,
            profile_image:"",
            companyLogo:"",
            camImage2:"",
            fileType2:"",
            filename2:"",
            email_id:"",
            visible:false
        }
    }

   componentDidMount(){
   
    this.getUsers();
       this.getStates();
      
   
    NetworkInfo.getIPAddress().then(ipAddress =>{
       
        this.setState({
            ip_address:ipAddress.toString()
        })
    });

    try{
        AsyncStorage.getItem("user_id")
    .then(result =>{
        console.log(result);
        if(result){
   
            this.setState({
                user_id:result
            })
        }
    })
    }catch(error){
        console.log(error);
    }
   }

   getUsers =   ()=>{
    AsyncStorage.getItem("user_id")
    .then(result =>{
        console.log(result);
        
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
              fetch( URL+"/get_user_details_by_user_id", {
                  headers:{
                      "Content-Type":"application/x-www-form-urlencoded"
                  },
                  method:"POST",
                  body:"user_id=" +result
              }).then(response => response.json())
              .then(result =>{
                  console.log( result);
                  if(result){

            if(result.company_logo == null){
                this.setState({
                    companyLogo:""
                })
            }else {
                this.setState({
                    companyLogo:result.company_logo
                })
            }
                      console.log(result.company_logo);
                      this.setState({
                          first_name:result.first_name,
                          mobile_number:result.mobile_number,
                          state_id:result.state_id,
                          district_id:result.district_id,
                          office_address:result.office_address,
                          pin_code:result.pin_code,
                          city_id:result.city_id,
                          last_name:result.last_name,
                          company_name:result.companyName,
                          state_name:result.state_name,
                          profile_image:result.profilePicture,
                          
                          email_id:result.email_id

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
 openCamera2 =  async () =>{
     
    var options = {
        title: 'Select company Logo',
        // customButtons: [
        //   { 
        //     name: 'customOptionKey', 
        //     title: 'Choose file from Custom Option' 
        //   },
        // ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        didCancel:true
      };
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
        title:"STC Permissions",
        message:"Stc need's to allow your camera Permissions",
        buttonNutral:"Ask me Latter",
        buttonPositive:"Yes",
        buttonNegative:"No"
      }
    );

    if(granted === PermissionsAndroid.RESULTS.GRANTED){
       
        ImagePicker.showImagePicker(  options,  res =>{

            var form = new FormData();
            form.append("image",{
                uri:res.uri,
                type:'image/jpeg',
                name:res.fileName
            });

            var xhr = new XMLHttpRequest();
            xhr.open("POST","https://stcapp.stcwallpaper.com/backend/uploads.php")
            xhr.setRequestHeader("Contnet-Type","multipart/form-data");
            xhr.send(form);

            if(xhr.upload){
                console.log(res.path);
                xhr.upload.onprogress = ({total, loaded}) =>{
                    const Progress = (loaded/ total);
                    console.log(Progress);
                    this.setState({
                        progress:Progress,
                        progressStat:true
                    })
                }

            

                setTimeout(() =>{
                    this.setState({
                        progressStat:false
                    })
                },1600)



            }
       
            if(res){
                
               
            }
           
            this.setState({
                camImage2:res.uri,
                fileType2:res.type,
                filename2:res.fileName
            })


        })
    }else{
      alert("Pleace try again");
    }
 }

    openCamera = async  () =>{
        var options = {
            title: 'Select Image',
            // customButtons: [
            //   { 
            //     name: 'customOptionKey', 
            //     title: 'Choose file from Custom Option' 
            //   },
            // ],
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            didCancel:true
          };
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
            title:"STC Permissions",
            message:"Stc need's to allow your camera Permissions",
            buttonNutral:"Ask me Latter",
            buttonPositive:"Yes",
            buttonNegative:"No"
          }
        );

        if(granted === PermissionsAndroid.RESULTS.GRANTED){
           
            ImagePicker.showImagePicker(options,  res =>{
           
                console.log(res);
               
                this.setState({
                    camImage:res.uri,
                    fileType:res.type,
                    filename:res.fileName
                });

    
            })
        }else{
          alert("Pleace try again");
        }
    }

    updateProfile = ()=>{
      

        if(this.state.first_name == ""){
            Alert.alert(
                "Validation",
                "First name field is required"
            )
        }else if(this.state.last_name ===  ""){
            Alert.alert(
                "Validation",
                "Last name field is required"
            )
        }else if(this.state.office_address ===""){
            Alert.alert(
                "Validation",
                "Office Address field required"
            )
        }else if(this.state.company_name === ""){
            Alert.alert(
                "Validation",
                "Company name must requried"
            )
        }else if(this.state.city === ""){
            Alert.alert(
                "Validation",
                "City name is required"
            )
        }else if(this.state.district != ""){
            Alert.alert(
                "Validation",
                "District name is requried"
            )
        }else if(this.state.pin_code ===""){
            Alert.alert(
                "Validation",
                "Pincode field is required"
            )
        }else{
        
        console.log(this.state.fileType);
          
            var form  = new FormData();
            form.append("image",{
                uri:this.state.camImage,
                type:'image/jpeg',
                name:this.state.filename
            });


    const xhr =  new XMLHttpRequest();

    xhr.open("POST","https://stcapp.stcwallpaper.com/backend/uploads.php")
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(form)

            if(xhr.upload){
                console.log(xhr.upload);
                xhr.upload.onprogress = ({total, loaded}) =>{
                    const Progress = (loaded/ total);
                    this.setState({
                        progress:Progress,
                        progressStat:true
                    })
                }

                setTimeout(() =>{
                    this.setState({
                        progressStat:false
                    })
                },600);

                
            }

            
            fetch(URL+"/update_profile_details_by_id",{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"first_name="+ this.state.first_name+ "&last_name="+ this.state.last_name+ "&companyName="+ this.state.company_name+
                "&office_address="+ this.state.office_address+ "&city_id="+ this.state.city_id+ "&state_id="+ this.state.state_id+ "&pin_code="+
                this.state.pin_code+ "&profile_picture="+ this.state.filename+ "&company_logo="+this.state.filename2+"&modify_by_id="+this.state.user_id+ "&id="+this.state.user_id+
                "&email_id="+ this.state.email_id
            
            }).then(response => response.json())
            .then(result =>{
               
               
                if(result.error == false){
                    Alert.alert(
                        "Success",
                        "User Profile update successfully"
                    );

                   setTimeout(() =>{
                    this.props.navigation.goBack("profile");
                   },1200)
                }else if(result.length ==0){
                    Alert.alert(
                        "Success",
                        "Image upload successfull"
                    );

                    this.props.navigation.goBack(null);
                }
            }).catch( error =>{
                console.log(error);
            })
        }
    }

    getStates = ()=>{
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_state_list", {
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
              
                }).then(response => response.json())
                .then(result =>{
                      console.log(result);
                    this.setState({
                        states:result.state_list,
                        state_id:result.id
                       
                    });
                   

                    
                }).catch(error =>{
                    console.log(error);
                });
            }else{  
                Alert.alert(
                    "Warning",
                    "Please check your Internet connection"
                );
            }
        })
    }

    // getDistricts = ()=>{
     
    //     if(this.state.state_id){
    //         NetInfo.fetch().then(state =>{
    //             if(state.isConnected){
    //                 fetch("http://phpstack-508730-1686395.cloudwaysapps.com/backend/v1/get_district_list_by_state_id",{
    //                    method:"POST",
    //                    headers:{
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                    },
    //                  body:"state_id=" +this.state.district_id
    //                 }).then(response => response.json()) 
    //                 .then(result =>{
    //                     console.log(result)
    //                     this.setState({
    //                         district:result.district_list
    //                     });
    //                 }).catch(error =>{
    //                     console.log(error);
    //                 });
    //             }else{
    //                 Alert.alert(
    //                     "Warning",
    //                     "Please check Your Internet connection"
    //                 )
    //             }
    //         })
    //     }else{

    //     }
    // }

    getCityes = ()=>{
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_city_list_by_district_id",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(response => response.json())
                .then(result =>{
                    console.log(result);
                    this.setState({
                        city:result.city_list,
                        city_id:result.city_id,
                        state_id:id
                        
                    })
                }).catch(error =>{
                    console.log(error);
                })
            }else{
                Alert.alert(
                    "Warning",
                    "Please check Your internet cnnection"
                )
            }
        })
    }

    showDistrict = (id) => {
 
    
        if(id){
            
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_district_list_by_state_id",{
                       method:"POST",
                       headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                       },
                       body:"state_id=" +id
                     
                    }).then(response => response.json()) 
                    .then(result =>{
                        
               console.log(result);
                        this.setState({
                            district:result.district_list,
                            state_id:id
                        });
                    }).catch(error =>{
                        console.log(error);
                    });
                }else{
                    Alert.alert(
                        "Warning",
                        "Please check Your Internet connection"
                    )
                }
            });

            return true;
        }else{

            
          
            return false;
        }
    }

    showCity = (id) =>{
      

        // var image = this.state.Capimage;

        //     if(image.length >0){
        //         if(image.path == "base64"){
        //             alert("image file has been chamge")
        //         }
        //     }else{
        //         alert("No image file are found")
        //     }
      this.setState({
          state_id:id

      })
        if(id){
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_city_list_by_state_id",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body:"state_id=" +id
                    }).then(response => response.json())
                    .then(result =>{
                        console.log(result);
               
                        this.setState({
                            city:result.city_list,
                           
                          
                            
                        })
                    }).catch(error =>{
                        console.log(error);
                    });

                   
                }else{
                    Alert.alert(
                        "Warning",
                        "Please check Your internet cnnection"
                    )
                }
            });


            return true;
        }else{
            
           
            return false;
        
        }
    }
    

    render(){
     console.log(this.state.city_id);
        return(
            <View style={{
                flex:1
            }} >
                <View style={{
                    flex:1
                }} >
                     <View style={{
              flex:1,
             
          }} >
             
                <View style={{
                flex:1
            
            }} >
                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                    backgroundColor:'#62463e',
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    flexDirection:'row',
                    justifyContent:'space-between'
                    
         
                }} >
                  <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                  <Icon name="arrow-back" color="#FFF" size={18} style={{
                        margin:25
                    }} />
                  </TouchableOpacity>
                    <Text style={{
                        textAlign:'center',
                        fontSize:18,
                        color:"#FFF",
                        margin:25, 
                       
                    }} >Edit Profile</Text>
        <View style={{
            height:40,
            width:60
        }} >

        </View>
                   

                </View>

                <View style={{
                    position:'absolute',
                    height:Dimensions.get("screen").height ,
                    width:Dimensions.get("screen").width - 45,
                    backgroundColor:'#FFF',
                    top:75,
                    left:23,
                    borderTopLeftRadius:18,
                    borderTopRightRadius:18,
                    alignItems:'center'
                
                }} >
 
                
                    <KeyboardAvoidingView 
                    behavior="padding"
                        style={{
                            height:Dimensions.get("screen").height,
                            marginBottom:30
                        }}
                    >
                  <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom:180
                    }}
                  style={{
                    marginBottom:50,
                    height:Dimensions.get("screen").height +500
                }} >
              
              <Text style={{
                        marginTop:6,
                        fontSize:14
                    }} >Select Profile Picture</Text>
                   {
                       this.state.camImage ? (
                        <Image source={{uri:this.state.camImage}} style={{
                            height:100,
                            width:100,
                            borderRadius:50,
                            marginTop:20,
                            marginHorizontal:15
                        }} />
                       ) :(
                        <View>
                            {
                                this.state.profile_image !=null ? (
                                    <Image source={{uri:imageUrl+"/"+this.state.profile_image}} style={{
                                        height:100,
                                        width:100,
                                        borderRadius:50,
                                        marginTop:20,
                                        marginHorizontal:15
                                    }} />
                                ) :(
                                    <Image source={require("../assets/userProfile.png")} style={{
                                        height:100,
                                        width:100,
                                        borderRadius:50,
                                        marginTop:20,
                                        marginHorizontal:15
                                    }} />
                                )
                            }
                        </View>
                       )
                   }
                  <TouchableOpacity onPress={() => this.openCamera()} style={{
                      position:'absolute',
                      top:106,
                      left:80, 
                    right:0
                  }} >
                  <View style={{
                       height:30,
                       width:30,
                       borderRadius:10,
                       borderWidth:0.3,
                       borderRadiusColor:'black',
                       justifyContent:'center',
                       alignItems:'center'
                       
                   }} >
                        <Image source={require("../assets/edit3.png")} style={{
                        height:20,
                        width:20,
                        
                    }} />
                   </View>

                  </TouchableOpacity>
                
                  <View style={{
                      justifyContent:'center',
                    padding:20
                      
                  }} >

                       
                           
                     
                     {
                         this.state.first_name  ? (
                            <TextInput 
                            placeholder="Ente Firstname"
                            defaultValue={this.state.first_name.toString()}
                            onChangeText={(value) =>{
                 
                                this.setState({
                                    first_name:value
                                })
                            }}
                            style={{
                                height:45,
                                width:260,
                               borderWidth:0.8,
                               borderRadius:12,
                        
                            borderColor:"#62463e",
                            padding:12
                            }}
                          />
                         ):(
                            <TextInput 
                            placeholder="Ente Firstname"
                           
                            onChangeText={(value) =>{
                 
                                this.setState({
                                    first_name:value
                                })
                            }}
                            style={{
                                height:45,
                                width:260,
                               borderWidth:0.6,
                               borderRadius:12,
                           
                            borderColor:"#62463e",
                            padding:12
                            }}
                          />
                         )
                     }

                     <View style={{
                         position:"absolute",
                         top:12,
                         left:22,
                         right:-2,
                         backgroundColor:"#FFF",
                        width:60
                         
                     }} >
    
                              <Text style={{
                    marginRight:10,
                    color:"#62463e",
                  width:500,
                    fontSize:14,
                    fontWeight:"bold",
                   
                }} >First Name</Text>

    
                     </View>
                 
                      {
                          this.state.last_name ? (
                            <TextInput 
                            onChangeText={(value) => this.setState({
                                last_name:value
                            })}
                            defaultValue={this.state.last_name.toString()}
                              placeholder="Enter Lastname"
                              style={{
                                  height:45,
                                  width:260,
                                  borderRadius:6,
                                 
                                  borderWidth:0.6,
                                  marginTop:20,
                                  borderColor:"#62463e",
                                  padding:12
                              }}
                            />
                          ) :(
                            <TextInput 
                            onChangeText={(value) => this.setState({
                                last_name:value
                            })}
                            
                              placeholder="Enter Lastname"
                              style={{
                                height:45,
                                width:260,
                                borderRadius:6,
                                borderWidth:0.6,
                                marginTop:20,
                                borderColor:"#62463e",
                                padding:13
                              }}
                            />
                          )
                      }

                      <View style={{
                           position:"absolute",
                           top:77,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                          width:60
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:500,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Last Name</Text>
                        </View>

                 
                        

{/* <Text style={{
                      
                          fontSize:16,
                          margin:5
                      }} >Mobile Number</Text> */}
                     {
                         this.state.mobile_number  ? (
                            <TextInput 
                            defaultValue={this.state.mobile_number.toString()}
                            onChangeText={(value) => this.setState({
                                mobile_number:value
                            })}
                              placeholder="Enter Mobile Number"
                              style={{
                                height:45,
                                width:260,
                                borderRadius:6,
                                borderWidth:0.6,
                                marginTop:20,
                                borderColor:"#62463e",
                                padding:12
                              }}
                            />
                         ) :(
                            <TextInput 
                            
                            onChangeText={(value) => this.setState({
                                mobile_number:value
                            })}
                              placeholder="Enter Mobile Number"
                              style={{
                                height:45,
                                width:260,
                                borderRadius:6,
                                borderWidth:0.6,
                                marginTop:20,
                                borderColor:"#62463e",
                                padding:12
                              }}
                            />
                         )
                     }
            
            <View style={{
                           position:"absolute",
                           top:140,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                          width:84
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:500,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Mobile Number</Text>
                        </View>



                        {
                     this.state.email_id ? (
                        <TextInput 
                        defaultValue={this.state.email_id.toString()}
                        onChangeText={(value) => this.setState({
                            email_id:value
                        })}
                          placeholder="Enter Office Address"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            email_id:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     )
                 }
            <View style={{
                           position:"absolute",
                           top:208,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                        width:50
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:300,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Email Id</Text>
                        </View>

                        {
                     this.state.company_name ? (
                        <TextInput 
                        defaultValue={this.state.company_name.toString()}
                        onChangeText={(value) => this.setState({
                            company_name:value
                        })}
                          placeholder="Enter Office Address"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            company_name:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     )
                 }
            <View style={{
                           position:"absolute",
                           top:270,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                           width:84
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:300,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Company Name</Text>
                        </View>

                        {
                     this.state.office_address ? (
                        <TextInput 
                        defaultValue={this.state.office_address.toString()}
                        onChangeText={(value) => this.setState({
                            office_address:value
                        })}
                          placeholder="Enter Office Address"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            office_address:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     )
                 }
            <View style={{
                           position:"absolute",
                           top:335,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                           width:95
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:300,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Company Address</Text>
                        </View>

                        <View style={{
    height:45,
    width:260,
    borderRadius:6,
    borderWidth:0.6,
    marginTop:20,
    borderColor:"#62463e",
    justifyContent:"center",
    alignItems:"center"
}} >
     <Picker
  selectedValue={this.state.state_id}
  enabled
  style={{height: 50, width: 260}}
  onValueChange={(value) => this.showCity(value)}>
  {
      this.state.states.map(value =>(
        <Picker.Item label={value.state_name.substring(0,18)} value={value.id} />
      ))
  }

</Picker>

</View>

<View style={{
                           position:"absolute",
                           top:400,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                          width:65
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:500,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Select State</Text>
                        </View>


                        {
    this.state.city ? (

        <View style={{
            height:45,
        width:260,
        borderRadius:6,
        borderWidth:0.6,
        marginTop:20,
        borderColor:"#62463e",
        justifyContent:"center",
        alignItems:"center"
        }} >
            <Picker 
        selectedValue={this.state.city_id}
       
        style={{height:50,width :260}}
        onValueChange={(value) => this.setState({
            city_id:value
        })}
        >
            {
                this.state.city.map(value =>(
                    <Picker.Item label={value.city_name.substring(0,18)} value={value.city_id} />
                ))
            }
        </Picker>

            </View>
     ) :(
 
 
        <View style={{
            height:45,
            width:260,
            borderRadius:6,
            borderWidth:0.6,
            marginTop:20,
            borderColor:"#62463e",
            justifyContent:"center",
            alignItems:"center"
        }} >
             <Picker 
   
         style={{height:50,width :260, borderRadiusColor:"black"}}
         onValueChange={(value) => {
             this.setState({
                city_id:value
             })
         }}
         >
             <Picker.Item label="Select city  found" value="" />
         </Picker>

            </View>

            
    )
}

<View style={{
                           position:"absolute",
                           top:465,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                          width:58
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:460,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Select City</Text>
                        </View>


                        {
                     this.state.pin_code ? (
                        <TextInput 
                        defaultValue={this.state.pin_code.toString()}
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Office Address"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                            height:45,
                            width:260,
                            borderRadius:6,
                            borderWidth:0.6,
                            marginTop:20,
                            borderColor:"#62463e",
                            padding:12
                          }}
                        />
                     )
                 }
                  <View style={{
                           position:"absolute",
                           top:530,
                           left:22,
                           right:0,
                           backgroundColor:"#FFF",
                          width:56
                           
                      }} > 
                        <Text style={{
                                marginRight:10,
                                color:"#62463e",
                              width:300,
                                fontSize:14,
                                fontWeight:"bold",
                   
                 }} >Pin Code</Text>
                        </View>
                        

{/* <Text style={{
                      
                      fontSize:16,
                      margin:5
                  }} >Pincode</Text>
                 {
                     this.state.pin_code !="" ? (
                        <TextInput 
                        // defaultValue={this.state.pin_code.toString()}
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                              height:40,
                              width:240,
                              borderBottomWidth:0.5,
                              borderBottomColor:'black',
                              margin:5
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                              height:40,
                              width:240,
                              borderBottomWidth:0.5,
                              borderBottomColor:'black',
                              margin:5
                          }}
                        />
                     )
                 }
                       */}
                      {/* <TouchableOpacity activeOpacity={0.7}  onPress={() => this.updateProfile()}  style={{
                          height:40,
                          width:200,
                          backgroundColor:'#62463e',
                          marginHorizontal:35,
                          marginTop:40,
                          borderRadius:12,
                          marginBottom:50
                      }} >
                          <Text style={{
                              textAlign:'center',
                              fontSize:18,
                              color:"#FFF",
                             lineHeight:35,
                             marginTop:2
                          }} >Submit</Text>
                      </TouchableOpacity> */}
                  </View>
                  <View />
                  <Text style={{
                        marginTop:6,
                        fontSize:14,
                        textAlign:"left",
                        marginBottom:16
                    }} >Select Company Logo </Text>

                 {
                     
                   
                     this.state.camImage2 !="" && this.state.camImage2 != undefined  ? (
                         <View>
                              <Image source={{uri:this.state.camImage2}} style={{
                         height:80,
                         width:80,
                         borderRadius:80/2
                     }} />

<TouchableOpacity onPress={() => this.openCamera2()} style={{
                      position:'absolute',
                      top:40,
                      left:60, 
                    right:0
                  }} >
                  <View style={{
                       height:30,
                       width:30,
                       borderRadius:10,
                       borderWidth:0.3,
                       borderRadiusColor:'black',
                       justifyContent:'center',
                       alignItems:'center'
                       
                   }} >
                        <Image source={require("../assets/edit3.png")} style={{
                        height:20,
                        width:20,
                        
                    }} />
                   </View>

                  </TouchableOpacity>
                         </View>
                     ) : (
                        <View>
                       {
                           this.state.companyLogo !=""  ? (
                            <Image source={{uri:imageUrl+"/"+this.state.companyLogo}} style={{
                                height:80,
                                width:80,
                                borderRadius:80/2,
                                marginRight:20
                            }} />
                           ) :(
                               <View>
                               <Image source={require("../assets/companyLogo.jpg")} style={{
                                height:80,
                                width:80,
                                borderRadius:80/2,
                                marginRight:20
                            }} />
                               </View>
                           )
                       }

<TouchableOpacity onPress={() => this.openCamera2()} style={{
                      position:'absolute',
                      top:40,
                      left:60, 
                    right:0
                  }} >
                  <View style={{
                       height:30,
                       width:30,
                       borderRadius:10,
                       borderWidth:0.3,
                       borderRadiusColor:'black',
                       justifyContent:'center',
                       alignItems:'center'
                       
                   }} >
                        <Image source={require("../assets/edit3.png")} style={{
                        height:20,
                        width:20,
                        
                    }} />
                   </View>

                  </TouchableOpacity>
                   </View>
                     )
                 }
                      
                        
                  </ScrollView>
                  <View />
                  </KeyboardAvoidingView>

                   
              
                 
                </View>
             
            </View>
          
          </View>

                </View>

                <TouchableOpacity onPress={() => this.updateProfile()} >
                    <View style={{
                        height:50,
                        width:Dimensions.get("screen").width,
                        backgroundColor:"#62463e",
                        justifyContent:"center",
                        alignItems:"center"
                    }} >
                        <Text style={{
                            textAlign:"center",
                            color:"#FFF",
                            fontSize:18
                        }} >Submit</Text>

                    </View>
                </TouchableOpacity>


      
            </View>
        )
    }
}
