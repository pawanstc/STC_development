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

   const {uri,order_id} = route.params
   console.log(uri,order_id)
   let ext ='jpg'
   
   
   const images=[{
       url:uri
   }]
   function ShareImage() {
     if(uri.endsWith('png')){
       ext='png'
     }else if(uri.endsWith('jpg')){
       ext='jpg'
     }else if(uri.endsWith('jpeg')){
       ext='jpeg'
     }
     
     
    
    let shareOptions = {
      message:` Hi, Please check the preview of the order id:${order_id}`,
      url:uri
    }
  

    RNFetchBlob.config({ fileCache: false })
    .fetch('GET', uri)
    .then(resp => {
        shareOptions.url='data:image/'+ext+';base64,'+resp.data
      
      if(ext=='jpg'){const type='image/jpeg'
    shareOptions={...shareOptions,type}}
    console.log(shareOptions)
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
            {order_id!==0?(
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, backgroundColor: '#000000' }}>
                <TouchableOpacity  onPress={()=>ShareImage()}>
                  <View  style={{height:60,borderWidth:0.4,alignSelf:'baseline',alignItems:'center',backgroundColor:'#000000',justifyContent:'space-around'}}>
                    <Icon name="share" size={30} color="white" style={{ padding: 8, paddingLeft:8, marginLeft:15 }} />
                    <Text style={{ fontSize: 14, color: "white", padding: 8, marginLeft:8 }} >Share</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>downloadFile(uri)}>
                  <View  style={{height:60,borderWidth:0.4,alignSelf:'baseline',alignItems:'center',backgroundColor:'#000000',justifyContent:'space-around'}}>
                    <Icon name="download" size={30} color="white" style={{ padding: 8, paddingLeft:8, marginLeft:15 }} />
                    <Text style={{ fontSize: 14, color: "white", padding: 8, marginLeft:8 }} >Download</Text>
                  </View>
              </TouchableOpacity>
            </View>
           ):null}
       </Modal>
    )
    
}

export default preview
