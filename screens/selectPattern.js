import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, Image, FlatList, Text, Dimensions, ImageBackground } from 'react-native';
import Icon from  'react-native-vector-icons/Ionicons';
let {height,width} = Dimensions.get('screen')
export default class SelectPatterns extends Component{

constructor(props){
    super(props);

    this.state = {
        cateLogImage:[
            {
                "id":"1",
                "image":[
                    {
                        "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    },
                    {
                        "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    },
                    {
                        "image":"https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                    }
                ],
                "name":"Panache",
                "patterns":"123456"
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
               "patterns":"123456"
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
                "patterns":"123456"
               
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
                "patterns":"123456"
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
                "patterns":"123456"
            },
            
        ],
    }
}

componentDidMount(){
    if(width>height){
        let temp = width;
        width= height;
        height=temp;
       
        
    }
}
    render(){
        return(
            <View style={{
                flex:1,
                alignItems:'center'
            }} >
                <View style={{
                    height:170,
                    width:width,
                    backgroundColor:'#62463e',
                    borderBottomLeftRadius:18,
                    borderBottomRightRadius:18,
                    flexDirection:"row",
                    
                }} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                    <Icon name="arrow-back" style={{
                        margin:20
                    }}  color="#FFF" size={18} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize:18,
                        color:"#FFF",
                        margin:20
                    }} >
                        Select Patterns
                    </Text>

                </View>

                <View style={{
                    position:"absolute",
                    top:70,
                    left:24,
                    right:0,
                    width:width -45,
                    backgroundColor:"#FFF",
                    height:height,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    justifyContent:"center"
                    
                }} >
                    <Text style={{
                        textAlign:'center',
                        fontSize:20,
                        fontFamily:'Roboto-Bold',
                        marginTop:16
                    }} >Selecet Your Patterns</Text>

                    <View style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems:"center",
                        marginTop:34
                    }} >
                        <FlatList 
                        showsVerticalScrollIndicator={false}
                        data={this.state.cateLogImage}
                        numColumns={2}

                        renderItem={(items, index) =>{
                    
                            return(
                                <View style={{
                                   justifyContent:"center",
                                   alignItems:'center'
                                }} >
                               <TouchableOpacity onPress={() => this.props.navigation.replace("stockEnquery", {
                                   value:items.item
                               })} >
                               <ImageBackground 
                                    source={{uri:items.item.image[0].image}}
                                    style={{
                                        height:100,
                                        width:100,
                                        margin:10,
                                        backgroundColor:'rgba(0,0,0,.6)',
                                        borderRadius:15
                                    }}
                                >
                                    <View style={{backgroundColor:'rgba(0,0,0,.5)',
                 height:100,width:100, justifyContent:'center', alignItems:'center', borderRadius:15}} >

                     <Text style={{
                         textAlign:"center",
                         fontFamily:'Roboto-Bold',
                         color:"#FFF",
                         fontSize:20
                     }} >{items.item.name}</Text>

                                    </View>

                                </ImageBackground>
                               </TouchableOpacity>
                                    </View>
                            )
                        }}
                        keyExtractor={(item) => item.id}

                    />
                    </View>

                </View>
            </View>
        )
    }
}