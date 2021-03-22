import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import { Stylesheet, View, Text, TouchableOpacity, Image,Dimensions,
    
   } from 'react-native';
import Pdf from 'react-native-pdf';
export  default class WebViewComponent extends Component{
    render(){
        const resourceType = 'url';
        return(
            <View style={{
                flex:1,
                alignItems:'center'
            }} >
                <View style={{
                    width:Dimensions.get("screen").width,
                    height:170,
                    backgroundColor:"#62463e",
                    borderBottomRightRadius:20,
                    borderBottomLeftRadius:20,
                    flexDirection:"row",
                    justifyContent:"space-between"
               
                }} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" size={20} color="#FFF" style={{
                        margin:20
                    }} />
                    </TouchableOpacity>
                    <Text style={{
                        color:"#FFF",
                        fontSize:18,
                        margin:20,
                        textAlign:"center"
                    }}>{this.props.route.params.content.name}</Text>
                    <View style={{
                        height:40,
                        width:55
                    }} />
                </View>

                <View style={{
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
                }} >
                    <Image source={{uri:this.props.route.params.content.image}} style={{
                        height:500,
                        width:Dimensions.get("screen").width -50,
                        borderTopLeftRadius:18,
                        borderTopRightRadius:18
                    }} />
                   

                </View>

            </View>
        )
    }
}