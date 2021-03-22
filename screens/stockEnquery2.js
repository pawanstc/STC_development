import  React, { Component } from 'react';

import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions,FlatList, Alert, ActivityIndicator  } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import RNRestart from 'react-native-restart'; 

import moment from "moment";
export default class StockEnquery2 extends Component {

    constructor(props){
        super(props);

        this.state ={
            StockData:[],
            pattern_no:"",
            collapse:true,
            city_name:"",
            date:"",
            noData_found:false
        }
    }

    toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
      };

    componentDidMount(){
        this.getcity();
    }

    getcity = () =>{
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_stock_city_details_by_city_id", {
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method:"POST",
                    body:"city_id="+ this.props.route.params.id
                }).then(response => response.json())
                .then(result =>{
                    if(result){
                        let date = result.stock_city_list[0].update_stock_date;
                    var newDate = moment(date).format("MMM Do YY")
                 
                    this.setState({
                        city_name:result.stock_city_list[0].city_name,
                        date:newDate.toString()
                    });
                    }else{
                        this.setState({
                            noData_found:true
                        });
                    }
                    
                }).catch(error =>{
                    console.log(error);
                })
            }else{
                Alert.alert(
                    "NetWork Error",
                    "Please Check Yout Inter net connection and Restart app !!",
                    [
                        {
                            text:"Ok",
                            onPress:() => RNRestart.Restart(),
                            style:"success"
                        }
                    ]
                );
            }
        })
    }

    StockDetails = (value)=>{
        console.log(value);
        
            if(value == ""){
                
                this.setState({
                    StockData:[]
                });
                return;
            }else{
                
            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_stock_details_pattern_no",{
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method:"POST",
                        body:"pattern_no=" +value+ "&city_id=" +this.props.route.params.id
                    }).then(response => response.json())
                    .then(result =>{
           
                        if(result.error == false){
                           this.setState({
                               StockData:result.stock_catlog_list
                           })
                        }else{
                            this.setState({
                                StockDetails:[]
                            })
                        }
                    }).catch(error =>{
                        console.log(error);
                    })
                }else{
                    Alert.alert(
                        "Network Error",
                        "Please Check your Interet connection"
                    )
                }
            })
  
            this.setState({
                SearchData:[],

            });

            NetInfo.fetch().then(state =>{
                if(state.isConnected){
                    fetch(URL+"/get_stock_details_pattern_no",{
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method:"POST",
                        body:"pattern_no=" +value+ "&city_id=" +this.props.route.params.id
                    }).then(response => response.json())
                    .then(result =>{
           
                        if(result.error == false){
                           this.setState({
                               StockData:result.stock_catlog_list
                           })
                        }else{
                        this.setState({
                            StockData:[]
                        })
                        }
                    }).catch(error =>{
                        console.log(error);
                    })
                }else{
                    Alert.alert(
                        "Network Error",
                        "Please Check your Interet connection"
                    )
                }
            })
            }
    }
    render(){
        console.log(this.state.StockData)
        return(
            <View style={{
                flex:1,
                
            }} >
                
                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                    borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,
                    backgroundColor:"#62463e",
                    flexDirection:'row',
                    justifyContent:'space-between'
                }} >

                <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} > 
                <Icon name="arrow-back" color="#FFF" size={20} style={{
                    margin:20
                }} />
                </TouchableOpacity>
                <Text style={{
                    textAlign:'center',
                    fontSize:18,
                    fontWeight:"normal", 
                    color:"#FFF",
                    margin:20
                }} >Stock Enquiry</Text>
             
             <View style={{
                 height:40,
                 width:43,
             }} >

             </View>
                </View>

                <View style={{
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width -45,
                    position :"absolute",
                    left:24,
                    right:24,
                    top:70,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:"#FFF",
                  alignItems:'center',
                  flex:1,
                  
                }} >
                    {
                        this.state.city_name != null && this.state.date  ? (
                            <View style={{
                                flex:1,
                                alignItems:"center"
                            }} >
                                <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        marginTop:20
                    }} >
                        <View style={{
                        alignItems:"center",
                        flexDirection:"row"
                    }} >
                           <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                           <Icon name="location-outline" size={13} style={{
                            margin:6
                           }} color="red" />
                           </TouchableOpacity>
                        <Text style={{
                            fontSize:14
                        }} >{ this.state.city_name }</Text>
                     
                        
                    </View>
                    <View style={{
                        height:20,
                        width:"40%"
                    }} />

                    <Text style={{
                        fontSize:14,
                       
                    }} >Date :{ this.state.date }</Text>

                    </View>
                   <TextInput
                    placeholder="Enter Pattern Number"
                    placeholderTextColor="grey"
                    onChangeText={(value) => this.StockDetails(value)}
                    style={{
                        height:50,
                        width:285,
                        elevation:0,
                        padding:12,
                        marginTop:20,
                        borderWidth:0.1,
                        elevation:1,
                      
                        
                    }}
                   />
                   <Icon name="search" color="black" size={18} style={{
                       position:"absolute",
                       top:80,
                       left:240,
                       right:0
                   }} />

                 
             
                      
                   {
                       this.state.StockData.length > 0  ? (
                     
                               <FlatList 
                               nestedScrollEnabled={true}
                           showsVerticalScrollIndicator={false}
                           enableEmptySections={true}
                            
                            contentContainerStyle={{
                                
                                paddingBottom:120
                            }}
                           data={this.state.StockData}
                           renderItem={(items) => {
                               
                               return(
                                   <View style={{
                                        
                                       flex:1,
                                      
                                       alignItems:"center"
                                   }}  >
                                      <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("enqueryDetails",{
                                          id:items.item.id
                                      })} >
                                      <View style={{
                                          flexDirection:"row",
                                          justifyContent:"space-between",
                                          height:60,
                                          width:280,
                                         borderColor:"black",
                                          borderRadius:0.6,
                                          alignItems:'center',
                                        
                                          borderBottomColor:"grey"
                                
                                      }} >
                                          <View style={{
                                              flexDirection:"column",
                                              marginBottom:2
                                          }} >
                                              <Text style={{
                                              fontSize:16,
                                              textAlign:"left"
                                    
                                          }} > { items.item.pattern_no }</Text>
                                          

                                              </View>
                                            <Icon name="chevron-forward-outline" size={18} style={{
                                                marginLeft:0
                                            }}  color="black" /> 
                                          </View>

                                            <View style={{
                                                borderWidth:0.2,
                                                borderColor:"grey",
                                                width:"100%"
                                            }} />
                                          
                                      </TouchableOpacity>
                                            
                           
                                       </View>
                               )
                           }}

                           />
                           
                       
                       ) :(
                           <View style={{
                          
                               alignItems:'center',
                               marginTop:50
                           }} >
                          <View style={{
                              flexDirection:"row"
                          }} >
                              <Icon name="search-outline" color="grey" size={18} />
                              <Text style={{
                               textAlign:"center",
                               fontSize:16,
                               color:"grey"
                           }} >  Search Your Stock Details</Text>

                              </View>

                           </View>
                       )
                   }
                                </View>
                        ) :(
                            <View style={{
                                flex:0.5,
                                justifyContent:"center",
                                alignItems:"center"
                            }} >
                                <ActivityIndicator size="large" color="#62463e" />
                                </View>
                        )
                    }

                </View>

                </View>
             
 
        )
    }
}