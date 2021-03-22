import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Dimensions , Image, ScrollView, Alert, ImageComponent, ActivityIndicator}  from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import {URL, imageUrl} from '../api.js';

export default class StockEnqueryDetails extends Component{
    constructor(props){
        super(props);

        this.state = {
            stockDetails:{},
            Carousel:[],
            selectIndex:0
        }
    }

    componentDidMount(){
        this.getStockDetails();
    }

    getStockDetails = ()=>{
        NetInfo.fetch().then(state =>{
            if(state.isConnected){
                fetch(URL+"/get_stock_catlog_by_id", {
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    method:"POST",
                    body:"id=" +this.props.route.params.id
                }).then(response => response.json())
                .then(result =>{
                    var imageObj = {};
                    var carousel = [];

                
          
                    if(result){
                        this.setState({
                            stockDetails:result,
                            Carousel:result.image_urls
                        });
                    };
                  
                    // carousel.forEach(value =>{
                    //     console.log(value.name1);
                    // })
                }).catch(error =>{
                    console.log(error);
                })
            }else{
                Alert.alert(
                    "Network Error",
                    "Please check Your Internet connection"
                )
            }
        })
    }
    setSelectIndex = event =>{
        // get  width of the view size 
        const viewWidth = event.nativeEvent.layoutMeasurement.width;
        
        // get current position of the scroll view
        const contentOffset = event.nativeEvent.contentOffset.x;
    
        const selecttedIndex = Math.round(contentOffset / viewWidth);
      

        this.setState({
            selectIndex:selecttedIndex
        });
    }

    render(){
        console.log(this.state.stockDetails);
        return (
            <View style={{
                flex:1,
        
            }} >

            <View style={{
                flex:1
            }} >

                <View style={{
                    height:170,
                    width:Dimensions.get("screen").width,
                    borderBottomLeftRadius:18,
                    borderBottomRightRadius:18,
                    backgroundColor:"#62463e",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    
           
                }} >
                   <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
                   <Icon  name="arrow-back" size={18} color="#FFFF" style={{
                        margin:20
                    }} />
                   </TouchableOpacity>

                    <Text style={{
                        textAlign:'center',
                        color:"#FFF",
                        fontSize:18,
                        margin:20
                    }}> Stock Details </Text>
                    <View style={{
                        height:50,
                        width:50,
                        borderRadius:25,
                        marginTop:10
                    }} >
                    
                        
                    </View>
                    
                </View>

                <View style={{
                    position:'absolute',
                    top:70,
                    left:24,
                    right:24,
                    height:Dimensions.get("screen").height,
                    width:Dimensions.get("screen").width -45,
                    backgroundColor:'#FFF',
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    flex:1,
                    justifyContent:"center",
                    zIndex:0
                    
                    
            
                }} >
                
                {
                    this.state.stockDetails.pattern_no != null || this.state.stockDetails.latest_qty != null || this.state.stockDetails.catlog_name ||

                this.state.stockDetails.paper_type_name != null || this.state.stockDetails.roll_size != null || this.state.stockDetails.total_sq_ft != null 

                || this.state.stockDetails.color != null
                     ? ( 
                         <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{
                   paddingBottom:160
               }}
                 >
                   <View >
                     {
                         this.state.Carousel.length > 1 ? (
                            <ScrollView
                            showsHorizontalScrollIndicator={false}
                               horizontal={true}
                               pagingEnabled
                              
                
                               onMomentumScrollEnd={this.setSelectIndex}
                            >
                                {
                                    this.state.Carousel.map(value =>{
                                        return(
                                          <View style={{
                                            
                                              borderTopLeftRadius:20,
                                              borderTopRightRadius:20,
                                            
                                              zIndex:0,
                                            
                                          }} >
                                               <Image style={{
                                               height:250,
                                               width:Dimensions.get("window").width -45,
                                               borderRadius:6,
                                               borderTopLeftRadius:20,
                                               borderTopRightRadius:20,
                                               marginTop:0,
                                               elevation:10,
                                              
                                               zIndex:1,
                                           
                                               padding:50
                                   
                                          
                                           }} source={{uri:value}}  />

                                          </View>
                                        )
                                    })
                                }
       
                            </ScrollView>
                         ) :(
                             null
                         )
                     }
                     <View style={{
                           position:'absolute',
                           height:10,
                           bottom:15,
                           top:220,
                           left:0,
                           right:0,
                           display:'flex',
                       flexDirection:"row",
                       justifyContent:'center',
                       alignItems:'center'
                     }} >
                         {
                             this.state.Carousel.map((value, index) =>{
                                
                                 return(
                                     <View key={index} style={[{
                                         height:8,
                                         width:8,
                                         borderRadius:4,
                                         backgroundColor:"black",
                                         margin:5
                                     },{ opacity: index === this.state.selectIndex ? 1 : 0.3 }]} >

                                         </View>
                                 )
                             })
                         }

                     </View>
{/* <ImageLoad
                                 
                                 style={{   height:200,
                                    width:280,
                                    marginTop:20}}
                                 loadingStyle={{ size: 'large', color: '#62463e' }}
                                 borderRadius={10}
                                 source={{ uri: imageUrl+"/"+this.state.stockDetails.image_url }}
                             /> */}
       

             
                   <View style={{
                       flex:1,
                       justifyContent:"flex-start",
                       flexDirection:"column"
                   }} > 
                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Pattern Number</Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                           paddingLeft:35
                       }} >{this.state.stockDetails.pattern_no}</Text>

                   </View>


                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Quantity
                       </Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                           paddingLeft:100
                       }} >1</Text>

                   </View>


                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Catlog Name</Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                           paddingLeft:50
                       }} >{ this.state.stockDetails.catalog_name}</Text>

                   </View>

                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Paper Type</Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                           paddingLeft:54
                           
                       }} >{ this.state.stockDetails.paper_type_name}</Text>

                   </View>

                      <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Roll Size</Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                           paddingLeft:62
                       }} >{ this.state.stockDetails.roll_size}</Text>

                   </View>

                   
                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16,
                           paddingRight:12
                       }} >Total Sq. Ft</Text>

                       <Text style={{
                           textAlign:"left",
                           fontSize:16,
                           color:"grey",
                       paddingLeft:50
                       }} >{ this.state.stockDetails.total_sq_ft}</Text>

                   </View>

                   <View style={{
                       flexDirection:"row",
                       padding:22,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:16
                       }} >Color</Text>

                       <Text style={{
                           
                           fontSize:16,
                           color:"grey",
                       
                           width:212,
                           textAlign:"center",
                           paddingLeft:45
                       }} >{ this.state.stockDetails.color}</Text>

                   </View>

                   <View style={{
                       flexDirection:"row",
                       padding:20,
                       borderBottomColor:"#eeee",
                       borderBottomWidth:0.6
                   }} >
                       <Text style={{
                           textAlign:"right",
                           fontSize:18
                       }} >Status</Text>

{
                         this.state.stockDetails.stock_status == "Continued" ? (
                             <View style={{
                                flexDirection:"row",
                                fontSize:14,
                                fontWeight:"normal",
                         
                               textAlign:"center",
                                color:"grey",
                          
                                width:200,
                                paddingLeft:80
                             }} >



                    <View style={{
                        height:10,
                        width:10,
                        borderRadius:5,
                        backgroundColor:"green",
                        marginTop:7,
                        
                    }}  />

                    <Text style={{
                         textAlign:'center',
                         fontSize:13,
                         fontWeight:"normal",
                     
                       marginTop:4,
                         color:"black",
                         paddingRight:14
                        
                    }} > { this.state.stockDetails.stock_status }</Text> 
                                 </View>
                         ):(
                            <View style={{
                                flexDirection:"row",
                                marginLeft:120,
                                marginTop:6
                             }} >



                    <View style={{
                        height:10,
                        width:10,
                        borderRadius:5,
                        backgroundColor:"red",
                        marginTop:12
                    }}  />

                    <Text style={{
                         textAlign:'center',
                         fontSize:13,
                         fontWeight:"normal",
                     
                       marginTop:9,
                         color:"black"
                        
                    }} >Not Available</Text> 
                                 </View>
                         )
                     }

                   </View>
                   

                   </View>
               </View>

            

                  

               </ScrollView>
                    ) :(

                    <View style={{
                        flex:0.5,
                        alignItems:"center",
                       
                    }} >
                    <ActivityIndicator size="large" color="#62463e" />

                    </View>
                )
                }
              
                </View>

            </View>
            </View>
        )
    }
}