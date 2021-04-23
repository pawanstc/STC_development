import React,{useEffect,useState} from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import ImageView from 'react-native-image-view'
import { BackHandler,Modal } from 'react-native'

function preview({navigation,route}) {

    const [isModalVisible, setModalVisible] = useState(true)

const closeModal = () => {
  if (isModalVisible) {
    setModalVisible(false)
    navigation.pop()
  }
}

useEffect(() => {
  BackHandler.addEventListener('hardwareBackPress', closeModal)
  return () => {BackHandler.removeEventListener()
    }
}, [])

   const {uri,order_id} = route.params
   const images=[{
       url:uri
   }]
   
    return (
       <Modal visible={isModalVisible} onRequestClose={closeModal} transparent={true}>
           <ImageViewer imageUrls={images} renderArrowLeft={()=>{null}}/>
       </Modal>
    )
}

export default preview
