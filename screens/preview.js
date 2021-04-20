import React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import ImageView from 'react-native-image-view'

function preview({navigation,route}) {

   const {uri,order_id} = route.params
  const images={
       source:{
           uri:uri
          
       },
       title:order_id
   }
    return (
        <ImageView images={images}></ImageView>
    )
}

export default preview
