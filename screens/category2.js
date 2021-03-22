import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
import { ScrollView } from 'react-native-gesture-handler';

export default class Category2 extends Component{

 constructor(props){
     super(props)

     this.state = {
        cateLogImage:[
            {
                "id":"1",
                "image":[
                    {
                        "image":"https://media5.picsearch.com/is?qCHvNXSKG4GSKGWziCpZ3NvZKrp5GxG6oqQfYOPhGzU&height=255",
                    },
                    {
                        "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    },
                    {
                        "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    }
                ],
                "name":"Panache",
                "patterns":"123455"
            },
            {
                "id":"2",
               "image":[
                   {
                       "image":"https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/03/2020-interior-design-trends-feature.jpg"
                   },
                   {
                    "image":"https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/03/2020-interior-design-trends-feature.jpg"
                },
                {
                    "image":"https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/03/2020-interior-design-trends-feature.jpg"
                }
               ],
               "name":"Hexagon",
               "patterns":"123455"
            },
            {
                "id":"3",
                "image":[
                    {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                    {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                    {
                        "image":"https://images.adsttc.com/media/images/5f2c/8545/b357/65db/c000/008c/large_jpg/FEAT_ID.jpg?1596753213"
                    },
                ],
                "name":"Asahfoard",
                "patterns":"123455"
               
            },
            {
                "id":"4",
                "image":[
                    {
                        "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                    },
                    {
                        "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                    },
                    {
                        "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkaNzDtaS-YvNVH5qi61JDVA0VgQiaSer90Q&usqp=CAU"
                    }
                ],
                "name":"Vermeil",
                "patterns":"123455"
            },
            {
                "id":"5",
                "image":[
                    {
                        "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                    },
                    {
                        "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                    },
                    {
                        "image":"https://www.thespruce.com/thmb/psh2haBAUlmntkQ3VLxDyehi5lo=/2119x1414/filters:fill(auto,1)/GettyImages-1161177015-f1de4ba58a6c4f50969d9119d80405a6.jpg"
                    }
                ],
                "name":"Vermeil",
                "patterns":"123455"
            },
            
        ],
        isVisiable:false
     }
 }

 componentDidMount() {

     setTimeout(() =>{
         this.setState({
             isVisiable:true
         });
     },2200);
 }
    render(){
        return(
            <View style={{
                flex:1,
               
            }} >
                <View style={{
                    height:170,
                    width: Dimensions.get("screen").width,
                    backgroundColor:'#62463e',
                    borderBottomLeftRadius:18,
                    borderBottomRightRadius:18,
                    flexDirection:'row',
                    justifyContent:"space-between"
                }} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" style={{
                        margin:20
                    }}  size={18} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={{
                        color:"#FFF",
                        fontSize:18,
                        margin:20
                    }} >Select Patterns</Text>

                    <View style={{
                        height:40,
                        width:50
                    }} />

                </View>

                <View style={{
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width - 45,
                    backgroundColor:'#FFF',
                    top:70,
                    left:24,
                    right:0,
                    position:'absolute',
                    borderTopRightRadius:20,
                    borderTopLeftRadius:20
                }} >
                   <ScrollView 
                    showsVerticalScrollIndicator={false}
                   style={{
                       marginBottom:120
                      
                   }} >
                        <Text style={{
                        fontFamily:'Roboto-Bold',
                        fontSize:18,
                        margin:20,
                        textAlign:'center'
                    }} >
                        Select Your Wallpaper
                    </Text>
                    <View style={{
                        flex:1,
 
                        alignItems:'center', 
                        justifyContent:"center"
                    }} >
                        {/* <FlatList 
                        
                            showsVerticalScrollIndicator={false}
                        /> */}
                        {
                            this.state.isVisiable ? (
                                 <FlatList 
                        data={this.state.cateLogImage}
                        
           
                        
                            showsVerticalScrollIndicator={false}
                            renderItem={(items, index) => {
                                console.log(items.item.image[0])
                                return(
                                   <View  >
                                      <TouchableOpacity onPress={() => this.props.navigation.replace("subCat2", {
                                          value:items.item
                                      })} >
                                      <Image source={{uri:items.item.image[0].image}}
                                        style={{
                                            height:130,
                                            width:120,
                                            margin:10,
                                            marginTop:30
                                        }}
                                    />
                                    <Text style={{
                                        textAlign:"center",
                                        fontSize:14,
                                        fontFamily:'Roboto-Italic',
                                        color:"grey"
                                    }} >
                                        {items.item.name}
                                    </Text>
                                      </TouchableOpacity>
                                       </View>
                                )
                            } }
                            keyExtractor={(items) => items.id}
                            numColumns={2}
                        /> 
                            ) :(
                                <View style={{
                                    flex:1,
                                    marginBottom:300
                                }} >
                                    <BallIndicator color='#62463e'
                        size={30} />
                                    </View>
                            )
                        }

                    </View>

                   </ScrollView>

                </View>
            </View>
        )
    }
}