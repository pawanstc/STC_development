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
import {URL} from '../api.js';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {NetworkInfo} from 'react-native-network-info';
export default class Messaging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: [],
      user_id: '',
      refresh: false,
      sendMessage: [],
      ip_address: '',
    };
  }

  componentDidMount() {
    this.getMessage();

    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      this.setState({
        ip_address: ipv4Address,
      });
    });
  }

  getMessage = () => {
    AsyncStorage.getItem('user_id').then((result) => {
      this.setState({
        user_id: result,
      });

      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetch(URL + '/get_message_list_by_order_id', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: 'order_id=' + this.props.route.params.order_id,
          })
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              if (result.error == false) {
                this.setState({
                  message: result.message_list,
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
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        fetch(
          'https://phpstack-525410-1692898.cloudwaysapps.com/backend/v1/insert_message_order_wise',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body:
              'user_id=' +
              this.state.user_id +
              '&order_id=' +
              this.props.route.params.order_id +
              '&message=' +
              messages[0].text +
              '&created_by_ip=' +
              this.state.ip_address,
          },
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.error === false) {
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
}} size={25} />
        </View>
        </Send>
    )
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <StatusBar backgroundColor="#62463e" barStyle="light-content" />
        <View
          style={{
            height: 170,
            width: Dimensions.get('screen').width,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor: '#62463e',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
     <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
   <Icon name="arrow-back" color="#FFF" size={18} style={{
            margin:20
        }} />
     </TouchableOpacity>

        <Text style={{
            textAlign:"center",
            color:"#FFF",
            fontSize: 18,
            margin:20,

        }} > Job ID: { this.props.route.params.show_id_order }</Text>

        <TouchableOpacity activeOpacity={2} onPress={() => this.getMessage()} >
         <View style={{
            height:30,
            width:20,
            margin:20
         }} >
         <Icons name="refresh-circle-outline" onPress={() => this.getMessage()}  size={20} color="#FFF" style={{
                        margin:0,
                        
                    }} />
         </View>
        </TouchableOpacity>
        </View>

        <View style={{
            height:Dimensions.get("screen").height,
            width:Dimensions.get("screen").width -45,
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            position:"absolute",
            top:75,
            left:25,
            right:25,
            backgroundColor:"#FFF",
            flex:1
        }} >

   <View style={{
    flex:1,
    height:"100%"
   }} >
 <KeyboardAvoidingView 
        behavior="padding"
        keyboardVerticalOffset={90}

        style={{
            height: Dimensions.get("screen").height * 0.82
        }}
     >

     <ScrollView 

     contentContainerStyle={{
        paddingBottom:10,
        flex:1
     }}
      >

           <GiftedChat
       keyboardShouldPersistTaps={'always'}
      messages={this.state.message}
      renderBubble={this.renderBubble}
      alwaysShowSend
      renderSend={this.renderSend}
      onSend={messages => this.onSend(messages)}
      user={{
        _id: 1,
      }} />

     </ScrollView>

    </KeyboardAvoidingView>
   </View>
        </View>
      </View>
    );
  }
}

