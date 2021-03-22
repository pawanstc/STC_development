import React, { useState, useEffect } from 'react';

import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';


function PushNotificationSetup (){
    useEffect(async () =>{
        const token = await messaging().getToken();
        const authStatus = await messaging().requestPermission();
      
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      
            if(enabled){
               console.log("Authorize Status is " + authStatus);
    
               messaging().onNotificationOpenedApp(remoteMessage => {
                console.log(
                  'Notification caused app to open from background state:',
                  remoteMessage.notification,
                );
                // navigation.navigate(remoteMessage.data.type);
              });
            
              messaging().getInitialNotification(remoteMessage => {
                console.log(
                  'Notification caused app to open from background state:',
                  remoteMessage.notification,
                );
                // navigation.navigate(remoteMessage.data.type);
              });
            
             
            
              messaging().onMessage(remoteMessage => {
                console.log(
                  'Notification caused app to open from background state:',
                  remoteMessage.notification,
                );
                // navigation.navigate(remoteMessage.data.type);
              });
            }
    })
}

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundHandler); 