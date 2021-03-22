import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, StatusBar, TextInput,PermissionsAndroid } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';

import AudioRecord from 'react-native-audio-record';


import Sound from 'react-native-sound';
import {Picker} from '@react-native-picker/picker';



export default class Recorder extends Component {
	sound = null;

	constructor(props) {
		super(props)

		this.state = {
			playButtonStat: false,
			recordeButtonStat: false,
			recordedFile: "",
			recodePlayButtonStat: false,
			recording: false,
			loaded: false,
			pause:false,
		}
	}

	componentDidMount() {
		
	}

	changePlayButtonStat1 = () => {
		this.setState({
			playButtonStat: true
		});
	}

	changePlayButtonStat2 = () => {
		this.setState({
			playButtonStat: false
		});
	}

	startRecorde = async () => {
	

		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,{
					title: "STC alert",
					message: "STC need your Mic permission request",
					buttonNutral: "Ask me latter",
					buttonPositive: "ok",
					buttonNegetive: "no"
				}
			);
			console.log(granted);

			if (granted === PermissionsAndroid.RESULTS.GRANTED) {

				this.setState({
					recodePlayButtonStat: true,
					recordedFile:""
				});
				console.log(this.state.recordedFile);
				const options = {
					sampleRate: 16000,  // default 44100
					channels: 1,        // 1 or 2, default 1
					bitsPerSample: 16,  // 8 or 16, default 16
					audioSource: 6,     // android only (see below)
					wavFile: 'voice1.mp3' // default 'audio.wav'
				};
				AudioRecord.init(options);
		 	 	AudioRecord.start();
			} else {
				alert("sorry");
			}
		} catch (error) {
			console.log(error);
		}
	}

	stopRecorde = async () => {
		
		let audioFile = await AudioRecord.stop();
		console.log(audioFile);
		this.setState({
			recodePlayButtonStat: false
		});

		this.sound = new Sound(audioFile, Sound.MAIN_BUNDLE, function (error) {
			if (error) {
				console.log(error);
			}
		})
		this.setState({
			recordedFile: audioFile,
			recording:false
		});

	}

	
	playSound =  () => {
		this.setState({
			playButtonStat: true
		});
	
		if (this.sound == null) {
			alert("invalid")
		} else {
			this.sound.play(success => {
				if (success) {
					console.log("audio play success");
					this.sound.getCurrentTime((seconds) => {
						if (seconds ) {
							console.log("recorde has finished");

							this.setState({
								playButtonStat: false
							});
						}
					});
				} else {
					console.log("fail to Play audio");
				}
			})
		}
		
	}

	stopSound = () => {
		this.setState({
			playButtonStat: false,
			recordeButtonStat:false
		});
		this.sound.pause();
	}

	
	render(){
		return(
			<View style={{
				flex:1,
			}} >
				<StatusBar barStyle="light-content" backgroundColor="#62463e" />
				<View style={{
					height: 170,
					width: Dimensions.get("screen").width,
					backgroundColor: "#62463e",
					borderBottomLeftRadius: 18,
					borderBottomRightRadius: 18,
					flexDirection:"row"
				}} >
					<Icons name="arrow-back" color="#FFF" size={18} style={{
						margin:18
					}} />
					<Text style={{
						fontSize: 18,
						margin: 20,
						color:"#FFF"
					}} >Desriptions </Text>
				</View>

				<View style={{
					height: Dimensions.get("screen").height,
					width: Dimensions.get("screen").width - 45,
					position: "absolute",
					top: 75,
					left: 24,
					right: 24,
					backgroundColor: "#FFF",
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					alignItems:"center"
				}} >
					<TextInput
						 multiline={true}
						placeholder="Enter your Description"
					style={{
						height: 200,
						width: 250,
						borderWidth:0.3,
						borderColor: "black",
						marginTop: 40,
						textAlign:"center"
					}}
					/>
					<View style={{
						flexDirection: "row",
						marginTop: 25,
						justifyContent: 'space-between',

					}} >
						<Text style={{
							margin: 12,
							fontSize: 16,
							fontWeight: "200",
							marginRight:75
						}} >Recorder Voice </Text>
						{
							this.state.playButtonStat ? (
								<View style={{
									height: 30,
									width: 30,
									borderRadius: 15,
									backgroundColor: "grey",
									marginTop: 10,
									justifyContent:"center"
								}} >
										<Icons name="pause" style={{
									margin:8
								}} color="#FFF" size={15} onPress={() => this.stopSound()} />
							</View>
							): (
								<View style={{
									height: 30,
									width: 30,
									borderRadius: 15,
									backgroundColor: "grey",
										marginTop: 10,
									justifyContent:'center'
								}} >
										<Icons name="play" style={{
									margin:8
								}} color="#FFF" size={15}  onPress={() => this.playSound()} />
							</View>
							)
						}
						{
							this.state.recodePlayButtonStat ? (
								<View style={{
									height: 30,
									width: 30,
									borderRadius: 15,
									backgroundColor: "green",
									justifyContent: "center",
									alignItems: 'center',
									marginLeft: 12,
									marginTop:10
								}} >
									<Icons name="stop-circle" style={{
									margin:8
								}} color="#FFF" size={15} onPress={() => this.stopRecorde()}  />
		
								</View>
							): (
								<View style={{
									height: 30,
									width: 30,
									borderRadius: 15,
									backgroundColor: "green",
									justifyContent: "center",
									alignItems: 'center',
									marginLeft: 12,
									marginTop:10
								}} >
									<Icons name="mic" style={{
									margin:8
								}} color="#FFF" size={15} onPress={() => this.startRecorde()}  />
		
								</View>
							)
						}
						<View style={{
							height: 30,
							width: 30,
							borderRadius: 15,
							backgroundColor: "grey",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 10,
							marginLeft:12
						}} >
							<Icon name="x" onPress={() => this.sound.release()} size={15} color="#FFF" style={{
								margin:8
							}} />

						</View>

					</View>
					<View style={{
						flexDirection: "row",
						justifyContent: 'space-between',
						marginTop: 40,
						borderTopWidth: 0.5,
						width:Dimensions.get("screen").width
				}} >
					<Text style={{
						fontSize: 16,
							fontWeight: "100",
							marginTop: 10,
						margin:25
						}} >Select Paper</Text>

<Picker
  style={{height: 50, width: 200, textAlign:'center', borderWidth:0.3, borderRadius:6}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({language: itemValue})
  }>
  <Picker.Item label="Paper1" value="java" />
							<Picker.Item label="Paper2" value="js" />
							<Picker.Item label="Paper2" value="js" />
							<Picker.Item label="Paper2" value="js" />
							<Picker.Item label="Paper2" value="js" />
</Picker>
				</View>

				</View>

			</View>
		)
	}
}