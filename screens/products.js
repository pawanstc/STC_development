import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text,StatusBar,Dimensions,FlatList, TextInput,ScrollView, Alert,Share } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modal';

import NetInfo from "@react-native-community/netinfo";
import {URL, imageUrl} from '../api.js';
import ImageLoad from 'react-native-image-placeholder';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
export default class ProductImage extends Component{

 constructor(props){
     super(props);

     this.state = {
       subCateLog:[],
        isvisible:false,
        id:"",
        image:"",
        stocks:  {
        "id":"1",
        "image":[
            {
                "image":"https://media5.picsearch.com/is?qCHvNXSKG4GSKGWziCpZ3NvZKrp5GxG6oqQfYOPhGzU&height=255",
                "text":"image1"
            },
            {
                "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                "text":"image2"
            },
            {
                "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                "text":"image3"
            }
        ],
        "name":"Panache"
    },
    refreshing:false,
    modelOfPattern:""
     }
 }

 uploadModel = (data, id) => {
     this.setState({
         image:data,
         isvisible:true,
         id:id,
         modelOfPattern:id
     })
 }

 componentDidMount(){
   
   
    this.getSubCatelog();
  
 }

 getSubCatelog = () =>{
     let id = this.props.route.params.id;

     NetInfo.fetch().then(state =>{
        if(state.isConnected){
            fetch(URL+"/get_customise_catlog_subcategory_details_by_catlog_name",{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"catlog_master_id=" +id
            }).then( response => response.json() )
            .then(result =>{
                console.log(result);
                if(result.error === false){
                    this.setState({
                        subCateLog:result.sub_catlog_list,
                        refreshing:false
                    });
                    this.props.navigation.navigate("products",{
                        sub_catelogs:this.state.sub_catelog
                    })
                }else{
                  
                }
            }).catch(error =>{
                console.log(error);
                this.setState({
                    refreshing:false
                })
            });
        }else{
            Alert.alert(
                "Network Error",
                "Please chreck Your Internetconnection"
            )
        }
    })
 }

 handleRefreshing = ()=>{
     this.setState({
         refreshing:true
     }, () =>{
         this.getSubCatelog();
     })
 }


    render(){


        return(
            <View style={{
                flexGrow:1,
                alignItems:'center',
                height:Dimensions.get("screen").height
                
            }} >
                <StatusBar barStyle="light-content" backgroundColor="#62463e"  />
                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                    backgroundColor:'#62463e',
                    borderBottomLeftRadius:18,
                    borderBottomRightRadius:18,
                    flexDirection:"row",
                    justifyContent:'space-between'
                }} >
                    
                <TouchableOpacity activeOpacity={0.95}  onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" style={{
                    margin:23,
                    
                }} color="#FFF" size={20} />
                </TouchableOpacity>
            <TextInput 
            
            placeholder=" Search...."
           
            style={{
                height:43,
                width:"60%",
                textAlign:"center",
                borderRadius:10,
                borderWidth:0.3,
                borderColor:"#FFF",
                marginTop:15,
                paddingLeft:20,
                color:"black" ,
                backgroundColor:"#FFF", 
                marginRight:45
            }}
            placeholderTextColor="#000"
             />

          
             <Icon  style={{
                 position:"absolute",
                top:27,
                right:0,
                left:100
             }} name="search-outline" color="black"size={18} />
             <View style={{
                 width:10,
                 height:50
             }} />
 
                
                </View>

                <View style={{
                    position:'absolute',
                    top:70,
                    width:Dimensions.get("screen").width -45,
                    height:Dimensions.get("screen").height,
                    backgroundColor:'red',
                    left:24,
                    right:0,
                    borderTopLeftRadius:18,
                    borderTopRightRadius:18,
                    backgroundColor:'#FFF',
                    justifyContent:"center",
                    alignItems:"center"
                    
                }} >
                 
                    

                 <FlatList
                  
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
               refreshing={this.state.refreshing}
               onRefresh={this.handleRefreshing}

               contentContainerStyle={{
                   paddingBottom:90
               }}
                      
                      data={this.state.subCateLog}
                      renderItem={(items,index) =>{
                          console.log(items);
                        return(
                            <View style={{
                                margin:6,
                                marginTop:5,
                               
                                alignItems:'center',
                                justifyContent:"center",
                               marginBottom:25,
                            
                                
                                
                            }} >
                             
                            <View style={{
                                flex:1,
                                alignSelf:"flex-start",
                                justifyContent:"center",
                                alignItems:"center"
                            }} >
                                  <TouchableOpacity activeOpacity = { 0.9 } onPress={() => this.uploadModel(items.item.sub_category_img_url, items.item.catlog_sub_category_name)} >
                               {/* <Image progressiveRenderingEnabled={true} resizeMode='cover' source={{uri:items.item.sub_category_img_url}} style={{
                                    height:120,
                                    width:130,
                                    borderRadius:5
                                
                                }} /> */}

<ImageLoad
borderRadius={10}

    style={{  height:120,
        width:125,
        borderRadius:5 }}
    loadingStyle={{ size: 'large', color: '#62463e' }}
    source={{ uri: imageUrl+""+items.item.sub_category_img_url }}
/>
                               </TouchableOpacity>
                         
                        <Image source={require("../assets/Brandname2.png")} style={{
                            height:30,
                            width:30,
                            position:'absolute',
                            top:1,
                            left:4,
                            right:0
                        }} />
                                <View style={{
                                  
                                    marginTop:15
                                }} >
                                    <Text numberOfLines={2} style={{
                                        fontSize:12,
                                        fontWeight:"bold",
                                        textAlign:"center",
                                        width:"100%",
                                       
                                        
                                    }} >{items.item.catlog_sub_category_name}  </Text>
                                    

                                </View>

                                 
                                 <View style={{
                                     height:20
                                 }} />


                                </View>
                                </View>
                        )
                      }}

                      keyExtractor={(items) => items.id}
                  />

                  <View />

  <Modal coverScreen={true} style={{
       height:20,
 
       backgroundColor:"#FFF"
  }} isVisible={this.state.isvisible}>
      <View style={{
          justifyContent:"center",
          flex:2
     
      }}>
  <TouchableOpacity onPress={() => this.setState({
      isvisible:false
  })}  style={{
      left:280,
      position:"absolute",
      top:20
  }} >
  <Icon name="close" size={25} color="black" style={{
        
        marginTop:20
    }} />
  </TouchableOpacity>

  <Text style={{
      textAlign:"center",
      marginTop:18,
      fontSize:18,
      fontWeight:"bold"
  }} > { this.state.modelOfPattern }</Text>
    
   <View style={{
       alignItems:"center"
   }} >
       <Image source={{uri:imageUrl+"/"+this.state.image}} style={{
       height:280,
       width :280,
       marginTop:20,
       marginBottom:15
   }}  />

   </View>



   <View style={{
       flexDirection:"row",
       justifyContent:"space-between"
   }} >

       <View>
           <TouchableOpacity onPress={() =>{
               this.setState({
                   isvisible:false
               });

               Share.share(
                {
                    message:imageUrl+"/"+this.state.image,
                    
                }
            ).then(result =>{
                console.log(result);
            }).catch(error =>{
                console.log(error);
            });
           }}  >
           <Icon name="share" size={30} color="black" style={{
       padding:8
   }} />

   <Text style={{
       fontSize:14,
       color:"black",
       padding:8
   }} >Share</Text>
           </TouchableOpacity>
       </View>

       <View>
           <TouchableOpacity onPress={() =>{
               this.setState({
                   isvisible:false
               });
             
               setTimeout(() =>{
                this.props.navigation.navigate("customWp",{
                    image: imageUrl+""+this.state.image,
                   
                    image_id:this.state.id,
                   
                    flag:"1"
                   })
               },1000)
           }} >
           <Icon name="add-outline" size={30} color="black" style={{
       padding:10,
       paddingLeft:6
   }} />

   <Text style={{
       fontSize:14,
       color:"black",
       padding:0,
       marginRight:20
   }} >Post Job</Text>
           </TouchableOpacity>
       </View>


   </View>
   </View>
        </Modal>

                </View>
            </View>
        )
    }
}