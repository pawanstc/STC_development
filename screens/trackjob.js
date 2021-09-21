import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Alert,ActivityIndicator, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import StepIndicator from 'react-native-step-indicator';
import moment from 'moment';
import { getBatteryLevel } from 'react-native-device-info';
const labels=["Cart","cart","cart","cart","cart","cart"]
const labels5 = ["Cart","cart","cart","cart","cart"];
const labels1 = ["cart"];
const labels2 = [ "cart","cart"];
const labels3 = ["cart","cart", "cart"];
const labels4 = ["cart","cart","cart","cart"];

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
  }
  let {height,width} = Dimensions.get('screen')
export default class TrackJob extends Component{
    constructor(props){
        super(props);

        this.state = {
            status:[],
            currentPosition:0,
            user_id: '',
        }
    }

    componentDidMount(){
        if(width>height){
            let temp = width;
            width= height;
            height=temp; 
        }
        this.statusGet();
        AsyncStorage.getItem('user_id').then((result) => {
            this.setState({
              user_id: result,
            })
            console.log('user_id============>', this.state.user_id)
        });
    }

    statusGet = () =>{
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_order_status_by_order_id",{
                // fetch(URL+"/get_all_log_by_user_id",{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    method:"POST",
                    body:"order_id="+ this.props.route.params.order_id+
                    "&user_id="+this.state.user_id
                }).then(response  => response.json())
                .then(result =>{
                  console.log(result);
                    if(result.error == false){
                        this.setState({
                            status:result.status_details
                        })
                    }else{

                    }
                }).catch(error =>{
                    console.log(error);
                });
            }else{
                Alert.alert(
                    "Network Error",
                    "Please check your Internet connection"
                )
            }
        })
    }
    render(){
        if(this.state.status.length > 5){
            return(
                <View style={{
                    flex:1
                }} >
                   <View style={{
                       height:170,
                       width:width,
                       backgroundColor:"#62463e",
                       borderBottomLeftRadius:20,
                       borderBottomRightRadius:20,
                       flexDirection:"row",
                       justifyContent:'space-between'
                       
                   }} >
                       <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" size={18} style={{
                        margin:20
                    }} color="#FFF" />
                       </TouchableOpacity>
                       <Text style={{
                           textAlign:"center",
                           color:"#FFF",
                           fontSize:18,
                           margin:20
                       }} >Job Details</Text>
                       <View style={{
                           height:20,
                           width:50
                       }} />
    
                   </View>
    
                   <View style={{
                       flex:1,
                   
                       height:height,
                       width:width -45,
                       backgroundColor:"#FFF",
                       position:"absolute",
                       top:70,
                       left:25,
                       right:25,
                       borderTopLeftRadius:20,
                       borderTopRightRadius:20
                   }} >
                       <Text style={{
                           textAlign:'center',
                           fontSize:16,
                           fontWeight:"normal",
                           marginBottom:15,
                           marginTop:15
    
                       }} >STATUS & PHASE HISTROY</Text> 
    
                       <View style={{
                           width:width -45,
                           borderBottomWidth:0.4,
                           borderColor:"black"
                       }}  />
                    {
                        this.state.status.length >0 ? (
                            <View style={style.indicatorContainer} >
                                <StepIndicator
                            direction="vertical"
                           customStyles={{
                            stepIndicatorSize: 25,
      currentStepIndicatorSize:30,
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: '#fbbc04',
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: '#fbbc04',
      stepStrokeUnFinishedColor: '#fbbc04',
      separatorFinishedColor: '#fbbc04',
      separatorUnFinishedColor: '#fbbc04',
      stepIndicatorFinishedColor: '#d90e00',
      stepIndicatorUnFinishedColor: '#fbbc04',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 13,
      currentStepIndicatorLabelFontSize: 13,
      stepIndicatorLabelCurrentColor: '#fe7013',
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: '#FFFF',
      labelColor: '#999999',
      labelSize: 13,
      currentStepLabelColor: '#fe7013'
                        
                           }}
                    currentPosition={this.state.currentPosition}
                    labels={labels}
                    stepCount={6}
                    
                    renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                        return(
                             <View style={{
                               marginTop:10,
                      
                               width:width -100
                             }} >
                                 <Text style={{
                                     fontSize:14,
                                     color:"black",
           
                                 }} >{ this.state.status[position].label }</Text>
                                 <Text style={{
                                     fontSize:14,
                                     color:"black",
           
                                 }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                        
                                 </View>
                        )
                    }}
               />
                                </View>
                        ) :(null)
                    }
                   </View>
    
                   
                </View>
    
            )
          }
      else if(this.state.status.length > 4){
        return(
            <View style={{
                flex:1
            }} >
               <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between'
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                       textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:20
                   }} >Job Details</Text>
                   <View style={{
                       height:20,
                       width:50
                   }} />

               </View>

               <View style={{
                   flex:1,
               
                   height:height,
                   width:width -45,
                   backgroundColor:"#FFF",
                   position:"absolute",
                   top:70,
                   left:25,
                   right:25,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20
               }} >
                   <Text style={{
                       textAlign:'center',
                       fontSize:16,
                       fontWeight:"normal",
                       marginBottom:15,
                       marginTop:15

                   }} >STATUS & PHASE HISTROY</Text> 

                   <View style={{
                       width:width -45,
                       borderBottomWidth:0.4,
                       borderColor:"black"
                   }}  />
                {
                    this.state.status.length >0 ? (
                        <View style={style.indicatorContainer} >
                            <StepIndicator
                        direction="vertical"
                       customStyles={{
                        stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fbbc04',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fbbc04',
  stepStrokeUnFinishedColor: '#fbbc04',
  separatorFinishedColor: '#fbbc04',
  separatorUnFinishedColor: '#fbbc04',
  stepIndicatorFinishedColor: '#d90e00',
  stepIndicatorUnFinishedColor: '#fbbc04',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#FFFF',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
                    
                       }}
                currentPosition={this.state.currentPosition}
                labels={labels5}
                
                
                renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                    return(
                         <View style={{
                           marginTop:10,
                  
                           width:width -100
                         }} >
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ this.state.status[position].label }</Text>
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                    
                             </View>
                    )
                }}
           />
                            </View>
                    ) :(null)
                }
               </View>

               
            </View>

        )
      }else if(this.state.status.length > 3){
        return(
            <View style={{
                flex:1
            }} >
               <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between'
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                       textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:20
                   }} >Job Details</Text>
                   <View style={{
                       height:20,
                       width:50
                   }} />

               </View>

               <View style={{
                   flex:1,
               
                   height:height,
                   width:width -45,
                   backgroundColor:"#FFF",
                   position:"absolute",
                   top:70,
                   left:25,
                   right:25,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20
               }} >
                   <Text style={{
                       textAlign:'center',
                       fontSize:16,
                       fontWeight:"normal",
                       marginBottom:15,
                       marginTop:15

                   }} >STATUS & PHASE HISTROY</Text> 

                   <View style={{
                       width:width -45,
                       borderBottomWidth:0.4,
                       borderColor:"black"
                   }}  />
                {
                    this.state.status.length >0 ? (
                        <View style={style.indicatorContainer} >
                            <StepIndicator
                        direction="vertical"
                       customStyles={{
                        stepIndicatorSize: 25,
  currentStepIndicatorSize:30, 
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fbbc04',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fbbc04',
  stepStrokeUnFinishedColor: '#fbbc04',
  separatorFinishedColor: '#fbbc04',
  separatorUnFinishedColor: '#fbbc04',
  stepIndicatorFinishedColor: '#d90e00',
  stepIndicatorUnFinishedColor: '#fbbc04',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#FFFF',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
                    
                       }}
                currentPosition={this.state.currentPosition}
                labels={labels4}
             stepCount={4}
                
                renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                    return(
                         <View style={{
                           marginTop:10,
                  
                           width:width -100
                         }} >
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ this.state.status[position].label }</Text>
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                    
                             </View>
                    )
                }}
           />
                            </View>
                    ) :(null)
                }
               </View>

               
            </View>

        )
      }else if(this.state.status.length > 2){
        return(
            <View style={{
                flex:1
            }} >
               <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between'
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                       textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:20
                   }} >Job Details</Text>
                   <View style={{
                       height:20,
                       width:50
                   }} />

               </View>

               <View style={{
                   flex:1,
               
                   height:height,
                   width:width -45,
                   backgroundColor:"#FFF",
                   position:"absolute",
                   top:70,
                   left:25,
                   right:25,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20
               }} >
                   <Text style={{
                       textAlign:'center',
                       fontSize:16,
                       fontWeight:"normal",
                       marginBottom:15,
                       marginTop:15

                   }} >STATUS & PHASE HISTROY</Text> 

                   <View style={{
                       width:width -45,
                       borderBottomWidth:0.4,
                       borderColor:"black"
                   }}  />
                {
                    this.state.status.length >0 ? (
                        <View style={style.indicatorContainer} >
                            <StepIndicator
                        direction="vertical"
                       customStyles={{
                        stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fbbc04',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fbbc04',
  stepStrokeUnFinishedColor: '#fbbc04',
  separatorFinishedColor: '#fbbc04',
  separatorUnFinishedColor: '#fbbc04',
  stepIndicatorFinishedColor: '#d90e00',
  stepIndicatorUnFinishedColor: '#fbbc04',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#FFFF',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
                    
                       }}
                currentPosition={this.state.currentPosition}
                labels={labels3}
             stepCount={3}
                
                renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                    return(
                         <View style={{
                           marginTop:10,
                  
                           width:width -100
                         }} >
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ this.state.status[position].label }</Text>
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                    
                             </View>
                    )
                }}
           />
                            </View>
                    ) :(null)
                }
               </View>

               
            </View>

        )
      }else if(this.state.status.length > 1){
        return(
            <View style={{
                flex:1
            }} >
               <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between'
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                       textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:20
                   }} >Job Details</Text>
                   <View style={{
                       height:20,
                       width:50
                   }} />

               </View>

               <View style={{
                   flex:1,
               
                   height:height,
                   width:width -45,
                   backgroundColor:"#FFF",
                   position:"absolute",
                   top:70,
                   left:25,
                   right:25,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20
               }} >
                   <Text style={{
                       textAlign:'center',
                       fontSize:16,
                       fontWeight:"normal",
                       marginBottom:15,
                       marginTop:15

                   }} >STATUS & PHASE HISTROY</Text> 

                   <View style={{
                       width:width -45,
                       borderBottomWidth:0.4,
                       borderColor:"black"
                   }}  />
                {
                    this.state.status.length >0 ? (
                        <View style={style.indicatorContainer} >
                            <StepIndicator
                        direction="vertical"
                       customStyles={{
                        stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fbbc04',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fbbc04',
  stepStrokeUnFinishedColor: '#fbbc04',
  separatorFinishedColor: '#fbbc04',
  separatorUnFinishedColor: '#fbbc04',
  stepIndicatorFinishedColor: '#d90e00',
  stepIndicatorUnFinishedColor: '#fbbc04',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#FFFF',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
                    
                       }}
                currentPosition={this.state.currentPosition}
                labels={labels2}
             stepCount={2}
                
                renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                    return(
                         <View style={{
                           marginTop:10,
                  
                           width:width -100
                         }} >
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ this.state.status[position].label }</Text>
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                    
                             </View>
                    )
                }}
           />
                            </View>
                    ) :(null)
                }
               </View>

               
            </View>

        )
      }else if(this.state.status.length == 1){
        return(
            <View style={{
                flex:1
            }} >
               <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between',
                
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                     textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:15
                   }} >Job Details</Text>
                   <View style={{
                       height:40,
                       width:40
                   }} />

               </View>

               <View style={{
                   flex:1,
               
                   height:height,
                   width:width -45,
                   backgroundColor:"#FFF",
                   position:"absolute",
                   top:70,
                   left:25,
                   right:25,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20
               }} >
                   <Text style={{
                       textAlign:'center',
                       fontSize:16,
                       fontWeight:"normal",
                       marginBottom:15,
                       marginTop:15

                   }} >STATUS & PHASE HISTROY</Text> 

                   <View style={{
                       width:width -45,
                       borderBottomWidth:0.4,
                       borderColor:"black"
                   }}  />
                {
                    this.state.status.length >0 ? (
                        <View style={style.indicatorContainer} >
                            <StepIndicator
                        direction="vertical"
                       customStyles={{
                        stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fbbc04',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fbbc04',
  stepStrokeUnFinishedColor: '#fbbc04',
  separatorFinishedColor: '#fbbc04',
  separatorUnFinishedColor: '#fbbc04',
  stepIndicatorFinishedColor: '#d90e00',
  stepIndicatorUnFinishedColor: '#fbbc04',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#FFFF',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
                    
                       }}
                currentPosition={this.state.currentPosition}
                labels={labels1}
             stepCount={2}
                
                renderLabel={({position,stepStatus,label,currentPosition,}) =>{
                    return(
                         <View style={{
                           marginTop:10,
                  
                           width:width -100
                         }} >
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ this.state.status[position].label }</Text>
                             <Text style={{
                                 fontSize:14,
                                 color:"black",
       
                             }} >{ moment(this.state.status[position].dataTime).format("MMMM Do YYYY, h:mm:ss a") }</Text>
                    
                             </View>
                    )
                }}
           />
                            </View>
                    ) :(null)
                }
               </View>

               
            </View>

        )
      }else{
        return(
          <View style={{
              flex:1,
              alignItems:"center"
          }} >
              <View style={{
                   height:170,
                   width:width,
                   backgroundColor:"#62463e",
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   flexDirection:"row",
                   justifyContent:'space-between'
                   
               }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                <Icon name="arrow-back" size={18} style={{
                    margin:20
                }} color="#FFF" />
                   </TouchableOpacity>
                   <Text style={{
                       textAlign:"center",
                       color:"#FFF",
                       fontSize:18,
                       margin:20
                   }} >Job Details</Text>
                   <View style={{
                       height:20,
                       width:50
                   }} />

               </View>

               <View style={{
                   position:"absolute",
                   top:75,
                   left:24,
                   right:24,
                   height:height,
                   width:width -45,
                   borderTopLeftRadius:20,
                   borderTopRightRadius:20,
                   backgroundColor:"#FFF",
                   alignItems:"center",
                   flex:0.6
               }} >
                  <View style={{
                      flex:0.6,
                      justifyContent:"center",
                      alignItems:"center"
                  }} >
                      <Text style={{
                          textAlign:"center",
                          color:'grey',
                          fontSize:16
                      }} >No Status Found</Text>


                  </View>

               </View>

          </View>


        )
      }
    }
}

const style = StyleSheet.create({
    indicatorContainer:{
        height:height-300,
 
        padding:12,
        margin:3,
        paddingTop:0,
        
    }
})
