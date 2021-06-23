import React, { Component } from 'react';

import { StyleSheet, Image,View, Text,TextInput, TouchableOpacity, Dimensions,FlatList, ScrollView  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import {URL, imageUrl} from '../api.js';
import ImageLoad from 'react-native-image-placeholder';
export default class subCategory2 extends Component{

   constructor(props){
       super(props);

       this.state ={
        subCategory2:[],
        refreshig:false
       }
       this.arrayholder=[];
   }

   componentDidMount(){

        this.getSubCategory();
      
   }    

   searchCat=(text)=>{
    const newData = this.arrayholder.filter(item => {
        console.log(item)
        const itemData = item.pattern_no.toLowerCase();
        const textData = text.toLowerCase();
  
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
    subCategory2: newData,
      });
   }
   getSubCategory = () =>{
    let id = this.props.route.params.id;
    
    NetInfo.fetch().then(state =>{
        if(state.isConnected){
            fetch(URL+"/get_customise_catlog_subcategory_details_by_catlog_name",{
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"catlog_master_id=" +id
            
            }).then(response => response.json())
            .then(result =>{
             console.log(result);
                if(result.error == false){
                    this.setState({
                        subCategory2:result.sub_catlog_list,
                        isVisiable: true,
                        refreshing:false
                    })
                    this.arrayholder = result.sub_catlog_list
                }else{
                    this.setState({
                        isVisiable:false
                    })
                }
            }).catch(error =>{
                console.log(error);
                this.setState({
                    refreshing:false
                })
            })
        }else{
            Alert.alert(
                "Network Error",
                "Please check your Internet connection"
            )
        }
    })
}

handleRefresh = ()=>{
    this.setState({
        refreshing:true
    }, () =>{
        this.getSubCategory()
    })
}

  
    render(){
        
        return(
            <View style={{
                flexGrow:1
            }} >
                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                    backgroundColor:'#62463e',
                    borderBottomRightRadius:18,
                    borderBottomLeftRadius:18,
                    flexDirection:"column",
                   
                
                }} >
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" color="#FFF" size={20} style={{
                        margin:18
                    }} />
                </TouchableOpacity>
               
                <Text style={{
                                
                                color:"#FFF",
                                fontSize:18,
                                textAlign:'center',
                                marginTop:20
                            }} >Select Your Pattern</Text>
                <View style={{
                    height:40,
                    width:40
                }} />
                </View>
                <TextInput

placeholder="Search...."
//onEndEditing={()=>this.searchCat(this.state.searchtext)}
onChangeText={text=>this.searchCat(text)}
style={{
    height: 43,
    width: "70%",
    textAlign: "left",
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: "#FFF",
    alignSelf:'center',
    
    color: "black",
    backgroundColor: "#FFF",
    
}}
placeholderTextColor="#000"
/>

                </View>

                <View style={{
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width -45,
                    backgroundColor:'#FFF',
                    position:'absolute',
                    top:120,
                    left:24,
                    right:0,
                    borderTopRightRadius:20,
                    borderTopLeftRadius:20,
                    alignItems:'center'
                }} >
                  
                   {
                       this.state.subCategory2.length > 0 ? (
                        <FlatList 
                        showsVerticalScrollIndicator={false}
                        
                        numColumns={2}
                        contentContainerStyle={{
                            paddingBottom:100
                        }}
         
                        data={this.state.subCategory2}
                        renderItem={(items, index) =>{
                            console.log(items);
                            return(
                               <View style={{
                                   justifyContent:'center',
                                   alignItems:'center',
                                   flexGrow:1
                               }} >
                                   
                                    <View style={{
                               
                               justifyContent:'center',
                               alignItems:'center',
                               margin:8,
                               flex:1,
                               marginTop:10,
                               alignSelf:"center"
                           }} >
                               <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("editImage", {
                                   stocks:items.item.sub_category_img_url,
                                   id:items.item.pattern_no,
                                   cat_id:items.item.id
                                   
                               })} >
                               {/* <Image source={{uri:items.item.sub_category_img_url}} style={{
                                   height:120,
                                   width:124
                                   ,
                                   borderRadius:5
                               }} /> */}
                                <ImageLoad
                                 
    style={{  height:120,
        width:Dimensions.get('screen').width*0.4, marginTop:20 }}
    loadingStyle={{ size: 'large', color: '#62463e' }}
    borderRadius={10}
    source={{ uri: imageUrl+"/"+items.item.sub_category_img_url }}
/>
                               <Text numberOfLines={2} style={{
                                   textAlign:'center',
                                   alignSelf:'center',
                                   fontFamily:'Roboto-Italic',
                                fontSize:11,
                                   marginTop:11,
                                   width:130
                               }} > {items.item.catlog_name} </Text>
                               <Text style={{
                                   marginTop:5,
                                   fontSize:11,
                                   textAlign:"center"
                               }} >{ items.item.pattern_no}</Text>
                              
                               </TouchableOpacity>
                               </View>

                               

                                   </View>
                            )
                        }}

                        keyExtractor={(items) => items.id}
                        refreshing={this.state.refreshig}
                        onRefresh={this.handleRefresh}
                    />
                       ) :(
                           <View style={{
                               justifyContent:"center",
                               alignItems:'center',
                               flex:0.4
                           }} >
                           <Text style={{
                               textAlign:'center',
                               color:"grey"
                           }} >No Data Found</Text>
                           </View>
                       )
                   }

<View style={{
    height:50
}} />

                </View>
               
            </View>
        )
    }
}