import React, { Component } from 'react';

import { StyleSheet, Image, View, TouchableOpacity, Text, Dimensions,TextInput, Button,KeyboardAvoidingView, ScrollView,PermissionsAndroid,  KeyboardAvoidingViewBase, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
import {URL, imageUrl} from '../api.js';
 
// import ImageEdit from 'react-native-imageedit'
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
// image editor


const default_image_size = 400;
const default_image_width = 420;


export default class EditImage extends Component{

    constructor(props){
        super(props);

        this.state = {
            imageCrop:"",
            cropSize:{},
            cropperParams:{},
            height:"",
            width:"",
            validation1:true,
            validation2:true,
            imageEdit:"",
            imageObj:{},
            cropImageHeight:240,
            cropImageWidth:Dimensions.get("screen").width - 40,
            x:"",
            y:"",
            fileObj:null,
            progress:"",
            progressStat:false
           
        }
    }

   validation1 = () =>{
       if(this.state.validation1 == null){
           return false
       }else{
           return true
       }
   }

   validation2 = ()=>{
       if(this.state.validation2 == null){0
           return false;
       }else{
           return true;
       }
   }

   pageDirection = () =>{
       this.props.navigation.replace("customWp", {
               image:this.state.imageEdit,
               imageObj:this.state.imageObj
           });
   }

   editImage = async ()=>{
   
 
    const granted = await  PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title:"STC Wallpaper",
          message:"STC needs to Access your Image Galary ",
          buttonNeutral:"Ask me Latter",
          buttonNegative:"Cancel",
          buttonPositive:"Ok"
        }
      );

      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        

        ImagePicker.openCropper({
          path: imageUrl+"/"+this.props.route.params.stocks,
          width: 380,
          height: 300,
          
        }).then(image => {
         console.log(image);
         
          this.setState({
          
             imageEdit:image.path,
             fileObj:image
          });                   
        }).catch(error =>{
          console.log(error);
        })
      }else{
        alert("Sorry Try Again Latter");
      }
   }

   submit = async () =>{
      if(this.state.fileObj !=null){
        if(this.state.height == "" && this.state.width == ""){
          Alert.alert(
            "Validation Error",
            "Please Check your Input field"
          );
        }else if(this.state.height ==""){
          Alert.alert(
            "Validation Error",
            "Please Enter Height"
          );

          return;
        }else if(this.state.width ==""){
          Alert.alert(
            "Validation Error",
            "Please Enter Width"
          );

          return;
        }
        else{
          
          var form = new FormData();
          var filename = this.state.fileObj.path.replace(/^.*[\\\/]/, '')
          console.log(this.state.fileObj.path);
         
          form.append("image",{
            uri:this.state.fileObj.path,
            type:this.state.fileObj.mime,
            name:filename
          });

          var xhr = new XMLHttpRequest();
          xhr.open("POST","https://stcapp.stcwallpaper.com/backend/edit_pattern.php");
          xhr.setRequestHeader("Content-Type","multipart/form-data");
          xhr.send(form);

          if(xhr.upload){
            xhr.upload.onprogress = async ({total, loaded}) =>{
              console.log(loaded/total);

              this.setState({
                progress:loaded/total,
                progressStat:true
              })
            }

            setTimeout(() =>{
              this.setState({
                progressStat:false
              })
            }, 1000);

            if(this.state.progressStat == false){
              setTimeout(() => {

            
                this.props.navigation.replace("customWp", {
                  image:this.state.imageEdit,
                  imageObj:this.state.imageObj,
                  file:this.state.fileObj,
                  image_id:this.props.route.params.id,
                  height:this.state.height,
                  width:this.state.width,
                  flag:"2"
              });
              },1250)
            }else{

            }
          }else{
            Alert.alert(
              "Image upload Error",
              "Image upload fail"
            );
          }
        }
      }else{
        if(this.state.height == "" && this.state.width == ""){
          Alert.alert(
            "Validation Error",
            "Please Enter Height And Width"
          );
          return;
        }else if(this.state.height =="" ){
          Alert.alert( 
            "Validation Error",
            "Please Enter Height"
          );

          return;
        }else if(this.state.width == ""){
          Alert.alert(
            "Validation Error",
            "Please Enter Width"
          );

          return;
        }else{


        this.props.navigation.replace("customWp", {
          image: imageUrl+""+this.props.route.params.stocks,
          imageObj:this.state.imageObj,
          image_id:this.props.route.params.cat_id,
          height:this.state.height,
          width:this.state.width,
          flag:"1"
      });
    }
      }
   }
 
    
    render(){
      
     
        return(
         <View style={{
           flex:1
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
                    flexDirection:"row",
                    justifyContent:'space-between'
                }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                   <Icon name="arrow-back" size={18} color="#FFF" style={{
                        margin:20
                    }} />
                   </TouchableOpacity>
                    <Text style={{
                        textAlign:'center',
                  
                        color:"#FFF",
                        fontSize:18,
                        margin:20
                    }} > { this.props.route.params.id } </Text>

                    <View style={{
                      height:55,
                      width:55
                    }} />
                </View>

                <View style={{
                    position:'absolute',
                    top:90,
                    left:24,
                    right:24,
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width -45,
                    backgroundColor:'#FFF',
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                  
                    alignItems:'center',
                    flex:1,
                    justifyContent:'center',
                    zIndex:0
                   
                }} >

              <KeyboardAvoidingView
              behavior="padding" 
              >

<ScrollView 
                showsVerticalScrollIndicator={false}
               
              contentContainerStyle={{
                paddingBottom:100
              }}
                 >
             
                <View style={{
                  flex:1,
                  justifyContent:'center',
                  alignItems:"center"
                }} >
               {
                 this.state.imageEdit != "" ? (
                  <Image source={{uri:this.state.imageEdit}} style={{
                    height:this.state.cropImageHeight,
                    width:Dimensions.get("screen").width * 0.8,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    marginTop:12
                  }} />
                 ) :(
                  <Image source={{uri:imageUrl+"/"+this.props.route.params.stocks}} style={{
                    height:this.state.cropImageHeight,
                    width:Dimensions.get("screen").width * 0.8,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    marginTop:12
                  }} />
                 )
               }

               <View>
                  
                <TouchableOpacity activeOpacity={0.9} onPress={() => this.editImage()} >
                <View style={{
                  justifyContent:"center",
                 
                  height:40,
                  width:180,
              
                  borderWidth:1.5,
                  borderColor:"#62463e",
                  marginTop:20,
                 
                  
                }} >
                  <Text style={{
                    textAlign:"center",
                    fontSize:18,
                    color:"#62463e"
                  }} > Edit Image </Text>

                </View>
                </TouchableOpacity>

               </View>
              <View style={{
               
                marginTop:10
              }} >
              <View style={{
                flexDirection:'column'
              }} >
            

              </View>

               <View style={{
                flexDirection:"row"
               }} >
                 <Text style={{
                   margin:12,
                   fontSize:16,
                   marginTop:38
                 }} >W:</Text>
                 <TextInput
                  placeholder="Enter width in inches"
                  onChangeText={(value) => this.setState({
                    width:value
                  })}
                  keyboardType="numeric"
                  style={{
                    height:50,
                    width:190,
                   borderRadius:6,
                   borderWidth:0.5,
                  marginTop:20,
                  padding:12
                  }}
                 />

               </View>

               <View style={{
                flexDirection:"row"
               }} >
                 <Text style={{
                   margin:12,
                   fontSize:16,
                   marginTop:38
                 }} >H:</Text>
                 <TextInput
                  placeholder="Enter height in inches"
                  onChangeText={(value) => this.setState({
                    height:value
                  })}
                  keyboardType="numeric"
                  style={{
                    height:50,
                    width:190,
                   borderRadius:6,
                   borderWidth:0.5,
                  marginTop:20,
                  padding:12,
                  marginBottom:30
                  }}
                 />

               </View>

              </View>


              <View style={{
                width:200,
                marginTop:60,
                marginHorizontal:60,
                marginBottom:40
                

              }} >
              

              </View>
                </View>
      
                </ScrollView>
              
              </KeyboardAvoidingView>
              
                </View>
             </View>

             <TouchableOpacity  activeOpacity={2} onPress={() => this.submit()} >
                <View style={{
              height:50,
              width:Dimensions.get("screen").width,
              backgroundColor:"#62463e",
              justifyContent:"center",
                   alignItems:'center',
                   
             
              
            }} >
              <Text style={{
                textAlign:'center',
                color:"#FFF",
                fontSize:18
              }} >Submit</Text>

            </View>
                </TouchableOpacity>

      

  <Modal isVisible={this.state.progressStat}>
          <View style={{
		flex:1,
		  alignItems:"center",
          justifyContent:"center"
	  }} >
		 <Progress.Bar progress={this.state.progress} width={240} />

         <Text style={{
             textAlign:"center",
             color:"grey"
         }} >Uploading....</Text>
		  </View>
        </Modal>
         </View>
        )
    }
}