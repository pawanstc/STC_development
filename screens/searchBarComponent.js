import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
let {height,width} = Dimensions.get('screen')
export default class SearchBarComponent extends Component{
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
                flex:1,
            }} >
                <View style={{
                    height:170,
                    width:width,
                   borderBottomLeftRadius:20,
                   borderBottomLeftRadius:20,
                    backgroundColor:"#62463e"
                }} >

                </View>

            </View>
        )
    }
}