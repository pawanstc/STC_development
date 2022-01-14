import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, FlatList, TextInput, ScrollView, Alert, Share, ActivityIndicator, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageBlurLoading from 'react-native-image-blur-loading'
import Modal from 'react-native-modal';

import NetInfo from "@react-native-community/netinfo";
import { URL, imageUrl } from '../api.js';
import ImageLoad from 'react-native-image-placeholder';
import { downloadFile, showToastMessage } from './helper/utility.js';
let {height,width} = Dimensions.get('screen')
export default class ProductImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            image_loader: false,
            subCateLog: [],
            isvisible: false,
            id: "",
            image: "",
            stocks: {
                "id": "1",
                "image": [
                    {
                        "image": "https://media5.picsearch.com/is?qCHvNXSKG4GSKGWziCpZ3NvZKrp5GxG6oqQfYOPhGzU&height=255",
                        "text": "image1"
                    },
                    {
                        "image": "https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                        "text": "image2"
                    },
                    {
                        "image": "https://www.stcwallpaper.com/admin/upload/original/1579589811_3ceee580b34b478b3bf9673908a786f4.jpeg",
                        "text": "image3"
                    }
                ],
                "name": "Panache"
            },
            refreshing: false,
            modelOfPattern: "",
            data_loader: false,
            pattern_no:"",
            query: '',
            fullData:[],
            searchtext:'',
            isLoading: false
        }
        this.arrayholder =[];
    }
    

    uploadModel = (data, id, pattern_id) => {
        console.log("pattern number is"+pattern_id);
        this.setState({
            image: data,
            isvisible: true,
            id: id,
            modelOfPattern: id,
            pattern_no:pattern_id
        })
    }

    componentDidMount() {

        if(width>height){
            let temp = width;
            width= height;
            height=temp;
           
            
        }
        this.getSubCatelog();
    }

    onPressDownloadBrochure = () => {
        if (this.props.route.params.catalogue_pdf && this.props.route.params.catalogue_pdf !== "0") {
            this.setState({ isLoading: true });
            downloadFile(imageUrl+this.props.route.params.catalogue_pdf);
            setTimeout(() => {
                this.setState({ isLoading: false });
                Alert.alert('File download successfully.')
            }, 5000)
        } else {
            showToastMessage('Brochure not available.')
        }
    }

    getSubCatelog = () => {
        let id = this.props.route.params.id;
        let cat_name = this.props.route.params.cat_name;

        
        let api = '/get_catlog_subcategory_details_by_catlog_master_id';
        
        if (cat_name === 'Customize') {
            api = '/get_customise_catlog_subcategory_details_by_catlog_name';
        }

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                fetch(URL + api, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: "catlog_master_id=" + id
                }).then(response => response.json())
                    .then(result => {
                        if (result.error === false) {
                            this.setState({
                                subCateLog: result.sub_catlog_list,
                                refreshing: false,
                                fullData:result.sub_catlog_list
                            });
                            this.arrayholder = result.sub_catlog_list
                            this.props.navigation.navigate("products", {
                                sub_catelogs: this.state.sub_catelog
                                
                            })
                        } else {
                            this.setState({
                                subCateLog: []
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                        this.setState({
                            refreshing: false
                        })
                    });
            } else {
                Alert.alert(
                    "Network Error",
                    "Please chreck Your Internetconnection"
                )
            }
        })
    }

    handleRefreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.getSubCatelog();
        })
    }
    searchCat=(text)=>{
        
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.pattern_no.toUpperCase()}`;
            const textData = text.toUpperCase();
      
            return itemData.indexOf(textData) > -1;
          });
          this.setState({
            subCateLog: newData,
          });
        }
        
        
    
    contains = ({ data }, query) => {
        const {pattern_no}=data 
        if (pattern_no.includes(query)) {
          return true
        }
        return false
      }


    render() {
   


        return (
            <View style={{
                flexGrow: 1,
                alignItems: 'center',
                height: height

            }} >
                <StatusBar barStyle="light-content" backgroundColor="#62463e" />
                <View style={{
                    height: 170,
                    width: width,
                    backgroundColor: '#62463e',
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                    flexDirection: "row",
                    justifyContent: 'space-between'
                }} >

                    <TouchableOpacity activeOpacity={0.95} onPress={() => this.props.navigation.goBack(null)} >
                        <Icon name="arrow-back" style={{
                            marginVertical: 23,
                            marginLeft: 23,
                            marginRight: 10
                        }} color="#FFF" size={20} />
                    </TouchableOpacity>
                    <TextInput

                        placeholder="Search...."
                        //onEndEditing={()=>this.searchCat(this.state.searchtext)}
                        onChangeText={text=>this.searchCat(text)}
                        style={{
                            height: 43,
                            width: "60%",
                            textAlign: "left",
                            borderRadius: 10,
                            borderWidth: 0.3,
                            borderColor: "#FFF",
                            marginTop: 15,
                            paddingLeft: 20,
                            color: "black",
                            backgroundColor: "#FFF",
                            marginRight: 10
                        }}
                        placeholderTextColor="#000"
                    />

                    <View
                    style={{ 
                        marginRight: 5, 
                        marginTop: 15, 
                        backgroundColor: 'white', 
                        height: 42, 
                        width: 42, 
                        borderRadius: 21,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} >
                        {this.state.isLoading ? (
                            <ActivityIndicator size={20} color="#62463e" />
                        ) : (
                            <TouchableOpacity activeOpacity={0.95} onPress={() => this.onPressDownloadBrochure()}>
                                <Image source={require("../assets/images/downloadIcon.png")} style={{
                                    height:36,
                                    width:36,
                                    borderRadius: 12,
                                }}/>
                            </TouchableOpacity>
                        )}
                    </View>

                       <TouchableOpacity onPress={null}>
                    <Icon style={{
                        position: "absolute",
                        top: 27,
                        right: 0,
                        left: 100
                    }} name="search-outline" color="black" size={18} />
                    <View style={{
                        width: 10,
                        height: 50
                    }} />
                    </TouchableOpacity> 
                  


                </View>
                

                <View style={{
                    position: 'absolute',
                    top: 70,
                    width: width - 45,
                    height: height,
                    backgroundColor: 'red',
                    left: 24,
                    right: 0,
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    backgroundColor: '#FFF',
                    justifyContent: "center",
                    alignItems: "center"

                }} >



                    {
                        this.state.subCateLog.length > 0 ? (
                            <>
                                <FlatList

                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefreshing}
                                    
                                    contentContainerStyle={{
                                        paddingBottom: 90
                                    }}

                                    data={this.state.subCateLog}
                                    renderItem={(items, index) => {
                                        
                                        return (
                                            <View style={{
                                                margin: 6,
                                                marginTop: 5,

                                                alignItems: 'center',
                                                justifyContent: "center",
                                                marginBottom: 25,



                                            }} >

                                                <View style={{
                                                    flex: 1,
                                                    alignSelf: "flex-start",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }} >
                                                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.uploadModel(items.item.sub_category_img_url, items.item.catlog_sub_category_name, items.item.pattern_no)} >
                                                        {/* <Image progressiveRenderingEnabled={true} resizeMode='cover' source={{uri:items.item.sub_category_img_url}} style={{
                                    height:120,
                                    width:130,
                                    borderRadius:5
                                
                                }} /> */}

                                                        <ImageLoad
                                                            borderRadius={10}

                                                            style={{
                                                                height: 120,
                                                                width:width*0.35,
                                                                borderRadius: 5
                                                            }}
                                                            loadingStyle={{ size: 'large', color: '#62463e' }}
                                                            source={{ uri: imageUrl + "" + items.item.sub_category_img_url }}
                                                        />
                                                    </TouchableOpacity>
                                                    {this.props.route.params.cat_name === 'Customize' ? 
                                                        <Image source={require("../assets/images/Brandname2.png")} style={{
                                                            height: 30,
                                                            width: 30,
                                                            position: 'absolute',
                                                            top: 1,
                                                            left: 4,
                                                            right: 0
                                                        }} />
                                                    : null}
                                                    <View style={{

                                                        marginTop: 15
                                                    }} >
                                                        <Text numberOfLines={2} style={{
                                                            fontSize: 12,
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            width: "100%",
                                                            paddingBottom: 20


                                                        }} >{items.item.pattern_no}  </Text>


                                                    </View>


                                                    <View style={{
                                                        height: 20
                                                    }} />


                                                </View>
                                            </View>
                                        )
                                    }}

                                    keyExtractor={(items) => items.id}
                                />
                            </>
                        ) : (
                            <>
                                <View style={{
                                    flex: 0.3
                                }} >
                                    <Text style={{
                                        textAlign: "center",
                                        fontSize: 16,

                                    }} >No Data Found</Text>
                                </View>

                            </>
                        )
                    }

                    <View />

                    <Modal coverScreen={true} style={{
                        height: 20,

                        backgroundColor: "#FFF"
                    }} isVisible={this.state.isvisible}>
                        <View style={{
                            justifyContent: "center",
                            flex: 2

                        }}>
                            <TouchableOpacity onPress={() => this.setState({
                                isvisible: false
                            })} style={{
                                left: 280,
                                position: "absolute",
                                top: 20
                            }} >
                                <Icon name="close" size={25} color="black" style={{

                                    marginTop: 20
                                }} />
                            </TouchableOpacity>

                            <Text style={{
                                textAlign: "center",
                                marginTop: 18,
                                fontSize: 18,
                                fontWeight: "bold"
                            }} > {this.state.modelOfPattern}</Text>

                            <View style={{
                                alignItems: "center"
                            }} >
                                {/* {
          this.state.image_loader == false ? (
              <>
               <Image 
       
       source={{uri:imageUrl+"/"+this.state.image}} style={{
       height:280,
       width :280,
       marginTop:20,
       marginBottom:15
     
   }}  />
              </>
          ) :(
              <>
               <Image 
        onLoad={(event) => this.setState({
            image_loader:true
        })}
        onLoadEnd={(e) => this.setState({
            image_loader:false
        })}
       source={{uri:imageUrl+"/"+this.state.image}} style={{
       height:280,
       width :280,
       marginTop:20,
       marginBottom:15
     
   }}  />
        <ActivityIndicator size={20} />
              </>
          )
      } */}

<TouchableOpacity  onPress={()=>this.props.navigation.navigate('preview',{uri:imageUrl + "/" + this.state.image,order_id:0})}>
                                <ImageLoad
                                    isShowActivity={true}
                                    style={{
                                        height: 280,
                                        width: 280,
                                        marginTop: 20,
                                        marginBottom: 15

                                    }}
                                    loadingStyle={{ size: 'large', color: '#62463e' }}
                                    borderRadius={6}
                                    source={{ uri: imageUrl + "/" + this.state.image }}
                                />
                               </TouchableOpacity>

                            </View>



                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }} >

                                <View>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            isvisible: false
                                        });

                                        Share.share(
                                            {
                                                message: imageUrl + "/" + this.state.image,

                                            }
                                        ).then(result => {
                                            console.log(result);
                                        }).catch(error => {
                                            console.log(error);
                                        });
                                    }}  >
                                        <Icon name="share" size={30} color="black" style={{
                                            padding: 8,
                                            paddingLeft:8,
                                            marginLeft:15
                                        }} />

                                        <Text style={{
                                            fontSize: 14,
                                            color: "black",
                                            padding: 8,
                                            marginLeft:8
                                        }} >Share</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            isvisible: false
                                        });

                                        setTimeout(() => {
                                            this.props.navigation.navigate("customWp", {
                                                image: imageUrl + "" + this.state.image,

                                                image_id: this.state.id,

                                                flag: "1",
                                                image_id:this.state.pattern_no
                                                
                                            })
                                        }, 1000)
                                    }} >
                                        <Icon name="add-outline" size={30} color="black" style={{
                                            padding: 10,
                                            paddingLeft: 12
                                        }} />

                                        <Text style={{
                                            fontSize: 14,
                                            color: "black",
                                            padding: 0,
                                            marginRight: 20
                                        }} >Post Job</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>
                        </View>
                    </Modal>


                </View>
            </View>
        )
    }
}