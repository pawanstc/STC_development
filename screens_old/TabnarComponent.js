import React, { Component } from 'react';

import { StyleSheet, Image, View, Text, TouchableOpacity,Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();

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
            tabLabel: "Home"
        }
    }

    selectTab  =(value) =>{
    
       this.setState({
           tabLabel:value
       });
      

            if(value === "Home"){
                this.props.navigate.navigate("home");
            }else if(value === "CatLog") {
                this.props.navigate.navigate("catelogMaster");
            }else if(value === "PostJob"){
                this.props.navigate.navigate("postJob")
            }
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
            <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigate.navigate("notification")} >
                    <Icon name="notifications-outline" size={18} style={{
              
                        marginLeft:15
                    }} color="#ffcc80"  />
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
        width:Dimensions.get("screen").width ,
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
