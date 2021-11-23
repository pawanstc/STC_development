 import React, { Component } from 'react';

 import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
 import SkeletonPlaceholder from "react-native-skeleton-placeholder";
 import Icon from 'react-native-vector-icons/Ionicons'
 let {height,width} = Dimensions.get('screen')
 export default class Placehodler extends Component{
     render(){
         return(
           <View style={{
               flex:1,
               justifyContent:'center',
               alignItems:'center'
           }} >
                <SkeletonPlaceholder>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
        <View style={{ marginLeft: 20 }}>
          <View style={{ width: 120, height: 20, borderRadius: 4 }} />
          <View
            style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
           </View>
         )
     }
 }