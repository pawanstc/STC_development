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
                    }}>Pdf View</Text>
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
                    <Pdf
source={{uri:"http://www.africau.edu/images/default/sample.pdf"}}
onLoadComplete={(numberOfPages,filePath)=>{
    console.log(`number of pages: ${numberOfPages}`);
}}
onPageChanged={(page,numberOfPages)=>{
    console.log(`current page: ${page}`);
}}
onError={(error)=>{
    console.log(error);
}}
onPressLink={(uri)=>{
    console.log(`Link presse: ${uri}`)
}}
style={{
    height:Dimensions.get("screen").height,
    width:Dimensions.get("screen").width -50,
    borderRadius:20,
}}/>

                </View>

            </View>
        )
    }
}