/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';


import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import {URL, imageUrl} from '../api.js';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {NetworkInfo} from 'react-native-network-info';
import { ThemeProvider } from 'styled-components';
let {height,width} = Dimensions.get('screen')
export default class Messaging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: [],
      user_id: '',
      refresh: false,
      sendMessage: [],
      ip_address: '',
      flowDirection: this.props.route.params.flowDirection,
    };
  }

  componentDidMount() {
    if(width>height){
      let temp = width;
      width= height;
      height=temp;
    }
    
    this.getUserType();
    this.getMessage();
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      this.setState({
        ip_address: ipv4Address,
      });
    });
  }

  getUserType=()=>{
    console.log(this.state.user_id)
  }

  getMessage = () => {
    AsyncStorage.getItem('user_id').then((result) => {
      this.setState({
        user_id: result,
      })

      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          let api = 'get_message_list_by_order_id_mobile';
          let body = 'order_id='+this.props.route.params.order_id;
          if (this.state.flowDirection === 'previewImage') {
            api = 'get_all_preview_remarks_by_order_id';
            body = 'post_job_approved_image_id='+this.props.route.params.preview_image_id;
          }
          fetch(URL+'/'+api, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: body,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.error == false) {
                let messageList = result.message_list;
                if (this.state.flowDirection === 'previewImage') {
                  messageList = result.remarks_details && 
                                result.remarks_details
                                .map(item => {
                                  return {
                                    _id: item.id,
                                    createdAt: item.created_date_time,
                                    text: item.message,
                                    user: {
                                      _id: item.user_id,
                                      name: item.username
                                    }
                                  }
                                })

                }

                console.log('messageLIst-=================>', messageList);
              this.setState({
                  message: messageList && messageList.reverse() || [],
                  refresh: false,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
        }
      });
    });
  };

  onSend = (messages) => {
    GiftedChat.append(messages,messages)
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        let api = 'insert_message_order_wise';
        let body = 'user_id=' +
                    this.state.user_id +
                    '&order_id=' +
                    this.props.route.params.order_id +
                    '&message=' +
                    messages[0].text +
                    '&created_by_ip=' +
                    this.state.ip_address;
        if (this.state.flowDirection === 'previewImage') {
          api = 'send_preview_remarks_by_id';
          body = 'post_job_order_id='+
                  this.props.route.params.order_id+
                  '&post_job_approved_image_id='+
                  this.props.route.params.preview_image_id+
                  '&user_id='+
                  this.state.user_id+
                  '&message=' +
                  messages[0].text
        }
        fetch(
          URL+'/'+api,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded', 
            },
            method: 'POST',
            body: body,
              // 'user_id=' +
              // this.state.user_id +
              // '&order_id=' +
              // this.props.route.params.order_id +
              // '&message=' +
              // messages[0].text +
              // '&created_by_ip=' +
              // this.state.ip_address,
          },
        )
          .then((response) => {
            this.getMessage()
            response.text()
          })
          .then((result) => {
            if (result.error == false) {
              this.getMessage();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
      }
    });
  };

  hadleRefreshing = () => {
    this.setState(
      {
        refresh: true,
      },
      () => {
        this.getMessage();
      },
    );
  };

  renderBubble = (props) =>{
    return (
      <Bubble 
        {...props}
        wrapperStyle={{
            left:{
              backgroundColor:'#FFC98F'
            },
            right:{
                backgroundColor:"#62463e"
            }
        }}           
      />
    )
  }


  renderSend = (props) =>{
    return(
        <Send {...props} >
          <View>
            <Icon name="send" color="#62463e" style={{
              marginBottom:5,
              marginRight:5
              }} 
              size={25} />
          </View>
        </Send>
    )
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#62463e" barStyle="light-content" />
        <View
          style={{
            height: 170,
            width: width,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor: '#62463e',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
            <Icon name="arrow-back" color="#FFF" size={18} style={{ margin:20 }} />
          </TouchableOpacity>

          <Text style={{ textAlign:"center", color:"#FFF", fontSize: 18, margin:20 }} > 
            {`${this.state.flowDirection === 'previewImage' ? 'Preview Image ID: '+this.props.route.params.preview_image_id : 'Job ID: '+this.props.route.params.show_id_order}`}
          </Text>

          <TouchableOpacity activeOpacity={2} onPress={() => this.getMessage()} >
            <View style={{ height:30, width:20, margin:20 }}>
              <Icons name="refresh-circle-outline" onPress={() => this.getMessage()}  size={20} color="#FFF" style={{ margin:0 }} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{
            height:height,
            width:width -45,
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            position:"absolute",
            top:75,
            // left:25,
            right:25,
            backgroundColor:"#FFF",
            flex:1
        }} >
          <View style={{ flex:1, height:"100%" }} >
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={90} style={{ height: height * 0.82 }}>
              <ScrollView contentContainerStyle={{ flex:1, flexDirection:'row' }}> 
                <View style={{flex:1,alignContent:'flex-end',justifyContent:'flex-end'}}>
                  <GiftedChat 
                    isAnimated
                    keyboardShouldPersistTaps={'always'}
                    messages={this.state.message}
                    renderBubble={this.renderBubble}
                    alwaysShowSend={true}
                    renderSend={this.renderSend}
                    onSend={messages => {
                      this.onSend(messages)
                      this.getMessage()
                    }}
                    showUserAvatar={true}
                    renderAvatarOnTop={true}
                    user={{_id: parseInt(this.state.user_id)}}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    );
  }
}

