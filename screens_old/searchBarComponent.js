import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';

export default class SearchBarComponent extends Component{
    render(){
        return(
            <View style={{
                flex:1,
            }} >
                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                   borderBottomLeftRadius:20,
                   borderBottomLeftRadius:20,
                    backgroundColor:"#62463e"
                }} >

                </View>

            </View>
        )
    }
}