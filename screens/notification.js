import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension  } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Modal, { ModalContent,SlideAnimation } from 'react-native-modals';

import TabBarContainer from './TabnarComponent.js';

// import AnimatedLoader from "react-native-animated-loader";


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

 
  const resources = {
    file: Platform.OS === 'ios' ? 'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf',
    url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
  };
export default class Notification extends Component{

    

    constructor(props){
        super(props)

        this.state = {
            cateLogImage:[
                {
                    "id":"1",
                    "image":"http://www.africau.edu/images/default/sample.pdf",
                    "name":"Panache",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"2",
                   "image":"https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/03/2020-interior-design-trends-feature.jpg",
                   "name":"Hexagon",
                   "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"3",
                    "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213",
                    "name":"Asahfoard",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                   
                },
                {
                    "id":"4",
                    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"5",
                    "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"6",
                    "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"4",
                    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"5",
                    "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"6",
                    "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"4",
                    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"5",
                    "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"6",
                    "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"4",
                    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"5",
                    "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"6",
                    "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"4",
                    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"5",
                    "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                },
                {
                    "id":"6",
                    "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    "name":"Vermeil",
                    "des":"This should not be the accepted answer as placeholderStyle doesn't work at least in RN 0.59. Jon Wyatt 's method of conditional styling worked for me"
                }
            ],
            isVisiable:false,
            messageData:{},
            modelShow:false
        }
    }

    componentDidMount(){
        setTimeout(() =>{
            this.setState({
                isVisiable:true
            })
        },2000)
    }

    modelPop = (data) =>{
        this.setState({
            modelShow:true,
            messageData:data
        });
    }

    checkFileExt = (url) => {
        let ext = url.split('.').pop();
        if(ext === "pdf"){
            return true
        }else{
            return false;
        }
    }

    
    render(){
       
        return(
           <View style={{
               flex:1
           }} >
 <View style={{
               flex:1,
              
               alignItems:"center"
            }} >
            <StatusBar barStyle="light-content" backgroundColor="#62463e" />

            <View style={ styles.headerBar } >
            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
            <Icon name="arrow-back" size={20} style={{
                    margin:20
                }}  color="#FFF" />
            </TouchableOpacity>
             {/* <View>
             <Moment>{this.state.time}</Moment>
             </View> */}
           {/* <Text style={{
               fontSize:18,
               fontWeight:"bold",
               color:"#FFF",
            margin:20,
            
            
           }} >Post Job</Text> */}
            {/* <Image source={{uri:'https://cdn1.vectorstock.com/i/1000x1000/31/95/user-sign-icon-person-symbol-human-avatar-vector-12693195.jpg'}} 
    style={{
        height:40,
        width:40,
        borderRadius:20,
        marginLeft:230,
        marginTop:10
    }}
    /> */}


    
                </View>

                <View style={ styles.formContainer } >
           
                 <Text style={{
                     textAlign:'center',
                     fontFamily:"Roboto-Bold",
                     fontSize:20,
                     marginTop:14
                 }} >Notification</Text>
               
                 <FlatList
                 
                    showsVerticalScrollIndicator={false}
                    data={this.state.cateLogImage}
                    renderItem={(items) => {
                        return(
                            <View style={{
                               
                               marginTop:40
                              
                            }} >
                                {
                                    this.checkFileExt(items.item.image) ? (
                                        <View style={{
                                            flexDirection:"row",
                                            justifyContent:"space-between"
                                        }} >
                                            <TouchableOpacity style={{
                                                flexDirection:"row"
                                            }} onPress={() => this.props.navigation.navigate("showsPdf")} >
                                            <Text numberOfLines={2} style={{
                                    fontSize:14,
                                    lineHeight:25,
                                    marginRight:25,
                                    width:200,
                                    marginTop:20, 
                                    marginLeft:10
                                 
                                }} >{items.item.des}</Text>
                                {
                                    this.checkFileExt(items.item.image) ? (
                                        <Image style={{
                                            height:80,
                                            width:60
                                        }} source={{uri:"https://media5.picsearch.com/is?ju5YxQahdWq4u0cgCHT_yRe_6cKTWcvnkiNFj5vNCY8&height=320"}} />
                                    ) :(
                                        <Image source={{uri:items.item.image}} style={{
                                            height:80,
                                            width:60
                                        }} />
                                    )
                                }
                                        </TouchableOpacity>
                                            </View>
                                    ) :(
                                        <View style={{
                                            flexDirection:"row",
                                            justifyContent:"space-between"
                                        }} >
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("content",{
                                                content:items.item
                                            })} style={{
                                                flexDirection:"row"
                                            }} >
                                           <Text numberOfLines={2} style={{
                                    fontSize:14,
                                    lineHeight:25,
                                    marginRight:25,
                                    width:200,
                                    marginTop:20, 
                                    marginLeft:10
                                }} >{items.item.des}</Text>
                                {
                                    this.checkFileExt(items.item.image) ? (
                                        <Image style={{
                                            height:80,
                                            width:60
                                        }} source={{uri:"https://media5.picsearch.com/is?ju5YxQahdWq4u0cgCHT_yRe_6cKTWcvnkiNFj5vNCY8&height=320"}} />
                                    ) :(
                                        <Image source={{uri:items.item.image}} style={{
                                            height:60,
                                            width:60
                                        }} />
                                    )
                                }
                                        </TouchableOpacity>
                                            </View>
                                    )
                                }

                                </View>
                        )
                    }}
                    keyExtractor={(item) => item.id}
                 />

       
      </View>
      
            </View>
            {/* <TabBarContainer navigate={this.props.navigation} /> */}

            {/* <Modal style={{
                height:240
            }} useNativeDriver={true}  isVisible={this.state.modelShow}>
          <View style={{ flex: 0.5,backgroundColor:"#FFF", height:240 }}>
            <View style={{
                flex:1,
                // justifyContent:"center",
                alignItems:"center"
            }} >
            <Text style={{
                textAlign:"center",
                fontFamily:'Roboto-Bold',
                fontSize:18,
            }} >{this.state.messageData.name}</Text>
            <View style={{
                flexDirection:"row",
            }} >
                <Text style={{
                    fontSize:14,
                    color:"grey",
                  
                }} >{this.state.messageData.des}</Text>

            </View>

            </View>
          </View>
        </Modal> */}
           </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:170,
        width:Dimensions.get("screen").width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection:"row",


    },
    formContainer:{

        position:"absolute",
        top:70,
        left:25,
        right:25,
        backgroundColor:"#FFF",
        height:Dimensions.get("screen").height,
        width:Dimensions.get("screen").width -45,
  
        borderRadius:20,
        flex:1,
        // justifyContent:"center",
        alignItems:"center"
    },
    tabContainer:{
      
        height:60,
        width:Dimensions.get("screen").width,
        backgroundColor:"#FFF",
        elevation:5,
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        justifyContent:"center",
        // alignItems:"center",
        flex:0.1

    },
    tabItems:{
        justifyContent:"space-around",
        alignItems:"center",
        flexDirection:"row",
        
    },
    textInputStyle:{
        height:40,
        width:350,
        borderRadius:10,
        textAlign:'center',
        margin:5,
        marginHorizontal:25,
        borderBottomWidth:0.6,
        margin:20,
        marginBottom:20
    },
    loginButton:{
        height:40,
        width:300,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:20,
        borderRadius:10
    },
    lottie: {
        width: 100,
        height: 100
      }
})