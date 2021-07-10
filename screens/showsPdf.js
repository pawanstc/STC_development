import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import { Stylesheet, View, Text, TouchableOpacity, Image,Dimensions,
    
   } from 'react-native';
import Pdf from 'react-native-pdf';
let {height,width} = Dimensions.get('screen')
export  default class WebViewComponent extends Component{

        
    constructor(props){
        super(props)

        this.state={
            url:this.props.route.params.url
        }
    }
    componentDidMount(){
        if(width>height){
            let temp = width;
            width= height;
            height=temp;
           
            
        }
    }
    
    render(){
        const resourceType = 'url';
        
        return(
            <View style={{
                flex:1,
                alignItems:'center'
            }} >
                <View style={{
                    width:width,
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
                      height:height,
                      width:width -50,
                      marginHorizontal:25,
                      borderRadius:20,
                      flex:1,
                      // justifyContent:"center",
                      alignItems:"center"
                }} >
                    <Pdf
source={{uri:this.state.url}}
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
    height:height,
    width:width -50,
    borderRadius:20,
}}/>

                </View>

            </View>
        )
    }
}