/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Animated
} from 'react-native';
import { ModalPortal } from 'react-native-modals';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// app navigation

import { NavigationContainer } from '@react-navigation/native';
// stack navigation
import { createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack';

// tab navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// screens 
import LoginComponent from './screens/loginScreen';
import Icon  from 'react-native-vector-icons/Ionicons';
import CatelogComponnet from './screens/catelog.js';
import Home from './screens/home';
import StockEnquery from './screens/stockEnquery.js';
import CatelogContainer from './screens/catelogMaster.js';
import StockDetails from './screens/stockDetails.js';
import SearchPhoto from './screens/searchByPhoto.js';
import SplashComponent from './screens/splash';
import PostJob from './screens/postJob.js';
import Notification from './screens/notification.js';
import UserProfile from './screens/profile.js';
import customiseComponent from './screens/customiseWp.js';
import EditProfile from './screens/editProfile.js';
import SubCategory from './screens/subCategory.js';
import Placeorder from './screens/placeorder.js';
import ChangePassword from './screens/forgotPassword.js';
import SelectPatterns from './screens/selectPattern.js';
import Category2 from './screens/category2.js';
import onBoardPage from './screens/onBoardScreen.js';
import stepGuid from './screens/stepGuid.js';
import Products from './screens/products.js';
import customCatlog from './screens/customCatalog.js';
import subComponent from './screens/subCat2';
import subCategory2 from './screens/subCat2';
import EditImage from './screens/editImage.js';
import Description from './screens/description.js';
import StockDetails2 from './screens/stockDetails2.js';

import onGoingJobList from './screens/onGoindJobList.js';
import WebView from './screens/showsPdf.js';
import Content from './screens/contentNotification.js';
import subCat2 from './screens/subCategory2.js';
import PasswordUpdate from './screens/passwordUpdate.js';
import SeeOnyourWall from './screens/seeOnYourwall.js';
import StockEnquery2 from './screens/stockEnquery2.js';
import OnGoingJob from './screens/onGoindJobList.js';
import StockEnqueryDetails from './screens/stockEnqueryData.js';
import JobTracker from './screens/trackjob.js';
import Messaging from './screens/messaging.js';
import preview from './screens/preview'
import UpdatePassword from './screens/changePassword.js';
import SearchComponent from './screens/searchBarComponent.js';
import PreviewJobView from './screens/postViewJob.js';

export default class App extends Component {
  render(){

function TabNavigation(){
  return(
    
    <Tab.Navigator 
    tabBarOptions={{
      activeTintColor:"#ffb74d",
      inactiveTintColor:"grey"
    }}
    screenOptions={({route}) =>({
      tabBarIcon: ({focused, color, size}) =>{
      let iconName;

        if(route.name === "dashboard"){
          iconName= focused
          ? 'checkmark'
          :'checkmark-outline'
        }else if(route.name === 'catelog'){
          iconName = focused
          ? 'image'
          :'image-outline'
        }else if(route.name === 'home'){
          iconName = focused
          ? 'home'
          :'home-outline'
        }else if(route.name === "catelogMaster"){
          iconName = focused
          ? 'copy'
          :'copy-outline'
        }else if(route.name === "SearchByImage"){
          iconName =focused
          ? 'camera'
          :'camera-outline'
        }
        return <Icon name={iconName} size={18} color="#ffb74d" />
      }

    })} >
      <Tab.Screen name="home"  component={Home}  /> 
 
      <Tab.Screen name="catelog" component={CatelogComponnet} />
      <Tab.Screen name="catelogMaster" component={CatelogContainer} />
      <Tab.Screen name="SearchByImage" component={SearchPhoto} />
  
    </Tab.Navigator>
  )
}

const config = {
  animation: 'timing',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

};



    return(
      
      <NavigationContainer>
          <Stack.Navigator 
          initialRouteName="splashScreen"
           screenOptions={{
            transitionSpec: {
              open: config,
              close: config
            },
            gestureDirection: 'vertical',
          }}

          >
            <Stack.Screen name="splashScreen" component={SplashComponent} options={{
              headerShown:false,
  

            }} />
            <Stack.Screen name="onBoard" component={onBoardPage} options={{
              headerShown:false
            }} />
    <Stack.Screen name="login" component={LoginComponent} options={{
      headerShown:false,
      gestureDirection :"horizontal"

    }} />
    <Stack.Screen name="home" component={Home} options={{
      headerShown:false,
      gestureDirection :"vertical"

    }} />
    <Stack.Screen name="stockEnquery" component={StockEnquery} options={{
      headerShown:false,

    }} />
    <Stack.Screen name="stockDetails" component={StockDetails} options={{
      headerShown:false,
  
    }} />
    <Stack.Screen name="setGuid" component={stepGuid} options={{
      headerShown:false
    }} />
    <Stack.Screen name="catelogMaster" component={CatelogContainer} options={{
      headerShown:false,

    }} />
    <Stack.Screen name="postJob" component={PostJob} options={{
      headerShown:false,

      
    }} />
    <Stack.Screen name="searchPhoto" component={SearchPhoto} options={{
      headerShown:false,

      
    }} />
    <Stack.Screen name="notification" component={Notification} options={{
      headerShown:false,

      
    }} />
    <Stack.Screen name="preview" component={preview} options={{
      headerShown:false,
    }}/>

    <Stack.Screen name='profile' component={UserProfile} options={{
      headerShown:false
    }} />
    <Stack.Screen name="customWp" component={customiseComponent} options={{
      headerShown:false
    }} />
    <Stack.Screen name="editProfile" component={EditProfile} options={{
      headerShown:false
    }} />
    <Stack.Screen name="subCategory" component={SubCategory} options={{
      headerShown:false
    }} />
    <Stack.Screen name="placeorder" component={Placeorder} options={{
      headerShown:false
    }} />
    <Stack.Screen name="forgotPassword" component={ChangePassword} options={{
      headerShown:false
    }} />
    <Stack.Screen name="selectPatterns" component={SelectPatterns} options={{
      headerShown:false
    }} />
    <Stack.Screen name="category2" component={Category2} options={{
      headerShown:false
    }} />
    <Stack.Screen  name="products" component={Products} options={{
      headerShown:false
    }} />
    <Stack.Screen name="customCatelog" component={customCatlog} options={{
      headerShown:false
    }} />
    <Stack.Screen name="subCategory2" component={subCategory2} options={{
      headerShown:false
    }} />
    <Stack.Screen name="editImage" component={EditImage} options={{
      headerShown:false
    }} />
    <Stack.Screen name="description" component={Description} options={{
      headerShown:false
    }} /> 
    <Stack.Screen name="stockDetails2" component={StockDetails2} options={{
      headerShown:false
    }} />

    <Stack.Screen name="onGoingJoblist" component={onGoingJobList} options={{
      headerShown:false
   }} />
   <Stack.Screen name="showsPdf" component={WebView} options={{
     headerShown:false
   }} />
   <Stack.Screen name="content" component={Content} options={{
     headerShown:false
   }} />
   <Stack.Screen name="subCat2" component={subCat2} options={{
     headerShown:false
   }} />
   <Stack.Screen name="passwordUpdate" component={PasswordUpdate} options={{
     headerShown:false
   }} />
   <Stack.Screen name="seeOnYourWall" component={SeeOnyourWall} options={{
     headerShown:false
   }}/>

   <Stack.Screen name="StockEnquery2" component={StockEnquery2} options={{
     headerShown:false
   }} />
   <Stack.Screen name="onGoingJob" component={OnGoingJob} options={{
     headerShown:false
   }} />
  <Stack.Screen name="enqueryDetails" component={StockEnqueryDetails} options={{
    headerShown:false
     
  }} />
  <Stack.Screen name="tracker" component={JobTracker} options={{
    headerShown:false
  }} />
  <Stack.Screen name="messaging" component={Messaging} options={{
    headerShown:false
  }} />
 
  <Stack.Screen name="changePassword" component={UpdatePassword} options={{
    headerShown:false
  }} />

  <Stack.Screen name="searchComponent" component={SearchComponent} options={{
    headerShown:false
  }} />
  <Stack.Screen name="postViewJob" component={PreviewJobView} options={{
    headerShown:false
  }} />
        </Stack.Navigator>
   

      </NavigationContainer>
    )
  }
}
       

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
