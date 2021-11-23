import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, ImageBackground, Button, Animated,ScrollView,Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import ImageView from 'react-native-image-view';

import TabBarContainer from './TabnarComponent.js';
import {URL} from '../api.js';
import {imageUrl} from '../api.js';
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
  import NetInfo from "@react-native-community/netinfo";
  import ImageLoad from 'react-native-image-placeholder';
  let {height,width} = Dimensions.get('screen')
export default class StackNavigation extends Component{

    constructor(props){
        super(props)

        this.state = {
            cate_log_list:[],
            isVisible:false,
            catname:"",
            barAnimation: new Animated.Value(0),
            focus:false,
            sub_catelog:[],
            show_search_component:false,
            searchInput:"",
            search_cat_log_list:[],
            close_bar_activity:false,
            refreshing:false,
            category_name:[
                {
                    "id":1,
                    "name":"Platinum"
                },
                {
                    "id":2,
                    "name":"Economic"
                },
                {
                    "id":2,
                    "name":"Customize"
                }
            ],
            cat_name:"Platinum"
      
        }
    }

componentDidMount(){
   
    if(width>height){
        let temp = width;
        width= height;
        height=temp;
       
        
    }
this.getCatlog();
    setTimeout(() =>{
        this.setState({
            isVisible:true
        });
    },200);
    this.setState({
        catname:this.props.route.params.stocks.name
    })
}
// 
searchBarAppear = () =>{
   Animated.timing(this.state.barAnimation,{
    toValue:1,
    duration:1000,
    useNativeDriver:false
   }).start(() =>{
       
       this.refs.searchBarInput.focus();
   });
}; 
 
 closeSearchBar = async () => {
        
  Keyboard.dismiss();
  Animated.timing (this.state.barAnimation, {
    toValue:0,
    duration:1000,
    useNativeDriver:false
  }).start(() => this.show_privious_components());
 
 }

 checkCat = (value) => {
    
     if(value === this.state.cat_name){
         console.log("yes");
         return true;
     }else{
         return false;
     }
 }

 getCatlog = ()=>{
     NetInfo.fetch().then(isConnected =>{
         if(isConnected){
            fetch("http://phpstack-525410-1692898.cloudwaysapps.com/backend/v1/get_catlog_details",{
               
                method:"GET"
            }).then(response => response.json())
            .then(result => {
               
                if(result.catlog_list.length >0){
                    this.setState({
                        cate_log_list:result.catlog_list,
                        refreshing:false
                    })
                }else{
                    this.setState({
                        isVisible:true
                    });
                }
            }).catch(error =>{
                this.setState({
                    refreshing:false
                })
                console.log(error);
            })
         }else{
            Alert.alert( 
                "Network Alert",
                "Please check Your Internet connection"
            )
         }
     })
 }

 show_privious_components =  () =>{
     this.setState({
        close_bar_activity: false,
        show_search_component:false,
        searchInput:""
     });
   
 }

 subCatelogById = (id, name) =>{
    this.props.navigation.navigate("products",{
        id:id,
        name:name
    })
 }

 searchCatlog = (value) =>{
     console.log(value);
     NetInfo.fetch().then(state =>{
        if(state.isConnected){
           fetch("http://phpstack-525410-1692898.cloudwaysapps.com/backend/v1/get_catlog_details_by_catlog_master_name",{
               headers:{
                   "Content-Type":"application/x-www-form-urlencoded"
               },
             method:"POST",
             body:"name=" +value
           }).then(response => response.json())
           .then(result =>{
               console.log(result)
               if(result.catlog_list.length >0){
                   this.setState({
                       refreshing:false,
                       search_cat_log_list:result.catlog_list,
                       show_search_component:true,
                       close_bar_activity:true,
                       
                     
                   });
               }else{
                   this.setState({
                       show_search_component:false,
                       refreshing:false
                   });
               }
           }).catch(error =>{
               console.log(error);
           });
        }else{
            Alert.alert(
                "NetWork Error",
                "Please check Your Internet connection"
            )
        }
    })
 }

 handleRefresh = () =>{
     this.setState({
         refreshing:true
     }, () =>{
         this.getCatlog();
     })
 }
    render(){
        console.log(this.state.focus)

   const barWidth = this.state.barAnimation.interpolate({
    inputRange:[0,1],
    outputRange:[0,265]
   });

  const headerTitleShow = this.state.barAnimation.interpolate({
    inputRange:[0,1],
    outputRange:[1,0]
  })
  const barOpacity = this.state.barAnimation.interpolate ({
    inputRange:[0,1],
    outputRange:[0,1]
  });
 
        return(
           <View style={{
               flexGrow:1
           }} >
 <View style={{
               flex:1,
              
               alignItems:"center"
            }} >
         <StatusBar barStyle="light-content" backgroundColor="#62463e" />

            <View style={ styles.headerBar } >
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
            <Icon name="arrow-back-outline" size={20} style={{
                    margin:20,
               
                    
                }}  color="#FFF" />
            </TouchableOpacity>

          

          <Animated.View style={{
            width:barWidth,
            opacity:barOpacity,
            
              alignItems:"center"
          }}  >
                
      <TextInput
      placeholder="Search Your Wallpaper"
     ref="searchBarInput"
     onChangeText ={(value) => this.searchCatlog(value) }
    //  onSubmitEditing={() => this.searchCatlog()}
          placeholderTextColor="black"
      style={{
        height:40,
        borderRadius:5,
        borderWidth:0.6,
        borderColor:"#FFF",
        marginTop:8,
        width:"80%",
        backgroundColor:"#FFF",
       

      }}
      placeholderTextColor="#000"

       />
       <TouchableOpacity activeOpacity={2} onPress={() => this.closeSearchBar()} style={{
        top:-33,
        left:"30%",
        right:0,
        position:"relative"
       }} >
       <Icon name="close-outline" color="#000" size={25} />
       </TouchableOpacity>

     
          </Animated.View>

          

         {
          this.state.barAnimation   ?(
           

           <Icon name="search" onPress={() => this.searchBarAppear()} style={{
            marginTop:20,
            marginLeft:160
           }} size={20} color="#FFF"/>
    
          ):(
             null
          )
         }
             {/* <View>
             <Moment>{this.state.time}</Moment>
             </View> */}
            
          
           <View />
                </View>

                <View style={ styles.formContainer } >
           
          <KeyboardAvoidingView
          
             behavior="padding"
          >
              
               {
               this.state.isVisible ? (
                   <View>
                 
                     
                    
            <View >
            
            
            <View style={{
            alignItems:'center',
            flex:1
            }} >
            {
                this.state.category_name.forEach((value, index) =>{
                    console.log(value)
                    return(
                        <View style={{
                            justifyContent:"center",
                            alignItems:"center",
                            height:39,
                          
                       
                        }} >
                            <Text style={{
                                textAlign:"center",
                                fontWeight:"bold",
                                fontSize:16
                            }} >{ value.name }</Text>
                            </View>
                    )
                })
            }
           {
               this.state.show_search_component || this.state.searchInput !="" || this.state.close_bar_activity ? (
                    <FlatList
                        data={this.state.search_cat_log_list}
                        contentContainerStyle={{
                            paddingBottom:100
                        }}
                        renderItem={(items) => {
                           
                          if(items){ 
                            return(
                                <View style={{
                                    margin:6,
                                    marginTop:20,
                                    flexGrow:1,
                                 
                                   alignItems:'center',
                                   justifyContent:'center',
                                   borderRadius:8
                         
                                }} >
                                   {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("stockDetails",{
                                       stocks:items.item
                                   })} > */}
                               <TouchableOpacity activeOpacity={1} onPress={() => this.subCatelogById(items.item.id, items.item.subCatelogById) } >
                    
                               {/* <Image source={{uri:items.item.catlog_image}} style={{
                                     height:110,
                                     width:120,
                                     borderRadius:5
                                 }} /> */}
                                 <ImageLoad
                                 isShowActivity={true}
    style={{  height:110,
        width:120, }}
    loadingStyle={{ size: 'large', color: '#62463e' }}
    borderRadius={6}
    source={{ uri: items.item.catlog_image }}
/>
                                <Text style={{
                                    marginTop:6,
                                    textAlign:"center",
                    
                                }} >{items.item.catlog_name}</Text>
                               
                               </TouchableOpacity>
                             <View style={{
                                 marginTop:10,
                                 marginBottom:12,
                                 width:120
                             }} >
                                    <Button
                                    touchSoundDisabled={false}
                      onPress={() => this.subCatelogById(items.item.id, items.item.catlog_name) }
                      title="Explore"
                      color="#62463e"
                      
                    />
                             </View>
                             <View style={{
                                 height:20
                             }} />
                                    </View>
                                    
                            )
                          }else{
                              return(
                                  <View style={{
                                      flex:1,
                                  
                                  }} >
                                      <Text style={{
                                          textAlign:'center',
                                          fontSize:18,
                                          color:"grey"
                                      }} >No Data</Text>

                                      </View>
                              )
                          }
                        }}

                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
               ) :(
                <FlatList
               
              
                data={this.state.cate_log_list}
                showsVerticalScrollIndicator={false}
                renderItem={(items) =>{
                    console.log(items.item.id)
                return(
     
                    <View style={{
                    margin:6,
                    marginTop:20,
                 
                   alignItems:'center',
                   justifyContent:'center',
   
         
                }} >
                   {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("stockDetails",{
                       stocks:items.item
                   })} > */}
               <TouchableOpacity activeOpacity={1} onPress={() => this.subCatelogById(items.item.id, items.item.catlog_name) } >
    
               <Image source={{uri:items.item.catlog_iamge}} style={{
                     height:110,
                     width:120,
                     borderRadius:6
                 }} />
                <Text style={{
                    marginTop:6,
                    textAlign:"center",
    
                }} >{items.item.catlog_name}</Text>
                
               </TouchableOpacity>
             <View style={{
                 marginTop:10,
                 marginBottom:12,
                 width:120
             }} >
                    <Button
      onPress={() => this.subCatelogById(items.item.id, items.item.catlog_name) }
      title="Explore"
      color="#62463e"
      accessibilityLabel="Learn more about this purple button"
    />
             </View>
     
                    </View>
      
                )
                }}
                keyExtractor={(items) => items.id}
                numColumns={2}
                refreshing={this.state.refreshing}
               onRefresh={this.handleRefresh}

                />
               )
           }
            </View>
            </View>

     
                       </View>
               ) :(
        
                <View style={{
                    flex:0.6,
                    justifyContent:'center'
                }} >
                    <BallIndicator color='#62463e'
                    size={30}
                />

                    </View>
               )
           }

          </KeyboardAvoidingView>
      </View>


            </View>
            
           </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:170,
        width:width,
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
        height:height,
        width:width -50,
        marginHorizontal:25,
        borderRadius:20,
    
        alignItems:"center"
    },
    tabContainer:{
      
        height:60,
        width:width,
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
    }
})