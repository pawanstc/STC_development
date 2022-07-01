import React, {useEffect, useState} from 'react';
import { Alert, FlatList, Image, PermissionsAndroid, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'uuid-random';
import CustomModal from '../CustomModal';

function AddSupportImage(props) {
    const {isVisible, onPressClose, onSubmitSuccess} = props;
    const [photo2, setPhoto2] = useState();
    const [photo2Arr, setPhoto2Arr] = useState([]);
    const [progressInfo, setProgressInfo] = useState({});
    const [image_flag, setImageFlag] = useState('');

    const deleteImage = async (id) => {
        Alert.alert(
            "STC alert",
            "Are you sure to delete custom image ?",
            [
                {text:"yes", onPress: async() =>{
                    const newArray = photo2Arr;
                    const updatedList = newArray.filter(item => item.id !== id);
                    setPhoto2Arr(updatedList);
                }},
                {text:"No", onPress:() => null }
            ],
            {
              cancelable:false
            }
        );
        console.log(photo2Arr);
    }

    const launchCamera2 = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              title:"STC alert",
              message:"STC needs to access your Camera ",
              buttonNutral:"ask me latter",
              buttonPositive:"Yes",
              buttonNegetive:"No"
            }
        );
  
        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({ width: 300, height: 400, cropping: false }).then(image => {
                var ImageObj = { uri: image.path, id: uuid() };
                let tempImage = [];
                tempImage.push(ImageObj);
                console.log(tempImage);
            
                setPhoto2Arr([...photo2Arr, ...tempImage])
  
                var form = new FormData();
                photo2Arr.forEach((item, i) => {
                    form.append("image",{
                        uri:item.uri,
                        type:'image/'+item.uri.split('.').pop(),
                        name:item.uri.replace(/^.*[\\\/]/, '')
                    })
                });
  
                var xhr = new XMLHttpRequest();
                xhr.open("POST","https://stcapp.stcwallpaper.com/backend/postjob.php");
                xhr.setRequestHeader("Content-Type","multipart/form-data");
                xhr.send(form);
                if(xhr.upload){
                    xhr.upload.onprogress = ({total, loaded}) =>{
                        setProgressInfo({ progress:loaded/total, progressStat:true })
                    }
                }
            
                setTimeout(() =>{
                    setProgressInfo({ progressStat:false })
                }, 1100);
            
            });
        } else {
            alert("Please Try again Latter");
        }
    }

    const selectImageFromGalary = async () => {
        setImageFlag("2");
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title:"Stc alert",
              message:"Stc need to Access your File",
              buttonNutral:"ask Me latter",
              buttonNegetive:"No",
              buttonPositive:"yes"
            }
        );
    
        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openPicker({ multiple: true }).then(image => {
                console.log(image);
                let tempArray = [];
                image.forEach(value =>{
                    var image = { uri:value.path, id:uuid() };
                    tempArray.push(image);
                })
                setPhoto2Arr([...photo2Arr, ...tempArray])
       
                var form = new FormData();
                photo2Arr.forEach((item, i) => {
                    form.append("image",{
                        uri:item.uri,
                        type:'image/'+item.uri.split('.').pop(),
                        name:item.uri.replace(/^.*[\\\/]/, '')
                    })
                });
    
                var xhr = new XMLHttpRequest();
                xhr.open("POST","https://stcapp.stcwallpaper.com/backend/postjob.php");
                xhr.setRequestHeader("Content-Type","multipart/form-data");
                xhr.send(form);
    
                if(xhr.upload) {
                    xhr.upload.onprogress = ({total, loaded}) =>{
                        setProgressInfo({ progress:loaded/total, progressStat:true })
                    }
                }
                setTimeout(() =>{
                setProgressInfo({ progressStat:false })
                }, 1100);
      
            });
        } else {
            alert("Please try again latter");
        }
    }

    const orderSubmit = () => {
        onSubmitSuccess && onSubmitSuccess();
    }

    console.log('photo2Arr===============>', photo2Arr);

    return (
        <CustomModal isVisible={isVisible} backButtonPress={onPressClose}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <View
                    style={{
                    // minHeight: 250,
                    width: '100%',
                    // marginTop: 100,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    elevation: 5,
                    borderRadius: 5,
                }}>
                    <TouchableOpacity onPress={onPressClose} style={{width: 50, height: 50, alignSelf: 'flex-end'}}>
                        <Icon
                            name="x-circle"
                            size={20}
                            color="#62463e"
                            style={{alignSelf: 'flex-end', padding: 10}}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={{fontSize:14, marginTop:14, textAlign:"center", marginBottom:6, color:"#404040"}}>
                            Add Supporting Images (Custom or wall Image)
                        </Text>
                        {photo2  ? (
                            <Image source={{ uri: photo2 }} style={{ height:120, width:120 }} />
                        ) : null}

                        {photo2Arr?.length > 0 ? (
                            <View>
                                <FlatList
                                    showsHorizontalScrollView={false}
                                    data={photo2Arr}
                                    horizontal
                                    contentContainerStyle={{
                                    paddingBottom:20
                                    }}
                                    renderItem={(items, index) => {
                                        console.log(items.item.id)
                                        return (
                                            <View style={{ justifyContent:"center", alignItems:"center", flex:1 }} >
                                                <TouchableOpacity onPress={() => deleteImage(items.item.id)} >
                                                    <Image source={{uri:items.item.uri}} style={{ height:140, width:160, margin:12 }} />
                                                    <Text style={{ textAlign:"center" }} >Attachment</Text>
                                                    <IIcon name="close" style={{ position:"absolute", top:70, left:80, right:0 }} size={30} color="red"  />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    }
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                        ) : null }

                        <View style={{ flexDirection: "row", marginBottom: 30, justifyContent: "center", alignItems:"center" }} >
                            <TouchableOpacity activeOpacity={2} onPress={() => launchCamera2()} >
                                <Text style={{ fontSize:15, marginTop: 15, marginHorizontal:10 }} >Capture Image</Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor:'#62463e', height:40, width:40, borderRadius:20, marginTop:10, justifyContent:'center', alignItems: 'center', marginHorizontal:10 }}>
                                <TouchableOpacity activeOpacity={2} onPress={() => launchCamera2()}>
                                    <IIcon name="camera-outline" size={18} color="#FFF" /> 
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity activeOpacity={2} onPress={() => selectImageFromGalary()} >
                                <View style={{ backgroundColor:'#62463e', height:40, width:40, borderRadius:20, marginTop:10, justifyContent:'center', alignItems: 'center', marginHorizontal:5 }} >
                                    <Image source={require("../../../assets/images/menu.jpg")} style={{ height:20, width:20 }} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={2} onPress={() => selectImageFromGalary()} >
                                <Text style={{ fontSize:15, marginTop: 15, marginHorizontal:10 }} >Select Image</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ textAlign:"center", marginBottom:40 }} >Any special image to be appended on Wall</Text>
                    
                        <TouchableOpacity activeOpacity={2} onPress={orderSubmit} style={{ alignSelf: 'center', paddingBottom: 20 }} >
                            <View style={{ alignItems:'center', height:45, width:220, backgroundColor:"#62463e", justifyContent:"center", borderRadius: 5 }}>
                                <Text style={{ textAlign:"center", alignItems:'center', color:"#FFF", fontSize:18, }}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomModal>
    )
}

export default AddSupportImage;