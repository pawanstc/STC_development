import React, { Component } from 'react';

import { StyleSheet , View, Text, Image, TouchableOpacity, Dimensions,TextInput, ScrollView, KeyboardAvoidingView  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

import Modal, { ModalContent } from 'react-native-modals';







const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 5,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#62463e',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: 'black',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#FFF',
    labelColor: '#FFF',
    labelSize:14 ,
   
    currentStepLabelColor: '#fe7013',

  }
  let {height,width} = Dimensions.get('screen')

export default class Placeorder extends Component{

    constructor(props){
        super(props)

        this.state = {
            wallImage:"",
            customWall:"",
            qty:"1",
            isVisiable:true,
            position:0
        }
    }

    componentDidMount() {
        if(width>height){
            let temp = width;
            width= height;
            height=temp;
           
            
        }
        this.setState({
            wallImage:this.props.route.params.stocks
        })
        console.log(this.props.route.params.stocks);
    }

    onPageChange(position){
        console.log(position);
        this.setState({position: position});
    
          if(position == 4 ){
            this.props.navigation.replace("placeorder", {
                stocks:this.state.data
            });
          }
    }

    uploadImage = () =>{
        const options = {
          noData:true
        }
      
        ImagePicker.launchImageLibrary(options, response =>{
          console.log(response.fileName)
          if(response.uri){
            console.log("image uri" + response.uri );
            this.setState({
              customWall:response.uri
            })
          }
        })
      }

      launchCamera = () =>{
        const options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };

          ImagePicker.launchCamera(options, (response) => {
                if(response.uri){
                    console.log(response);
                    this.setState({
                        customWall:response.uri
                    })
                }
          });
    }
    quantity1 = (qty) =>{
        let q = Number(qty)
        this.setState({
            qty:q +1
        });
    }

    quantity2 = (qty) =>{
        let q = Number(qty)
        if(qty <= 1){

        }else{
            this.setState({
                qty:q-1
            });
        }
    }
    render(){
        return(
            <View style={{
                flex:1
            }} >
                 <View style={{
                 flex:1,
                 
             }} >
                 <View style={{
                     height:180,
                     width:width,
                     borderBottomLeftRadius:18,
                     borderBottomRightRadius:18,
                     backgroundColor:'#62463e',
                     flexDirection:'row'
                 }} >

                 <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
                 <Icon name="arrow-back" color="#FFF" size={20 } style={{
                     margin:20
                 }} />
                 </TouchableOpacity>
          <Text style={{
              fontSize:16,
              fontFamily:'Roboto-Bold',
              color:'#FFF',
              margin:20,

          }} >Place Order</Text>
                 </View>

                 <View style={{
                     position:'absolute',
                     top:74,
                     height: height,
                     width:width -46,
                     backgroundColor:'#FFF',
                     left:22,
                     borderTopLeftRadius:20,
                     borderTopRightRadius:20,

                 }} >
                    
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        marginBottom:140,
                        flex:1,
                        marginBottom:180
                    }} >
                   <Text style={{
    fontFamily:'Roboto-Bold',
    fontSize:18,
    margin:18
}} >Select Image</Text>

<View style={{
    flexDirection:"row",
    margin:10,
    
}} >
   {
       this.state.wallImage ? (
           <View style={{
               height:120,
               width:140,
               borderWidth:0.4,
               
           }} >
               <Image source={{uri:this.state.wallImage}} style={{
                   height:120,
                   width:140
               }} />
               

           </View>
       ) :(
           <View style={{
               height:120,
               width:140,
               borderWidth:0.4,
               
           }} >
               <Image source={require("../assets/edit.jpg")} style={{
                   height:120,
                   width:140
               }} />
               

           </View>
       )
   }
   <View style={{
       flexDirection:"column"
   }} >
       <View style={{
           flexDirection:"row"
       }} >
             <View style={{
                height:40,
                width:40,
                justifyContent:'center',
                alignItems:'center',
                borderRadius:40/2,
                backgroundColor:'#62463e',
                marginHorizontal:10
            }} >
                <TouchableOpacity onPress={() => this.uploadImage()} >
                <Image source={ require("../assets/uload3.jpg") } style={{
                    height:15,
                    width:15
                }} />
                </TouchableOpacity>

            </View>
           <View style={{
               flexDirection:"column",
            
           }} >
                <Text style={{
                fontFamily:'Roboto-Bold',
                fontSize:12,
                margin:10,
                marginLeft:-2
                
            }} >Select Patterns</Text>
            <Text style={{
                textAlign:'center',
                fontFamily:'Roboto-Bold'
            }} >or</Text>

            
           </View>
       </View>
      
     <View style={{
         flexDirection:'row'
     }} >
          <View style={{
          height:40,
          width:40,
          borderRadius:20,
          backgroundColor:'#62463e',
          justifyContent:'center',
          alignItems:'center',
          margin:10
      }} >
          
          <Image source={require("../assets/menu.jpg")} style={{
              height:25,
              width:25
          }} />
      </View>
      <Text style={{
          fontFamily:'Roboto-Bold',
          fontSize:12,
          margin:14,
          marginLeft:4
      }} >Upload Image</Text>
     </View>
   </View>
          
            
</View>
<Image source={require("../assets/desc_01.jpg")} style={{
height:150,
width:250,
marginLeft:43,
marginTop:12,
marginBottom:10
}} />

<View style={{
       flexDirection:"row",
       marginTop:14
   }} >
            <View style={{
                flexDirection:"column"
            }} >
                 <Text style={{
   fontFamily:'Roboto',
   fontSize:13,
   margin:10
}} >Wall Dimensions</Text>
<Text style={{
   fontSize:'Roboto-Italic',
   fontSize:13,
   marginLeft:10,
   marginBottom:10
}} >
   (in Inch)
</Text>
            </View>

<View style={{
flexDirection:"row",
marginRight:25
}} >
<Text style={{
   fontFamily:"Roboto-Bold",
   margin:8,
   marginRight:10,
   fontSize:10
}} >H</Text>
{/* <View style={{
   height:28,
   width:80,
   borderRadius:10,
   borderWidth:0.3
}} >
   <Text s ></Text>

</View> */}
<TextInput
keyboardType="numeric"
placeholder="Height" style={{
   height:35,
   width:68,
   borderWidth:0.3,
   borderRadius:10,
   textAlign:'center'
}} />

<Text style={{
textAlign:'center',
fontFamily:'Roboto-Bold',
marginTop:10,
fontSize:20,
marginLeft:7
}} >*</Text>

<Text style={{
   fontFamily:"Roboto-Bold",
   margin:8,
   marginLeft:5,
   fontSize:10
}} >
   W
</Text>
{/* <View style={{
   height:28,
   width:80,
   borderRadius:10,
   borderWidth:0.3
}} >
   <Text s ></Text>

</View> */}
<TextInput
keyboardType="numeric"
placeholder="Width" style={{
   height:35,
   width:68,
   borderWidth:0.3,
   borderRadius:10,
   textAlign:'center'
}} />
</View>
   </View>

<View style={{
    flexDirection:"row"
}} >
    <Text style={{
        fontFamily:'Roboto-Bold',
        fontSize:14,
        margin:14
    }} >Quantity:</Text>

   <TouchableOpacity onPress={() => this.quantity2(this.state.qty)} >
   <View style={{
        height:30,
        width:30,
        backgroundColor:"#FFF",
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:50,
        borderColor:'black',
        borderWidth:0.3
    }} >
        <Text style={{
            alignItems:'center',
            
            fontSize:20,
           
        }} >-</Text>
    </View>
   </TouchableOpacity>

    <View style={{
           height:40,
           width:70,
           borderRadius:16,
           borderWidth:0.4,
           marginHorizontal:20,
           justifyContent:'center',
           alignItems:'center'
           
       }} >
           <Text style={{
               textAlign:"center"
           }} >{this.state.qty}</Text>
       </View>

    <TouchableOpacity onPress={() => this.quantity1(this.state.qty)} >
    <View style={{
        height:30,
        width:30,
        backgroundColor:"#FFF",
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:0,
        borderColor:'black',
        borderWidth:0.3,
      
    }} >
       <Text  style={{
           textAlign:'center',
           fontSize:20,
           marginBottom:6
       }} >+</Text>
    </View>
    </TouchableOpacity>


</View>
   
 
   <Text style={{
       textAlign:'center',
       alignItems:'center',
       fontFamily:'Roboto-Bold',
       color:'grey',
       marginTop:22
   }} >
       Mamimum 300dpi with Size of 6mb to 7mb size requried in pdf format
    </Text>
   <View
       style={{
           borderWidth:0.3,
           wdith:400,
           borderBottomColor:'black',
           marginTop:20
       }}
   />
   <Text style={{
       textAlign:'center',
       fontFamily:'Roboto-Bold',
       fontSize:14,
       color:'grey',
       marginTop:14
   }} >Any Special Image to be Appended on wall paper</Text>

   {
       this.state.customWall ? (
           <View style={{
               height:120,
               width:140,
               borderWidth:0.4,
               marginTop:30,
               margin:10
               
           }} >
              <Image source={{uri:this.state.customWall}} style={{
                          height:120,
                          width:140,
                          
                      }} />
               

           </View>
       ) :(null)
   }

   <View style={{
       flexDirection:'row',
       margin:20
   }} >
       <View style={{
           height:30,
           width:30,
           borderRadius:15,
           backgroundColor:'#62463e',
           margin:14,
           justifyContent:'center',
           alignItems:"center"
       }} >
          <TouchableOpacity onPress={() => this.uploadImage()} >
          <Image source={require("../assets/uload3.jpg")} style={{
               height:10,
               width:10
           }} />
          </TouchableOpacity>
          
       </View>
       <Text style={{
               textAlign:"center",
               fontFamily:'Roboto-Bold',
               fontSize:14,
               marginTop:20
           }} >Upload Image</Text>

           <TouchableOpacity onPress={() => this.launchCamera()} >
           <View style={{
           height:30,
           width:30,
           borderRadius:15,
           backgroundColor:'#62463e',
           margin:14,
           justifyContent:'center',
           alignItems:"center"
       }} >
    
          <Image source={require("../assets/menu.jpg")} style={{
               height:15,
               width:15
           }} />
       
          
       </View>
           </TouchableOpacity>
       <Text style={{
               textAlign:"center",
               fontFamily:'Roboto-Bold',
               fontSize:14,
               marginTop:20
           }} >Select Image</Text>
   </View>
                    </ScrollView>
                   
                    
                 </View>
                 
             </View>
            
                 
             <View style={{
                 height:53,
                 width:width,
                 backgroundColor:'#62463e',
                 justifyContent:'center',
                 alignItems:'center',
                 borderTopLeftRadius:20,
                 borderTopRightRadius:20
             }} >
                 <Text style={{
                     textAlign:"center",
                     fontFamily:"Roboto-Bold",
                     fontSize:18,
                     color:"#FFF"
                 }} >Place Order</Text>
             </View>
            
            </View>
        )
    }
}