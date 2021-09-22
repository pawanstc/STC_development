import React,{useEffect,useState} from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import Share from 'react-native-share'
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';

import { BackHandler,Modal,View,Text, Dimensions, TouchableOpacity} from 'react-native'
import { downloadFile } from './helper/utility';

function preview({navigation,route}) {
  let {height,width} = Dimensions.get('screen')
  
    const [isModalVisible, setModalVisible] = useState(true)

const closeModal = () => {
  if (isModalVisible) {
    setModalVisible(false)
    navigation.pop()
  }
}



useEffect(() => {
  if(width>height){
    let temp = width;
    width= height;
    height=temp;
   
    
}
  BackHandler.addEventListener('hardwareBackPress', closeModal)
  return () => {BackHandler.removeEventListener()
    }
    
}, [])

   const {uri,isShowShare = false, isShowDownload = false, message = ''} = route.params
   let ext ='jpg';
   let type = 'image/jpg';
   
   const images=[{
       url:uri
   }]
   function ShareImage() {
     if(uri.endsWith('png')){
       ext='png'
       type='image/png'
     }else if(uri.endsWith('jpg')){
       ext='jpeg'
       type='image/jpeg'
     }else if(uri.endsWith('jpeg')){
       ext='jpeg'
       type='image/jpeg'
     }
     
     
    
    let shareOptions = {
      message:message,
      url:uri
    }
  

    RNFetchBlob.config({ fileCache: false })
    .fetch('GET', uri)
    .then(resp => {
        shareOptions.url='data:image/'+ext+';base64,'+resp.data;
        shareOptions={...shareOptions,type}
    })
    .then(()=>
      Share.open(shareOptions)
    )
    .catch(err => { 
      console.log(err);
    })
  }
   
    return (
       <Modal visible={true} onRequestClose={closeModal} transparent={true}>
            <ImageViewer imageUrls={images}/>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, backgroundColor: '#000000' }}>
                {isShowShare ?
                <TouchableOpacity  onPress={()=>ShareImage()}>
                  <View  style={{height:60,borderWidth:0.4,alignSelf:'baseline',alignItems:'center',backgroundColor:'#000000',justifyContent:'space-around'}}>
                    <Icon name="share" size={30} color="white" style={{ padding: 8, paddingLeft:8, marginLeft:15 }} />
                    <Text style={{ fontSize: 14, color: "white", padding: 8, marginLeft:8 }} >Share</Text>
                  </View>
                </TouchableOpacity>
                : null}
                {isShowDownload ?
                <TouchableOpacity  onPress={()=>downloadFile(uri)}>
                  <View  style={{height:60,borderWidth:0.4,alignSelf:'baseline',alignItems:'center',backgroundColor:'#000000',justifyContent:'space-around'}}>
                    <Icon name="download" size={30} color="white" style={{ padding: 8, paddingLeft:8, marginLeft:15 }} />
                    <Text style={{ fontSize: 14, color: "white", padding: 8, marginLeft:8 }} >Download</Text>
                  </View>
              </TouchableOpacity>
              : null}
            </View>
       </Modal>
    )
    
}

export default preview
