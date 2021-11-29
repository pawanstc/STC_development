import React, { Component } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Text, TextInput, StatusBar,FlatList, Dimension, PermissionsAndroid, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';



//  upload image
import ImagePicker from 'react-native-image-picker';
import { Value } from 'react-native-reanimated';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
let {height,width} = Dimensions.get('screen')
export default class StackNavigation extends Component{

    constructor(props){
        super(props)

        this.state = {
           setIsPermitted:false,
           isPermitted:false,
           setCaptureImages:[],
           captureImages:[],
           imageUri:"",
           photo:""
        }
    }
    componentDidMount(){
      if(width>height){
        let temp = width;
        width= height;
        height=temp;
       
        
    }
    }

 
requestCameraPermission = async () => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

   requestExternalWritePermission = async () => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert('Write permission err', err);
    }
    return false;
  };

   requestExternalReadPermission = async () => {
    alert("success")
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Storage Permission',
          message: 'App needs Read Storage Permission',
        },
      );
      // If READ_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert('Read permission err', err);
    }
    return false;
  };

  

     openCamera = async () => {
         this.setState({
             isPermitted:true
         })
    if (Platform.OS === 'android') {
      if (await this.requestCameraPermission()) {
  
        if (await this.requestExternalWritePermission()) {
          if (await this.requestExternalReadPermission()) {
            this.setState({
                setIsPermitted:true,

            })
          } else alert('READ_EXTERNAL_STORAGE permission denied');
        } else alert('WRITE_EXTERNAL_STORAGE permission denied');
      } else alert('CAMERA permission denied');
    } else {
      this.setState({
          setIsPermitted:true
      })
    }
  };



   onBottomButtonPressed = (event) => {
     
    const images = JSON.stringify(event.captureImages);
    event.captureImages.forEach(value =>{
      console.log(value.uri)
      this.setState({
        photo:value.uri
      })
    })
    if (event.type === 'left') {
    
        this.setState({
            isPermitted:false
        })
    } else if (event.type === 'right') {
  
      this.setState({
          setIsPermitted:false,
          setCaptureImages:images
      })
      // event.captureImages.forEach(value =>{
      //   console.log(value)
      //   this.setState({
      //     photo:value.uri

  
      // });
      // });

      this.setState({

        isPermitted:false
      });
      
    } else {
      Alert.alert(
        event.type,
        'Image Capture successfully',
        [{text: 'OK', onPress: () => {
          this.setState({
            isPermitted:false
          })
        }}],
        {cancelable: false},
      );
    }
  };

handleChooseImage = () =>{
  const options = {
    noData:true
  }

  ImagePicker.launchImageLibrary(options, response =>{
    console.log(response.fileName)
    if(response.uri){
      console.log("image uri" + response );
      this.setState({
        photo:response.uri
      })
    }
  })
}

    render(){
      console.log(this.state.photo);
        return(
            <View style={{
                flex:1,
                backgroundColor:"#FFF"
            }} >
                <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
                {this.state.isPermitted ? (
        <View style={{
            flex:1
        }} >
          <CameraKitCameraScreen
          cameraOptions={{
              FlashMode:'auto',
              focusMode:'on',

          }}
            // Buttons to perform action done and cancel
            actions={{
              rightButtonText: 'Done',
              leftButtonText: 'Cancel'
            }}

            onBottomButtonPressed={
              (event) => this.onBottomButtonPressed(event)
            }
            flashImages={{
              // Flash button images
              on: require('../assets/images/flashon.png'),
              off: require('../assets/images/flashoff.png'),
              auto: require('../assets/images/flashauto.png'),
            }}
           
            captureButtonImage={require('../assets/images/camera.png')}
       
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.titleText}>React Native Camera</Text>
          {/* <Text style={styles.textStyle}>{captureImages}</Text> */}
          <TouchableOpacity
            onPress={this.openCamera }
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Open Camera</Text>
          </TouchableOpacity>

          {
            this.state.photo != null  ? (
              <View>
                <Image source={{uri:this.state.photo}} style={{
                  height:100,
                  width:200,
                  marginTop:20
                }} />
                <TouchableOpacity onPress={() => this.handleChooseImage()} >
                  <Text style={{
                    textAlign:"center",
                    color:"blue",
                    fontSize:20
                  }} >
   select Image
                  </Text>
                </TouchableOpacity>
                </View>
            ) :(
              <View>
                <Text>gy</Text>
                </View>
            )
          }
        </View>
      )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center",

    },
    headerStyle:{
        backgroundColor:"#62463e",
        height:105,
        width:width,
        borderBottomRightRadius:15,
        borderBottomLeftRadius:15,
        flexDirection:"row"
    },
    iconStyle:{
        margin:15
    },
    headerTitle:{
        color:"#FFF",
        fontSize:20,
        margin:14
    },
    ViewContainer:{
        position:"absolute",
        top:67,
        left:0,
        right:0,
        backgroundColor:"#FFF",
        height:height,
        width:width -50,

        
        marginHorizontal:25,
        borderRadius:20,
        flex:1,
        // justifyContent:"center",
        alignItems:"center"

    },
    textInput:{
        height:40,
        width:width -100,
        backgroundColor:"#FFF",
        borderBottomWidth:0.6,
        borderBottomColor:"black",
        marginLeft:20
    },
    buttonStyle:{
        height:40,
        width:200,
        backgroundColor:"#62463e",
        textAlign:'center',
        alignItems:'center',
        marginTop:40,
        borderRadius:10,
        marginHorizontal:50
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
      },
      titleText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      textStyle: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginTop: 16,
      },
      buttonStyle: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'green',
        padding: 5,
        marginTop: 32,
        minWidth: 250,
      },
      buttonTextStyle: {
        padding: 5,
        color: 'white',
        textAlign: 'center',
      },
})