import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, ScrollView,Animated, Share } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import SliderImage from 'react-zoom-slider';
import { PinchGestureHandler } from 'react-native-gesture-handler';



import ImageZoom from 'react-native-image-pan-zoom';
 
// const data =this.props.route.params.stocks.image;

import TabBarContainer from './TabnarComponent';
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

export default class StockDetails extends Component{

    scale = new Animated.Value(0);
    constructor(props){
        super(props)

        this.state = {
            cateLogImage:[
                {
                    "id":"1",
                    "image":[
                       {
                           "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                       },
                       {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                    {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                   ],
                    "name":"Panache"
                },
                {
                    "id":"2",
                   "image":[
                       {
                           "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                       },
                       {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                    {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                   ],
                   "name":"Hexagon"
                },
                {
                    "id":"3",
                    "image":[
                        {
                            "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                        },
                        {
                            "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                        },
                        {
                            "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                        }
                    ],
                    "name":"Asahfoard"
                   
                },
                {
                    "id":"4",
                    "image":[
                        {
                            "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                        },
                        {
                            "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                        },
                        {
                            "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                        },
                    ],
                    "name":"Vermeil"
                },
                {
                    "id":"5",
                    "image":[
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                    ],
                    "name":"Vermeil"
                },
                {
                    "id":"5",
                    "image":[
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                        {
                            "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                        },
                    ],
                    "name":"Vermeil"
                },
            ],
            selectIndex :0,
            image:""
            
        }
    };

    setSelectIndex = event =>{
        // get  width of the view size 
        const viewWidth = event.nativeEvent.layoutMeasurement.width;
        // get current position of the scroll view
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selecttedIndex = Math.floor(contentOffset / viewWidth);
        console.log(selecttedIndex);

        this.setState({
            selectIndex:selecttedIndex
        });
    }

    onPinchStateChange = (event) =>{
        console.log(event);

            if(event.nativeEvent.oldState === GestureHandler.State.ACTIVE){
                Animated.spring(this.scale, {
                    toValue:1,
                    useNativeDriver:true
                }).start();
            }
    }

  

   onPinchEvent = Animated.event(
       [{
           nativeEvent:{scale:this.scale}
       }],{
           useNativeDriver:true
       }
   )
   shareProduct  =(data) =>{
 
    Share.share(
        {
            message:"https://www.stcwallpaper.com/gallery.php?id=68",
            
        }
    ).then(result =>{
        console.log(result);
    }).catch(error =>{
        console.log(error);
    });
   }
    render(){
//    console.log(this.props.route.params.stocks.image[0].image);
        return(
           <View style={{
               flex:1
           }} >
 <View style={{
               flex:1,
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
           <Text style={{
               fontSize:18,
        
               color:"#FFF",
            margin:20,
            
           }} >Stock Details</Text>

           <View style={{
               height:40,
               width:58
           }} />
                </View>

                <View style={ styles.formContainer } >
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
         
            onMomentumScrollEnd={this.setSelectIndex}
        >
            {
                this.props.route.params.stocks.image.map((value, index) =>{
        
                    return(
                        <ImageZoom cropHeight={230}
                            cropWidth={Dimensions.get("screen").width -50}
                            imageWidth={Dimensions.get("screen").width -50}
                            imageHeight={230}
                        
                          >
                               <Image source={{uri:value.image}} style={{
                                            height:245,
                                            width:Dimensions.get("screen").width -50,
                                            borderTopRightRadius:18,
                                            borderTopLeftRadius:18,
                                           
                                        }} />
                              
                          </ImageZoom>
                    )
                })
            }

        </ScrollView>
         {/* <ImageZoom cropHeight={250}
                            cropWidth={Dimensions.get("screen").width -50}
                            imageWidth={Dimensions.get("screen").width -50}
                            imageHeight={250}
                          >
                               <Image source={{uri:this.props.route.params.stocks.image.image}} style={{
                                            height:250,
                                            width:Dimensions.get("screen").width -50,
                                            borderTopRightRadius:15,
                                            borderTopLeftRadius:15,
                                           
                                        }} />
                              
                          </ImageZoom> */}

        <View style={styles.circleDiv} >
            {
                this.props.route.params.stocks.image.map((value, index) =>{
                    return(
                        <View key={index} style={[styles.whiteCircle, { opacity: index === this.state.selectIndex ? 1 : 0.3 }]} >
                            </View>
                    )
                })
            }
        </View>
        <View  >
           <TouchableOpacity  style={{
               flex:1,
               position:"absolute",
               top:-60,
               left:275,
               right:0
           }} onPress={() => this.shareProduct(this.props.route.params.stocks)} >
           <Icon name="arrow-redo" size={24} color="#FFF" />
           </TouchableOpacity>

        </View>
           {/* <SliderImage 
  data={this.props.route.params.stocks.image} 
  width="500px" 
  showDescription={true} 
  direction="right" 
/> */}

           <ScrollView style={{
               marginBottom:140,

           }} >
               <View style={{
                   flex:0.2,
                   justifyContent:"center",
                   flexDirection:"row",
                   alignItems:"center",
        
               }} >
            
          <Text 
            style={{

                fontSize:16,
                margin:10,
                fontFamily:"Roboto-Italic",
            }}
          >Pattern Number :</Text>

<Text 
            style={{
                fontWeight:"normal",
                fontSize:16,
                margin:10,
                fontFamily:"Roboto-Thin",
            }}
          >12345678</Text>
               </View>

               <View style={{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center",
                    flexDirection:"row"
               }} >
            
          <Text 
            style={{
                fontSize:16,
                margin:5,
                marginLeft:25,
                textAlign:"center",
                fontFamily:"Roboto-Italic",
            }}
          >Stock Availability :</Text>

<View style={{
    height:30,
    width:100,
    backgroundColor:"green",
    justifyContent:"center",
    alignItems:"center",
    marginTop:10
}} >
<Text style={{
    textAlign:"center",
    color:"#FFF",
    fontFamily:"Roboto-BoldItalic",
    textShadowRadius:6
}} >Availability</Text>
</View>
               </View>

               <View style={{
                 flex:1,
                 justifyContent:"center",
                 flexDirection:"row",
                 alignItems:"center",

               }} >
            
          <Text 
            style={{
                fontFamily:"Roboto-Italic",
                fontSize:16,
                margin:10,
                marginRight:40
            }}
          >Product name :</Text>

<Text 
            style={{
                fontWeight:"normal",
                fontSize:16,
                margin:10,
                textAlign:"center",
                marginRight:10,
                fontFamily:"Roboto-Thin"
            }}
        >{this.props.route.params.stocks.name}</Text>
               </View>

               <View style={{
                   flex:1,
                   justifyContent:"center",
                   flexDirection:"row",
                   alignItems:"center",
               }} >
            
          <Text 
            style={{
                fontFamily:"Roboto-Italic",
                fontSize:16,
                margin:10,
                marginRight:20
            }}
          >Collection Name :</Text>

<Text 
            style={{
                fontWeight:"normal",
                fontSize:16,
                margin:10,
                fontFamily:"Roboto-Thin",
            }}
          >Free Style</Text>
               </View>

               <View style={{
                   flex:1,
                   justifyContent:"center",
                   flexDirection:"row",
                   alignItems:"center",
               }} >
            
          <Text 
            style={{
                fontFamily:"Roboto-Italic",
                fontSize:16,
                margin:10,
                marginRight:30
            }}
          >Unit :</Text>

<Text 
            style={{
                fontWeight:"normal",
                fontSize:16,
                marginLeft:90,
                marginTop:10,
                fontFamily:'Roboto-Thin'
            }}
          >Roll</Text>
               </View>

               <View style={{
                  flex:1,
                  justifyContent:"center",
                  flexDirection:"row",
                  alignItems:"center",
               }} >
            
          <Text 
            style={{
                fontFamily:"Roboto-Italic",
                fontSize:16,
                margin:10,
                marginRight:20
            }}
          >Product Status :</Text>

<Text 
            style={{
                fontWeight:"normal",
                fontSize:16,
                margin:10,
                fontFamily:"Roboto-Thin",
            }}
          >Continued</Text>

       
               </View>
              
           </ScrollView>
         
      </View>
    
     
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("postJob",{
            	image:this.state.cateLogImage[0].image[0].image
            })} >
            <View style={{
      	height:50,
      	width: Dimensions.get("screen").width,
      	backgroundColor:"#62463e",
      	 justifyContent:"center",
      	 alignItems:"center",
     
      }} >
      <Text style={{
      	textAlign:"center",
      	fontSize:17, 
      	color:"#FFF"
      }} >Post Job</Text>

      </View>
            </TouchableOpacity>
           </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:Dimensions.get("screen").height /5,
        width:Dimensions.get("screen").width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection:"row",
        justifyContent:"space-between"

    },
    formContainer:{

        position:"absolute",
        top:60,
        left:0,
        right:0,
        backgroundColor:"#FFF",
        height:Dimensions.get("screen").height,
        width:Dimensions.get("screen").width -50,
        marginHorizontal:25,
        borderRadius:20,
        flex:1,
        
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
        width:250,
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
        width:200,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:40,
        borderRadius:10
    },
    circleDiv:{
        position:'absolute',
        height:10,
        bottom:15,
        top:240,
        left:0,
        right:0,
        display:'flex',
    flexDirection:"row",
    justifyContent:'center',
    alignItems:'center'
    },
    whiteCircle:{
        width:7,
        height:7,
        borderRadius:7/2,
        margin:6,
        backgroundColor:"#62463e"
    }
})