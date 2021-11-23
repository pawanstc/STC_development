import  React,{ Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text,StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
 
 export default class StockDetails2 extends Component{ 

	componentDidMount(){
		alert("success")
	}
 	
 	render(){
 		return(

 			<View style={{
 				flex:1,
 				
 				alignItems:"center"
 			}} > 
 			<StatusBar barStyle="light-content" backgroundColor="#62463e" />

 			<View style= {{
 				height:170,
 				width:Dimensions.get("screen").width,
 				borderBottomLeftRadius:18,
 				borderBottomRightRadius:18,
 				backgroundColor:"#62463e",
 				flexDirection:"row"
 			}} >
 			<TouchableOpacity onPress={() => alert("success")} >
 		<Icon name="arrow-back-outline" style={{
 				margin:20
 			}}  color="#FFF" size={18} />
 			</TouchableOpacity>
 			<Text style={{
 				fontSize:18,
 				color:"#fff",
 				margin:20
 			}} >Stock Details</Text>

 			</View>


 			<View style= {{
 				flex:1,
 				justifyContent:"center",
 				 alignItems:"center",
 				 position:"absolute",
 				 top:75,
 				 left:25,
 				 right:25,
 				 height:Dimensions.get("screen").height,
 				width: Dimensions.get("screen").width -45,
 				backgroundColor:"#FFF",
 				borderTopRightRadius:20,
 				borderTopLeftRadius:20
 			}} >

 			<Image source={{uri:'https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg'}} />

 			</View>

 			</View>
 		)
 	}
 } 