import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity,Image, Text,StatusBar } from 'react-native';



const labels = ["Choose quality paper","choose design","define size","Submit info","we print it"];



const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize:20,
    separatorStrokeWidth: 2,
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
    labelSize:13 ,
    labelAlign:'center',
    currentStepLabelColor: '#fe7013',

  }

export default class StepGuid extends Component{

constructor(props){
    super(props);

    this.state = {
        position : 0,
        data:"",
        guidState:""
    }
}

componentDidMount(){
   this.setState({
       data:this.props.route.params.stocks
   });

  

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
    render(){
       
        return(
            <View style={{
                flex:1,
                backgroundColor:"#eceff1"
            }} >
        <StatusBar barStyle="light-content" backgroundColor="#62463e" />
       <View style={{
           flex:1,
           justifyContent:'center',
           backgroundColor: 'rgba(0,0,0,.6)'
        //    alignItems:'center'
       }} >
            <StepIndicator
        onPress={(position) => this.onPageChange(position)}
         customStyles={customStyles}
         currentPosition={this.state.position}
         labels={labels}
    />
       </View>
            </View>
        )
    }
 
}