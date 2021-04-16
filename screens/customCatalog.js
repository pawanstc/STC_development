import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, ImageBackground, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import TabBarContainer from './TabnarComponent.js';
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
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
import { URL, imageUrl } from '../api.js';
export default class StackNavigation extends Component{

    constructor(props){
        super(props)

        this.state = {
         catelog_list:[],
            isVisible:true,
            refreshing:false
        }
    }

componentDidMount(){

    this.customCatelog();
 
}

customCatelog = ()=>{
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
                        catelog_list:result.catlog_list,
                        isVisiable:true,
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

subCustomCatelog = (id) =>{
    this.props.navigation.navigate("subCategory2",{
        id:id
    })
}

handleRefreshing = () =>{
    this.setState({
        refreshing:true
    }, () =>{
        this.customCatelog()
    })
}
    render(){

        return(
         
 <View style={{
               flex:1,
               height:Dimensions.get("screen").height +200
            }} >
         <StatusBar barStyle="light-content" backgroundColor="#62463e" />

            <View style={ styles.headerBar } >
            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
            <Icon name="arrow-back" size={20} style={{
                    margin:22
                }}  color="#FFF" />
            </TouchableOpacity>
             {/* <View>
             <Moment>{this.state.time}</Moment>
             </View> */}
           <Text style={{
               fontSize:18,
               color:"#FFF",
           
            marginTop:20
            
           }} >Catalog Master</Text>
           <View style={{
               height:40,
               width:50
           }} />
                </View>

                <View style={ styles.formContainer } >
           
                <View style={{
                       flex:1,
                       alignItems:'center',
                       justifyContent:"center"
                   }} >
                   

              
                   
            <View style={{
            flex:1,
            justifyContent:"center",
            alignItems:'center'
            
            }} >
            
            
           <FlatList
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefreshing}
          showsVerticalScrollIndicator={false}
           numColumns={2}
          contentContainerStyle={{
              paddingBottom:140
          }}
           
           data={this.state.catelog_list}
            renderItem={(value, index) => {
               console.log(value)

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
                            marginBottom:10
                        }} >
                       <TouchableOpacity activeOpacity={2} onPress={() => this.subCustomCatelog(value.item.id)} >
                       <ImageLoad
                                 isShowActivity={true}
    style={{  height:110,
        width:120, marginTop:20 }}
    loadingStyle={{ size: 'large', color: '#62463e' }}
    borderRadius={6}
    source={{ uri:imageUrl+"/"+value.item.catlog_image}}
/>

                            <Text numberOfLines={2} style={{
                             
                                textAlign:'center',
                                fontSize:14,
                                width:120,
                                height:45
                            }} >
                                {value.item.catlog_name} 
                            </Text>
                       </TouchableOpacity>

       <View style={{
           
           width:120,
           marginLeft:10
       }} >
                     <Button
                    onPress={() => this.subCustomCatelog(value.item.id)}
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
           keyExtractor={items => items.id}
           />
            </View>
                   
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