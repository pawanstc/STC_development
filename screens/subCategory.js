import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, ImageBackground, Button, Animated,ScrollView,Keyboard, KeyboardAvoidingView, Alert, Touchable } from 'react-native';
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
                    "id":"1",
                    "name":"Platinum"
                },
                {
                    "id":"2",
                    "name":"Economical"
                },
                {
                    "id":"3",
                    "name":"Customize"
                }
            ],
            cat_name:"Platinum"
      
        }
    }

componentDidMount(){
   
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
       
         return true;
     }else{
         return false;
     }
 }

//  getCatlog = ()=>{
//      NetInfo.fetch().then(isConnected =>{
//          if(isConnected){
//             fetch("http://phpstack-525410-1692898.cloudwaysapps.com/backend/v1/get_catlog_details",{
               
//                 method:"GET"
//             }).then(response => response.json())
//             .then(result => {
               
//                 if(result.catlog_list.length >0){
//                     this.setState({
//                         cate_log_list:result.catlog_list,
//                         refreshing:false
//                     })
//                 }else{
//                     this.setState({
//                         isVisible:true
//                     });
//                 }
//             }).catch(error =>{
//                 this.setState({
//                     refreshing:false
//                 })
//                 console.log(error);
//             })
//          }else{
//             Alert.alert( 
//                 "Network Alert",
//                 "Please check Your Internet connection"
//             )
//          }
//      })
//  }

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
         this.changeCat();
     })
 }

 getCatlog = () =>{
     if(this.state.cat_name === "Platinum"){
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_stock_details_wallpaper_platinum",{
                    headers:{
                        "Content-Type":"application/json"
                    },
                    method:"GET"
                }).then(response => response.json())
                .then(result =>{
                    if(result.error == false){
                        this.setState({
                            cate_log_list:result.stock_catlog_list,
                            refreshing:false
                        });
                    }else{

                    }
                }).catch(error =>{
                    consoile.log(error);
                });
            }else{
                Aelrt.alert(
                    "Network Error",
                    "Please Check your Internet connection !!"
                );
            }
        })
     }
 }
 changeCat = (value) =>{
     
     this.setState({
         cat_name:value,
         cate_log_list:[]
     });

        if(value === "Platinum"){
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_stock_details_wallpaper_platinum",{
                        headers:{
                            "Content-Type":"application/json"
                        },
                        method:"GET"
                    }).then(response => response.json())
                    .then(result =>{
                        if(result.error == false){
                            this.setState({
                                cate_log_list:result.stock_catlog_list,
                                refreshing:false
                            });
                        }else{

                        }
                    }).catch(error =>{
                        consoile.log(error);
                    });
                }else if (value === "Customize"){
                    Aelrt.alert(
                        "Network Error",
                        "Please Check your Internet connection !!"
                    );
                }else{
                    this.setState({
                        cat_name:"Platinum"
                    });

                }
            })
        }else if(value === "Economical"){
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_stock_details_wallpaper_economical",{
                        headers:{
                            "Content-Type":"application/json"
                        },
                        method:"GET"
                    }).then(response => response.json())
                    .then(result =>{
                        if(result.error == false){
                            this.setState({
                                cate_log_list:result.stock_catlog_list,
                                refreshing:false
                            });
                        }else{

                        }
                    }).catch(error =>{
                        consoile.log(error);
                    });
                }else{
                    Aelrt.alert(
                        "Network Error",
                        "Please Check your Internet connection !!"
                    );
                }
            })
        }else{
             NetInfo.fetch().then(state =>{
        if(state.isConnected){
            fetch(URL+"/get_customise_catlog_details_by_catlog_master_name", {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"GET",
                
            }).then(response => response.json())
            .then(result =>{
                console.log(result)
                if(result.error == false){
                    console.log(result);
                    this.setState({
                        cate_log_list:result.catlog_list,
        
                        refreshing:false
                    })
                }else{
                    this.setState({
                        isVisiable:false
                    })
                }
            }).catch(error =>{
                console.log(error);
            });
        }else{
            Alert.alert(
                "Network Error",
                "Please chec Your Internet connection"
            )
        }
    })
            
        }
 }
    render(){

        console.log(this.state.cate_log_list.length)

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

          

      <Text style={{
        marginHorizontal:92,
          fontSize:16,
          color:"#FFF",
          margin:20,
          marginRight:50
          
      }} >  Catalog</Text>
      <View style={{
          width:100
      }}  />

          
        <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("searchComponent")} >
            

    
        </TouchableOpacity>
           
            
          
           <View />
                </View>

                <View style={ styles.formContainer } >
           
              
                  <FlatList
                data={this.state.category_name}
                contentContainerStyle={{
                    paddingBottom:12,
                   
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={(items, key) =>{
                    return(
                       <View  style={{
                           flex:1,
                        
                       }} >
                           {
                               this.checkCat(items.item.name) ? (
                               <TouchableOpacity onPress={() => this.changeCat(items.item.name)} activeOpacity={2} >
                                    <View style={{
                                      
                                        flexGrow:1
                                    }} >
                                    <View style={{
                                        height:45,
                                        width:98,
                                        
                                        justifyContent:"center",
                                        alignItems:"center",
                                        marginTop:10,
                                        borderColor:"#DDD",
                                      
                                    }} >  
                                            <Text style={{
                                        fontSize:16,
                                        fontWeight:"normal",
                                        
                                    }} >{ items.item.name }</Text>


                                    </View>
                                    <View style={{
                                        borderBottomColor:"#62463e",
                                        borderBottomWidth:3,
                                    }} />
                                    </View>
                               </TouchableOpacity>
                               ) :(
                                <TouchableOpacity onPress={() => this.changeCat(items.item.name)} activeOpacity={2} >
                                    <View style={{
                                    margin:0,
                                    
                                }} >
                                    <View style={{
                                      height:45,
                                      width:98,
                             
                                      justifyContent:"center",
                                      alignItems:"center",
                                      marginTop:10,
                                      borderColor:"#DDD",
                                    }} >  
                                            <Text  style={{
                                        fontSize:12,
                                        fontWeight:"bold",
                                        textAlign:"center"
                                    }} >{ items.item.name }</Text>
                                    </View>
                                    
                                    </View>
                               </TouchableOpacity>
                               )
                           }
                           </View>
                    )
                }}
                keyExtractor={(item) => item.id}
               /> 
              

              {
                  this.state.cate_log_list.length >0  ? (
                    <FlatList
               contentContainerStyle={{
                   paddingBottom:200
               }}
              
                    data={this.state.cate_log_list}
                    showsVerticalScrollIndicator={false}
                    renderItem={(items) =>{
                        console.log(items.item.catlog_image)
                    return(
         
                        <View style={{
                            flexDirection:"row",
                            justifyContent:'space-between',
                            height:"100%",
                            flexGrow:1
                        }} >
                            <View style={{
                                flexDirection:"column",
                                justifyContent:"center",
                                alignItems:'center',
                                marginBottom:20
                            }} >
                           <TouchableOpacity activeOpacity={2} onPress={() => this.subCatelogById(items.item.id)} >
                           <ImageLoad
                                     isShowActivity={true}
        style={{  height:110,
            width:120, marginTop:20 }}
        loadingStyle={{ size: 'large', color: '#62463e' }}
        borderRadius={6}
        source={{ uri:imageUrl+"/"+items.item.catlog_image}}
    />
    
                                <Text numberOfLines={2} style={{
                                 
                                    textAlign:'center',
                                    fontSize:14,
                                    width:120,
                                    height:45
                                }} >
                                    {items.item.catlog_name} 
                                </Text>
                           </TouchableOpacity>
    
           <View style={{
               marginTop:10,
               width:120,
               marginLeft:10
           }} >
                         <Button
                        onPress={() => this.subCatelogById(items.item.id)}
    touchSoundDisabled ={false}
      title="Explore"
      color="#62463e"
     containerStyle={{
         width:200
     }}
      accessibilityLabel="Learn more about this purple button"
    />
               </View>
    
                                </View>
    
                            </View>
          
                    )
                    }}
                    keyExtractor={(items) => items.id}
                    numColumns={2}
                    
     
                    />
                  ) :(
                      <View style={{
                          
                          alignItems:"center",
                          flex:2
                      }} >
                      <Text style={{
                          textAlign:"center",
                          fontSize:18,
                          color:"grey"
                      }} >No Data Found</Text>
                      </View>
                  )
              }
              </View>
      </View>


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
        justifyContent:"space-between",


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
    
        alignItems:"center",
        flex:1
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
    }
})