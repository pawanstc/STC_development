import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, StatusBar, TextInput,PermissionsAndroid,Button ,ScrollView, Alert, AsyncStorage } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import ImgToBase64 from 'react-native-image-base64'
import AudioRecord from 'react-native-audio-record';





import SoundRecorder from 'react-native-sound-recorder';

import Textarea from 'react-native-textarea';

import NetInfo from "@react-native-community/netinfo";
import DropDownPicker from 'react-native-dropdown-picker';
import {URL} from '../api.js';


import Sound from 'react-native-sound';
import {Picker} from '@react-native-picker/picker';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
import { PickerItem } from 'react-native/Libraries/Components/Picker/Picker';



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
			visible:false,
			papper_list:[],
			mediaType:"",
			paperType:[],
			selectPaper:"",
			desc:"",
			user_id:"",
			filename:"",
			pattern_url:""
		}


	}

	componentDidMount() {
		this.getSheet();
		
		this.state.pattern_url= this.props.route.params.patternUrl.replace(/^.*\/\/[^\/]/,'/b');
console.log(this.state.pattern_url);
		
		


		AsyncStorage.getItem("user_id")
		.then(result =>{
			this.setState({
				user_id:result
			})
		}).catch(error =>{
			console.log(error);
		})
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

	getSheet = ()=>{
		NetInfo.fetch().then(state =>{
			if(state.isConnected){
				fetch(URL+"/get_sheet_list",{
					headers:{
						"Content-Type":"application/x-www-form-urlencoded"
					},
					method:"GET",

				}).then(response => response.json())
				.then(result =>{
					if(result.error == false){
						this.setState({
							papper_list:result.sheet_list
						})
					}else{
						Alert.alert(
							"No data Found"
						);
					}
				}).catch(error =>{
					console.log(error);
				});
			}else{
				Alert.alert(
					"Network Error",
					"Please check Your Internet connection"
				)
			}
		})
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
					wavFile: 'voice1.wav' // default 'audio.wav'
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
	// store temp audio file recorde 
	AudioRecord.on('data', data => {
		console.log(data);
	  });

		this.setState({
			recodePlayButtonStat: false,
			recordedFile:audioFile
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
		console.log(this.sound);
		console.log("another1")
		console.log(this.sound._filename)
		console.log(this.sound._filename.split('.').pop())
		console.log(this.sound._filename.replace(/^.*[\\\/]/, ''))
		this.setState({
			playButtonStat: true
		});
	
		if (this.sound == null ) {
			alert("Please record first");
			this.setState({
				playButtonStat:false
			})
		} else {
			this.sound.play(success => {
				if (success) {
					console.log(success);
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

	selectPaperType = (value) =>{


		this.setState({
			mediaType:value,
			paperType:[]
		})
		fetch(URL+"/get_paper_details_by_id",{
			headers:{
				"Content-Type":"application/x-www-form-urlencoded"
			},
			method:"POST",
			body:"id="+ value
		}).then(response => response.json())
		.then(result =>{
			if(result.error == false){
				this.setState({
					paperType:result.paper_list,
					
				});
			}
		}).catch(error =>{
			console.log(error);
		})
	}

	submit = () =>{
		if (this.sound){
		var formData= new FormData()
		formData.append("file",{
			uri:this.sound._filename,
			type:'file/'+this.sound._filename.split('.').pop(),
			name:this.sound._filename.replace(/^.*[\\\/]/, '')
		  })

		  var xhr = new XMLHttpRequest();

		  xhr.open("POST","https://stcapp.stcwallpaper.com/audio.php");
		  xhr.setRequestHeader("Content-Type","multipart/form-data");
		  xhr.send(formData);
		  console.log(xhr.responseText)
		  console.log(xhr.responseURL)
		}

	
	 if(this.state.desc ==""){
		Alert.alert(
			"Validation Error",
			"Please enter your job  description"
		);

		return;
	}else if(this.state.selectPaper ==""){
		Alert.alert(
			"Validation Error",
			"Please Select Print type"
		);

		return;
	}else if(this.state.mediaType ==""){
		Alert.alert(
			"Validation Error",
			"Please Select Media Type Paper"
		);

		return;
	}else if(this.state.desc.length < 10){
		Alert.alert(
			"Validation Error",
			"Minimum 10 characters required in the description."
		);

		return;
	}else{

  
	if(this.props.route.params.imge_flag == 1){
	//console.log("pateern url")
	//console.log(this.props.route.params.patternUrl.replace(/^.*\/\/[^\/]+/, ''));
	// return;

		/*var form = new URLSearchParams();
		form.append('catlog_sub_category_id',this.props.route.params.image_id)
		form.append('width',this.props.route.params.width)
		form.append('height',this.props.route.params.height)
		form.append('quantity',this.props.route.params.quantity)
		form.append('description',this.state.desc)
		form.append('media_sheet_type_id',this.state.mediaType)
		form.append('paper_type_id',this.state.selectPaper)
		form.append('order_by_user_id',this.state.user_id)
		form.append('support_image_list',JSON.stringify(this.props.route.params.supportImages))
		form.append('pattern_image_url',this.props.route.params.patternUrl.replace(/^.*\/\/[^\/]+/, ''))
		form.append('img_flag',this.props.route.params.imge_flag)
		//console.log(JSON.stringify(form))*/
		
		
		fetch(URL+"/insert_post_job_order",{
			headers:{
				"Content-Type":"application/x-www-form-urlencoded"
			},
			method:"POST",
			body:"catlog_sub_category_id="+this.props.route.params.image_id+ "&width="+ this.props.route.params.width+"&height="+ this.props.route.params.height+ "&quantity="+ this.props.route.params.quantity+ "&description="+ this.state.desc+ "&media_sheet_type_id="+
			this.state.mediaType+ "&paper_type_id="+ this.state.selectPaper+ "&order_by_user_id="+ this.state.user_id+ "&support_image_list="+JSON.stringify(this.props.route.params.supportImages)+"&pattern_image_url="+ this.state.pattern_url+"&img_flag="+ this.props.route.params.imge_flag+"&audio_url= "
			
		}).then(response => response.json())
		.then(result =>{
			console.log(result)
			if(result.error==false){
			
				Alert.alert(
					"Success Message",
					"Your job is successfully submitted."
				);
				this.props.navigation.reset({
					index:0,
					routes:[
						{name:"home"}
					]
				});
			}
		}).catch(error =>{
			console.log(error)
		});
	}else if(this.props.route.params.imge_flag == 2){
	
	console.log(this.props.route.params.fileObj.path);

		fetch(URL+"/insert_post_job_order",{
			headers:{
				"Content-Type":"application/x-www-form-urlencoded"
			},
			method:"POST",
			body:"catlog_sub_category_id="+this.props.route.params.image_id+ "&width="+ this.props.route.params.width+"&height="+ this.props.route.params.height+ "&quantity="+ this.props.route.params.quantity+ "&description="+ this.state.desc+ "&media_sheet_type_id="+
			this.state.mediaType+ "&paper_type_id="+ this.state.selectPaper+ "&order_by_user_id="+ this.state.user_id+ "&support_image_list="+
			JSON.stringify(this.props.route.params.supportImages)+"&pattern_image_url="+ this.props.route.params.fileObj.path+"&img_flag="+ this.props.route.params.imge_flag
		}).then(response => response.json())
		.then(result =>{
			console.log(result);
			if(result.error == false){
				
				Alert.alert(
					"Success Message",
					"Your job is successfully submitted."
				);

				this.props.navigation.reset({
					index:0,
					routes:[
						{name:"home"}
					]
				});
			}
		}).catch(error =>{
			console.log(error)
		});
	}
		
	}
	}


	render(){
		return(
			<View style={{
				flex:1
			}} >
				<View style={{
				flex:1,
				alignItems:'center'
			}} >
				<StatusBar barStyle="light-content" backgroundColor="#62463e" />
				<View style={{
					height: 170,
					width: Dimensions.get("screen").width,
					backgroundColor: "#62463e",
					borderBottomLeftRadius: 18,
					borderBottomRightRadius: 18,
					flexDirection:"row",
					justifyContent:'space-between'
				}} >
					<Icons name="arrow-back" onPress={() => this.props.navigation.goBack(null)} color="#FFF" size={18} style={{
						margin:18
					}} />
					<Text style={{
						fontSize: 18,
						margin: 20,
						color:"#FFF",
				
					}} >Post Job </Text>

					<View style={{
						height:50,
						width:50
					}} />
				</View>

				<View style={{
					height: Dimensions.get("screen").height +500,
					width: Dimensions.get("screen").width - 45,
					position: "absolute",
					top: 75,
					left: 24,
					right: 24,
					backgroundColor: "#FFF",
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					flex:0.5,
	

					
				}} >
			<ScrollView
				contentContainerStyle={{
					paddingBottom:160
				}}
			>

			<Text style={{
					fontSize:16,
					margin:20,
					fontWeight:"200",
					marginLeft:22,
					marginBottom:0
				}} >Description</Text>
				 <Textarea
				 maxLength={160}
				 onChangeText={(value) => this.setState({
					 desc:value
				 })}
    containerStyle={{
		height:200,
		width:"88%",
		borderWidth:0.3,
		margin:20
	}}
    maxLength={120}
    placeholder={' Write a description for supporting image'}
    placeholderTextColor={'#c7c7c7'}
    underlineColorAndroid={'transparent'}
  />
					<View style={{
						flexDirection: "row",
						marginTop: 10,
						borderBottomWidth:0.2

					}} >
						<Text style={{
							margin:15,
							fontSize: 16,
							fontWeight: "200",
							marginLeft:24,
							marginTop:18
						}} >Recorder Voice </Text>
						{
							this.state.playButtonStat ? (
								<View style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									backgroundColor: "grey",
									marginTop: 10,
									justifyContent:"center",
									
								}} >
										<Icons name="pause" style={{
									margin:8
								}} color="#FFF" size={25} onPress={() => this.stopSound()} />
							</View>
							): (
								<View style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									backgroundColor: "grey",
										marginTop: 10,
									justifyContent:'center'
								}} >
										<Icons name="play" style={{
									margin:8
								}} color="#FFF" size={25}  onPress={() => this.playSound()} />
							</View>
							)
						}
						{
							this.state.recodePlayButtonStat ? (
								<View style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									backgroundColor: "green",
									justifyContent: "center",
									alignItems: 'center',
									marginLeft: 12,
									marginTop:10,
									marginBottom:20
								}} >
									<Icons name="stop-circle" style={{
									margin:8
								}} color="#FFF" size={25} onPress={() => this.stopRecorde()}  />
		
								</View>
							): (
								<View style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									backgroundColor: "green",
									justifyContent: "center",
									alignItems: 'center',
									marginLeft: 12,
									marginTop:10,
									marginBottom:20
								}} >
									<Icons name="mic" style={{
									margin:8
								}} color="#FFF" size={25} onPress={() => this.startRecorde()}  />
		
								</View>
							)
						}
						<View style={{
							height: 40,
							width: 40,
							borderRadius: 20,
							backgroundColor: "grey",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 10,
							marginLeft:12
						}} >
							<Icon name="x" onPress={() => {
								if(this.sound == null){
									alert("Please record first")
								}else{

								Alert.alert(
									"Confirmation Alert",
									"Do you really want to delete your recorded audio?",
									[
										{
											text:"Ok",
											onPress:  () => {
												 this.sound = null;
												alert("Deleted successfully")
											},
											style:"default"
										},
										{
											text:"Cancel",
											onPress: () => null,
											style:"cancel"
										}
									]
								)
									// this.sound.release()
									
								}
							}} size={25} color="#FFF" style={{
								margin:8
							}} />

						</View>

					</View>
					<View style={{
						flexDirection: "row",
						justifyContent: 'space-between',
						marginTop: 10,
						marginHorizontal:3
				}} >
					<Text style={{
						fontSize: 14,
							fontWeight: "100",
							marginTop:15,
							
						}} >Media Type Paper: </Text>
{/* 
<Picker
  style={{height: 50, width: 200,  borderWidth:0.3, borderColor:"black", borderRadius:6}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({language: itemValue})
  }>
 
							<Picker.Item label='A-VINYL PAPER BACK-PLAIN -45.5"' value="js" />
							<Picker.Item label='C-VINIL PAPER BACK-CANVAS TEXTURE -40.5"' value="js" />
							
</Picker> */}
<View style={{
	height:45,
	width:180,
	justifyContent:"center",
	alignItems:"center",
	borderWidth:0.5,
	
}} >
	<Picker 
	style={{height:50,width:180}}
	selectedValue={this.state.mediaType}
	onValueChange={(value) => this.selectPaperType(value)}
	>
		<Picker.Item label="Select Mediatype Paper" value=""  />
		{
			this.state.papper_list.map(value =>(
				<Picker.Item label={value.sheet_name.substring(0, 18)} value={value.id}  />
			))
		}

	</Picker>

</View>
				</View>

				<View style={{
						flexDirection: "row",
						justifyContent: 'space-between',
						marginTop: 10,
						marginHorizontal:2
				}} >
					<Text style={{
						fontSize: 14,
							fontWeight: "100",
							marginTop:15,
						
						}} >Print Type:     </Text>
{/* 
<Picker
  style={{height: 50, width: 200,  borderWidth:0.3, borderColor:"black", borderRadius:6}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({language: itemValue})
  }>
 
							<Picker.Item label='A-VINYL PAPER BACK-PLAIN -45.5"' value="js" />
							<Picker.Item label='C-VINIL PAPER BACK-CANVAS TEXTURE -40.5"' value="js" />
							
</Picker> */}
{
	this.state.paperType.length > 0 ? (
		<View style={{
			height:50,
			width:180,
			justifyContent:"center",
			alignItems:"center",
			borderWidth:0.5,
			
			
		}} >
			<Picker 
			style={{height:50,width:180}}
			selectedValue={this.state.selectPaper}
			onValueChange={(value) => this.setState({
				selectPaper:value
			})}
			>
				<Picker.Item label="Select Paper type" value=""  />
				{
					this.state.paperType.map(value =>(
						<Picker.Item label={value.paper_type_name} value={value.id}  />
					))
				}
		
			</Picker>
		
		</View>
	) :(
		<View style={{
			height:50,
			width:180,
			justifyContent:"center",
			alignItems:"center",
			borderWidth:0.5,
			
			
		}} >
			<Picker 
			style={{height:50,width:180}}
			
			onValueChange={(value) => this.setState({
				selectPaper:value
			})}
			>
				<Picker.Item label="Select Paper type" value=""  />
		
			</Picker>
		
		</View>
	)
}
				</View>

				<View style={{
					flexDirection:"row",
					justifyContent:"space-between"
				}} > 

				<View style={{
					justifyContent:"center"
				}} />

<View style={{
	justifyContent:"center",
	center:"center"
}} >
	{/* <TouchableOpacity onPress={() => this.setState({
					visible:true
				})} >
				<View style={{
					
					height:40,
				    width:260,
				    marginHorizontal:25,
					marginTop:45,
					borderRadius:10,
					backgroundColor:"#62463e",
					alignItems:'center',
					marginBottom:200
					
				}} >

				<Text style={{
					lineHeight:45,
					 fontSize:18,
					 color:"#FFF"
				}} >Submit</Text>

				</View>
				</TouchableOpacity> */}

</View>

				<View style={{
					height:40,
					width:10
				}} />

				</View>
	
  
			</ScrollView>

				</View>



			</View>

				<TouchableOpacity activeOpacity={0.9} onPress={() => this.submit()} >
					<View style={{
						height:50,
						width:Dimensions.get("screen").width,
						backgroundColor:"#62463e",
						justifyContent:"center",
						alignItems:'center'
					}} >
						<Text style={{
							textAlign:"center",
							color:"#FFF",
							fontSize:18
						}} >Submit</Text>

					</View>
				</TouchableOpacity>

			</View>
		)
	}
}