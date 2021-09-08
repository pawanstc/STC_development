import React, { Component } from 'react';

import { StyleSheet, Image, View, Text, TouchableOpacity,Dimensions, AsyncStorage } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons';
import {URL,imageUrl} from '../api'

Icon.loadFont();
let {height,width} = Dimensions.get('screen')
export default class TabComponnet extends Component{

    constructor(props){
        super(props)

        this.state = {
            TabIcons:[
                {
                    label:'Home',
                    inActiveIcon:'home-outline',
                    active:'home'
                },
                {
                    label:'CatLog',
                    inActiveIcon:'copy-outline',
                    active:'copy'
                },
                {
                    label:'PostJob',
                    inActiveIcon:'checkmark-outline',
                    active:'checkmark'
                },
                {
                    label:'Notification',
                    inActiveIcon:'notifications-outline',
                    active:'notifications'
                },
                
                
            ],
            tabLabel: "Home",
            uid:'',
            notifications: []
        }
    }

    getNotifications=(userId)=>{
        NetInfo.fetch().then(state=>{
            if(state.isConnected){
                fetch(URL + "/get_notification_details_by_user_id",{
                    
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        },
                        method:"POST",
                        body:"user_id="+userId
                }).then(response=>response.json())
                .then(result=>{
                    this.setState({
                        notifications:result.notification_details
                    })
                }
                    
                    
                ).catch(err=>console.log(err))
            }
        })
    }

    selectTab  =(value) =>{
    
       this.setState({
           tabLabel:value,
       });
      

            if(value === "Home"){
                this.props.navigate.navigate("home");
            }else if(value === "CatLog") {
                this.props.navigate.navigate("catelogMaster");
            }else if(value === "PostJob"){
                this.props.navigate.navigate("postJob")
            }
    }

    componentDidMount(){
        if(width>height){
            let temp = width;
            width= height;
            height=temp;
           
            
        }
        AsyncStorage.getItem('user_id').then(result=>{
            if(result){
                this.getNotifications(result);

                this.setState({uid:result})
            }
        })

    }

    showTab = (value) =>{
  
        if(this.state.tabLabel != value ){

            return false;

        }else{
           return false;
        }
    }
    render(){

        return(
            <View style={styles.tabContainer}>
<View style={styles.tabItems} >
<View  style={{
            flexDirection:"column",
            alignItems:"center",
            flex:0.6,
            marginLeft:15,
            marginRight:15
             
      
         }} >
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigate.navigate("home")} >
                    <Icon name="home-outline" size={18} style={{
              
                        marginLeft:4
                    }} color="#ffcc80"  />
                    <Text style={{
                        
                         fontSize:10,
                         marginTop:6,
                         textAlign:'center',
                         fontWeight:"bold"
                    }} >Home</Text>
                    </TouchableOpacity>
      
         </View>

         <View  style={{
            flexDirection:"column",
            alignItems:"center",
            flex:0.6,
            marginLeft:15,
            marginRight:15
             
      
         }} >
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigate.navigate("subCategory",{
                stocks :""
            })} >
                    <Icon name="copy-outline" size={18} style={{
              
                        marginLeft:6
                    }} color="#ffcc80"  />
                    <Text style={{
                        
                         fontSize:10,
                         marginTop:6,
                         textAlign:"center",
                         fontWeight:"bold"
                    }} >Catalog</Text>
                    </TouchableOpacity>
      
         </View>

         <View  style={{
            flexDirection:"column",
            alignItems:"center",
            flex:0.6,
            marginLeft:15,
            marginRight:15
             
      
         }} >
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigate.navigate("postJob",{
                image:""
            })} >
                    <Icon name="checkmark" size={18} style={{
              
                        marginLeft:6
                    }} color="#ffcc80"  />
                    <Text style={{
                        
                         fontSize:10,
                         marginTop:6,
                         textAlign:'center',
                         fontWeight:"bold"
                    }} >Post Job</Text>
                    </TouchableOpacity>
      
         </View>

         <View  style={{
            flexDirection:"column",
            alignItems:"center",
            flex:0.6,
            marginLeft:15,
            marginRight:15
             
      
         }} >
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigate.navigate("notification")
                
            } >
                    <Icon name="notifications-outline" size={18} style={{
              
                        marginLeft:15
                    }} color="#ffcc80"  />
                    {this.state.notifications && this.state.notifications.length > 1 ?
                        <View style={{
                            position:'absolute', 
                            height: 15, 
                            width: 15,
                            borderRadius: 8, 
                            backgroundColor: '#ffcc80', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            right: 17,
                            top: -5
                            }}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                                {this.state.notifications.length || 0} 
                            </Text>
                        </View>
                    : null}
                    <Text style={{
                        
                         fontSize:10,
                         marginTop:6,
                         textAlign:"center",
                         fontWeight:"bold"
                    }} >Notification</Text>
                    </TouchableOpacity>
      
         </View>

  
   
</View>
    </View>
        )
    }
}

const styles = StyleSheet.create({
    tabContainer:{
      
        height:55,
        width:width ,
        backgroundColor:"#FFF",
        elevation:10,
        justifyContent:"center",
        alignItems:'center',
  
        

    },
    tabItems:{
        justifyContent:"space-between",
   
        flexDirection:"row",
        
    }
})
