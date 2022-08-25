import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Alert,ActivityIndicator, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
import Trail from './Trail.js';

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
                  console.log('get_order_status_by_order_id-------------', result, this.props.route.params.order_id);
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
    render() {
        return (
            <View style={{flex:1}} >
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
                        <Icon name="arrow-back" size={18} style={{margin:20}} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={{textAlign:"center", color:"#FFF", fontSize:18, margin:20}}>Job Details</Text>
                    <View style={{height:20, width:50}} />
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
                }}>
                    <Text style={{
                        textAlign:'center',
                        fontSize:16,
                        fontWeight:"normal",
                        marginBottom:15,
                        marginTop:15
                    }}>STATUS & PHASE HISTROY</Text>
                    <View style={{ width:width -45, borderBottomWidth:0.4, borderColor:"black"}} /> 
                    <View style={{flex: 1, marginBottom: 150}}>
                        <Trail statusList={this.state.status} />
                    </View>
                </View>
            </View>
        )      
    }
}

const style = StyleSheet.create({
    indicatorContainer:{
        minHeight:height-300,
 
        padding:12,
        margin:3,
        paddingTop:0,
        
    }
})
