import React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import ImageView from 'react-native-image-view'
import { View,Image } from 'react-native'

function preview({navigation,route}) {

   const {uri,order_id} = route.params
    console.log(uri)
    return (
        <View style={{flex:1,height:'100%',width:'100%'}}>
            <Image source={{uri:uri}} style={{
                height:'100%',
                width:'100%'}}/>

        </View>
    )
}

export default preview
