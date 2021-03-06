import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView,TextInput, Alert } from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import TabContainer from './TabnarComponent';
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
  import {Picker} from '@react-native-picker/picker';

export default class HomeComponent extends Component{

 constructor(props){
     super(props)

     this.state = {
      stocks:  {
        "id":"1",
        "image":[
            {
                "image":"https://media5.picsearch.com/is?qCHvNXSKG4GSKGWziCpZ3NvZKrp5GxG6oqQfYOPhGzU&height=255",
                "text":"image1"
            },
            {
                "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                "text":"image2"
            },
            {
                "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                "text":"image3"
            }
        ],
        "name":"Panache"
    },
    isVisiable:false,
    patterns:this.props.route.params.value.patterns,
    cityList:[],
    city:"",
    city_name:""

     }
 }

 componentDidMount(){

  

    this.getCityList();
   
 }

 getCityList = () =>{
    NetInfo.fetch().then(state =>{
        if(state.isConnected){
            fetch(URL+"/"+"get_stock_city_list",{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(response => response.json())
            .then(result =>{
                console.log(result);
                if(result.error ==false){
                    this.setState({
                        cityList:result.stock_city_list,
                        isVisiable:false
                    })
                }else{
                    this.setState({
                        isVisiable:true
                    })
                }
            }).catch(error =>{
                console.log(error);
            });
        }else{
            Alert(
                "NetWork Error",
                "Please check your Enternet connection"
            )
        }
    })
 }

 // time formate message

//  timeFormateMessage = () =>{
//     var time = new Date().toLocaleString( { hour: 'numeric', minute: 'numeric', hour12: true })
//     this.setState({
//         time:time
//     })

   
//      var formate = "";
//      var time = new Date();
//      var hr = time.getHours();
//      console.log(time);

//      if(hr <12){
//         console.log("Good morning")
//          this.setState({
//              timeFormate:"Good Morning"
//          })
//      }else if(hr >= 12 && hr <=12){
//          console.log("Good Afternoon")
//            this.setState({
//             timeFormate:"Good Afternoon"
//         })
//      }else if(hr >=17 && hr <= 24){
//         console.log("Good Evening")
//         this.setState({
//             timeFormate:"Good Evening"
//         });
//      }
//  }
    render(){
console.log(this.state.params)
    
        return(
          <View style={{
              flex:1,
              
          }} >
              <View style={{
                  height:170,
                  width:Dimensions.get("screen").width,
                  backgroundColor:"#62463e",
                  borderBottomLeftRadius:20,
                  borderBottomRightRadius:20,
                  justifyContent:'space-between',
                  flexDirection:'row'
              }} >
                 <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                 <Icon name="arrow-back" color="#FFF" size={20} style={{
                      margin:20
                  }} />
                 </TouchableOpacity>

                  <Text style={{
                      textAlign:'center',
                      margin:20,
                      fontSize:18,
                      color:"#FFF"
                  }} >Stock Enquiry</Text>
                 {/* <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("profile")} >
                 <Image source={require("../assets/userProfile.png")} style={{
                      height:40,
                      width:40,
                      borderRadius:20,
                      margin:10
                  }} />
                 </TouchableOpacity> */}

                 <View style={{
                     height:40,
                     width:40
                 }} >

                 </View>

              </View>

              <View style={{
                  height:Dimensions.get("screen").height,
                  width:Dimensions.get("screen").width -45,
                  position:"absolute",
                  top:75,
                  left:24,
                  right:24,
                  flex:1,
             
                  backgroundColor:"#FFF",
                  borderTopLeftRadius:20,
                  borderTopRightRadius:20,
                 
              }} >
                 
                 <View style={{
                     flex:1,
                     marginTop:30,
                     alignItems:'center'

                 }} >
                      <Text style={{
                     fontSize:16,
                  
                     marginTop:20,
                     fontSize:18,
                     fontWeight:"bold",
                     
                     textAlign:"center"
                  }} > Select Your City</Text>
                  <View style={{
                      height:40,
                      width:"90%",
                      borderWidth:0.3,
                      borderColor:"black",
                      borderRadius:5,
                      marginTop:30
                  }} >
                      <Picker 
                    selectedValue={this.state.city}
                        onValueChange={(value) => this.setState({
                            city:value
                        })}
                      style={{
                          height:45,
                          width:"100%"
                      }} >
                          {
                              this.state.cityList.map(value =>(
                                <Picker.Item style={{
                                    padding:20
                                }} label={value.city_name.substring(0, 12)} value={value.id}/>
                              ))
                          }

                      </Picker>

                  </View>

                  <TouchableOpacity activeOpacity={2} onPress={() => {
                      if(this.state.city == ""){
                          Alert.alert(
                              "Validation Error",
                              "Please Select Your City"
                          );
                          return;
                      }

                      this.props.navigation.navigate("StockEnquery2",{
                          id:this.state.city,
                      
                      })
                  } } >
                      <View style={{
                          height:45,
                          width:280,
                          backgroundColor:"#62463e",
                          borderRadius:6,
                          justifyContent:'center',
                          alignItems:"center",
                          marginTop:60
                      }} >
                          <Text style={{
                              textAlign:'center',
                              color:"#FFF",
                              fontSize:18
                          }} >  Next</Text>

                      </View>
                  </TouchableOpacity>

                 </View>

              </View>

          </View>
            
        )
    }
}

const styles = StyleSheet.create({
    headerBar:{
        height:Dimensions.get("screen").height /4,
        width:Dimensions.get("screen").width,
        backgroundColor:"#62463e",
        borderBottomRightRadius:18,
        borderBottomLeftRadius:18,
        flexDirection:"row",
        justifyContent:'space-between'


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
        width:250,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:40,
        borderRadius:6
    }
})