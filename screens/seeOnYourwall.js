import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
let {height,width} = Dimensions.get('screen')
export default class ShowOnYourWall extends Component{
    componentDidMount(){
        if(width>height){
            let temp = width;
            width= height;
            height=temp;
           
            
        }
    }
    render(){
        return(
            <View style={{
               
                flex:1
            }} >
                <View style={{
                    height:60,
                    width:width,
                    backgroundColor:"#62463e",
                    flexDirection:"row",
                    justifyContent:'space-between'
                }} >
                    <Icon name="arrow-back" onPress={() => this.props.navigation.goBack(null)} size={20} color="#FFF" style={{
                        margin:20
                    }} />
                    <Text style={{
                        textAlign:'center',
                        color:"#FFF",
                        fontSize:16,
                        margin:20
                    }} >See On Your Wall </Text>

                    <View style={{
                        height:40,
                        width:50
                    }} >

                    </View>

                </View>
                <WebView
        source={{ uri: 'https://www.stcwallpaper.com/seeonyourwall/' }}
        style={{ marginTop: 0 }}
      />

            </View>
        )
    }
}