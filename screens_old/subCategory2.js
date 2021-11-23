import React, { Component } from 'react';

import { StyleSheet, View , Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import NetInfo from "@react-native-community/netinfo";
import {URL} from '../api.js';
export default class SubCategory extends Component {

    constructor(props){
        super(props);

        this.state = {
            subCategory2:[],
            isVisiable:false
        }
    }

    componentDidMount(){
       
        this.getSubCategory();
    }

    getSubCategory = () =>{
        let id = this.props.route.params.id;
        
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_sub_catlog_details_by_catlog_master_id",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    method:"POST",
                    body:"catlog_master_id=" +id
                
                }).then(response => response.json())
                .then(result =>{
                    
                    if(result.error == false){
                        this.setState({
                            subCategory2:result.sub_catlog_list,
                            isVisiable: true
                        })
                    }else{
                        this.setState({
                            isVisiable:false
                        })
                    }
                }).catch(error =>{
                    console.log(error);
                })
            }else{
                Alert.alert(
                    "Network Error",
                    "Please check your Internet connection"
                )
            }
        })
    }

    
    render(){
        return(
            <View style={{
                flex:1,
               
            }} >
               <View style={{
                   width:Dimensions.get("screen").width,
                   height:175,
                   borderBottomLeftRadius:20,
                   borderBottomRightRadius:20,
                   backgroundColor:"#62463e",
                   flexDirection:"row",
                   justifyContent:"space-between",
                   
               }} >
                   <Icon name="arrow-back" onPress={() => {
                       this.props.navigation.goBack(null)
                   }} style={{
                       margin: 20,
                  
                   }}  color="#FFF" size={18} />
                   <Text style={{
                       textAlign:'center',
                       fontSize:18,
                       marginTop:20,
                       color:"#FFF"

                   }} >Select Your Pattern</Text>
                   <View style={{
                       height:70,
                        width:50
                   }}  />

               </View>

               <View style={{
                   height:Dimensions.get("screen").height +100,
                   width:Dimensions.get("screen").width -45,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:"#FFF",
                    position:"absolute",
                    top:75,
                    left:25,
                    right:25,
                    justifyContent:"center",
                    alignItems:'center',
                    flex:1
               }} >

                   <FlatList
              numColumns={2}
                   style={{
                       height:Dimensions.get("screen").height,
                       marginBottom:200,
                       width:Dimensions.get("screen").width -45
                   }}
                    data={this.state.subCategory2}
                    showsVerticalScrollIndicator={false}
                    renderItem={(items, index) =>{
                       
                        return(
                            <View style={{
                               alignItems:'center',
                                margin:20,
                                flex:1,
                                justifyContent:"center"
                            }} >
                               <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.replace("stockEnquery",{
                                   value:items.item
                               })} >
                               <Image source={{uri:items.item.sub_category_img_url}} style={{
                                    height:120,
                                    width:120
                                }}  />
                                <Text style={{
                                    textAlign:"center",
                                    fontSize:18,
                                    color:"grey",
                                    marginTop:10
                                }} >{items.item.catlog_sub_category_name}</Text>
                                <Text style={{
                                    textAlign:"center",
                                    fontSize:18,
                                    color:"grey",
                                    marginTop:10
                                }} >{items.item.id}</Text>
                               </TouchableOpacity>
                                </View>
                        )
                    }}

                    keyExtractor={(item) => item.id}
                   />
 
               </View>

            </View>
        )
    }
}