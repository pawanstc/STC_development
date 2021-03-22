import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, ImageBackground, Button } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import TabBarContainer from './TabnarComponent.js';
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

export default class StackNavigation extends Component{



    constructor(props){
        super(props)

        this.state = {
           brandProducts:[
               
               {
                   "name":"Creative art",
                   "image":require("../assets/Brandname2.png")
               }
           ],
            isVisible:false
        }
    }

componentDidMount(){

    setTimeout(() =>{
        this.setState({
            isVisible:true
        });
    },3200);

}
    render(){

        return(
           <View style={{
               flex:1
           }} >
 <View style={{
               flex:1,
              
               alignItems:"center",
            
            }} >
         <StatusBar barStyle="light-content" backgroundColor="#62463e" />

            <View style={ styles.headerBar } >
            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
            <Icon name="arrow-back" size={20} style={{
                    margin:10
                }}  color="#FFF" />
            </TouchableOpacity>
             {/* <View>
             <Moment>{this.state.time}</Moment>
             </View> */}
           <Text style={{
               fontSize:16,
                            color: "#FFF",
               margin:20,
            marginTop:40
            
                        }} >CateLog Main</Text>
                        <View style={{
                            height: 45,
                            width:45
                        }} />
                </View>

                <View style={ styles.formContainer } >
           
           {
               this.state.isVisible ? (
                   <View style={{
                       flex:0.6,
                       alignItems:'center',
                       justifyContent:"center"
                   }} >
                       <Text style={{
                
                fontSize:18,
        
                textAlign:"center",
                fontFamily:'Roboto-BlackItalic',
                color:"grey"
            }} >Please Select a  Brand </Text>
                   
            <View style={{
            flex:0.6,
            justifyContent:"center"
            
            }} >
            
            
           <FlatList
           horizontal={true}
           data={this.state.brandProducts}
            renderItem={(value, index) => {
                return(
                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }} >
                        <View style={{
                            flexDirection:"column",
                            justifyContent:"center",
                            alignItems:'center'
                        }} >
                            <Image source={value.item.image} style={{
                                height:120,
                                width:125,
                           
                            }} />

                            <Text style={{
                              
                                textAlign:'center',
                                fontSize:16
                            }} >
                                {value.item.name}
                            </Text>

       <View style={{
           marginTop:10,
           width:120,
           marginLeft:10
       }} >
                     <Button
                    onPress={() => this.props.navigation.navigate("subCategory",{
                        stocks:value.item.name
                    })}
touchSoundDisabled ={false}
  title="Explore"
  color="#c62828"
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
               ) :(
        
                <View style={{
                    flex:0.6,
                    justifyContent:'center'
                }} >
                    <BallIndicator color='#62463e'
                    size={30}
                />

                    </View>
               )
           }
      </View>


            </View>
            <TabBarContainer navigate={this.props.navigation} />
           </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:Dimensions.get("screen").height /5,
        width:Dimensions.get("screen").width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection: "row",
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