import React, { Component  } from 'react';

import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, StatusBar, FlatList, Alert, AsyncStorage	 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Transition, Transitioning } from 'react-native-reanimated';
import IconName from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import {URL, imageUrl} from '../api.js';
import moment from "moment";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';

const transition = () =>{
	<Transition.Together>
		<Transition.In type="fade" durationMs={300} />
		<Transition.Change />
		<Transition.Out type="fade" durationMs={300} />
	</Transition.Together>
}


export default class onGoingJobList extends Component{

	constructor(props){
		super(props);
	
		this.state = {
			jobList_rev:[],
			jobList:[],
			jobPreview_by_id:"",
			current_index:null,
			isModelShow:false,
			jonPreviewImage:"",
			jobPreview_order_id:"",
			is_model_view:false,
			order_id:"",
			user_id:"",
		selected_id:"",
			confirm_data:[
				{
					label:"Details missing",
					value:"Details missing"
				},
				{
					label:"Non payment",
					value:"Non payment"
					
				},
				
			],
			job_id:'',
			user_role:"",
			
			desc:"Details missing", 
			job_status:"All Jobs",
			status:[
				{
					"id":"1",
					value:"All Jobs"
				},
				{
					"id":"2",
					"value":" In Progress"
				},
				{
					"id":"3",
					"value":"Completed"
				},
				{
					"id":"3",
					"value":"Cancel"
				}
			],
			deletedJob:[]
		}
	}

    componentDidMount(){
		this.getJobList();
	}
	
	set_job_view_by_id = () =>{

	}
getJobList = () =>{
	NetInfo.fetch().then(state =>{
		if(state.isConnected){
			AsyncStorage.getItem("user_id")
			.then(result =>{
				this.setState({
					user_id:result
				})
				console.log("user_id"+ result);
				fetch(URL+"/get_all_job_by_user_id",{
					headers:{
						"Content-Type":"application/x-www-form-urlencoded"
					},
					method:"POST",
					body:"user_id=" +result
				}).then(response => response.json())
				.then(result =>{
					console.log(result);
					let jobId = [];
					if(result.error ==false){
						result.order_details.forEach(element => {
							var tempObj ={
								id:element.id
							};
							jobId.push(tempObj);
						});
						
						this.setState({
							jobList:result.order_details,
							deletedJob:[...this.state.deletedJob, ...jobId],
							
						});
						
					
					}
				}).catch(error =>{
					console.log(error);
				})
			}).catch(error =>{	
				console.log(error);
			})
		}else{

		}
	})
}

cancelJob = (id) => {
	// check user role
	this.setState({
		order_id:id,
		selected_id:""
	})
	AsyncStorage.getItem("user_id")
	.then(result =>{
		if(result){
			this.setState({
				user_id:result
			})
			NetInfo.fetch().then(state =>{
				if(state.isConnected){
					fetch(URL+"/get_user_role_by_user_id",{
						headers:{
							"Content-Type":"application/x-www-form-urlencoded"
						},
						method:"POST",
						body:"user_id=" +result
					}).then(response => response.json())
					.then(result =>{
						
					this.setState({
						selected_id:id
					})
					this.setState({user_type:result.user_role_name})
						if(result.user_role_name === "Distributer"){
						
							
						
						
						
							this.setState({
								user_role:result.user_role_name,
								is_model_view:true,
						
							});
							
						}else{
							Alert.alert(
								"Confirmation",
								"Are You Sure to Cancel this job",
								[
									{
										text:"Cancel",
										onPress:() => null,
										style:"cancel"
									},
									{
										text:"Yes",
										onPress:() => this.doneCancle(),
										style:"default"
									}
								]
							)
						}
					}).catch(error =>{
						console.log(error);
					})
				}else{
					Alert.alert(
						"Network Error",
						"Please check Your Internet connection"

						
					)
				}
			})
		}else{

		}
	}).catch(error =>{
		console.log(error);
	})
}



doneCancle = () => {
	if(this.state.desc === ""){
		Alert.alert(
			"Validation Error",
			"Please Select one condition"
		);
		return;
	}
	NetInfo.fetch().then(state =>{
		if(state.isConnected){
			fetch(URL+"/order_Cancelled_status_by_order_id",{
				headers:{
					"Content-Type":"application/x-www-form-urlencoded"
				},
				method:"POST",
				body:"order_id=" +this.state.order_id+ "&user_id="+ this.state.user_id+ "&created_by_ip="+"1.1.1.1"+"&description="+ this.state.desc
			}).then(response => response.json())
			.then(result =>{
				console.log(result);

				if(result.length == 0){
					this.setState({
						is_model_view:false
					});

					Alert.alert(
						"Success",
						"Order Cancled succesfully"
					)
					setTimeout(() =>{
						this.setState({
							job_status:"Cancel"
						})
					}, 1200)
				}else{
					Alert.alert(
						"Error",
						"Order Cancel not success"
					)
				}
			}).catch(error =>{
				console.log(error);
			})
		}else{
			Alert.alert(
				"Network Error",
				"Please check Your Internet connection"
			)
		}
	})
}

	check_job_view = (id) =>{
		if(id === this.state.jobPreview_by_id){
			return true
		}else{
			return false
		}
	}

	JobPreview = (image, order_id) =>{
		console.log(order_id);
		this.setState({
			isModelShow:true,
			jonPreviewImage:image,
			jobPreview_order_id:order_id
		})
	}

checkJobStatus = (value) =>{
	console.log(value)
	if(value === this.state.job_status){
		return true;
	}else{
		return false;
	}
}

setStatus = (value) =>{
	
	this.setState({
		job_status:value,
		jobList:[]
	})

	if(value === " In Progress"){
	
		NetInfo.fetch().then(state =>{
			if(state.isConnected){
				AsyncStorage.getItem("user_id")
				 .then(result =>{
				 	if(result){
				 		this.setState({
				 			user_id:result
				 		})

				 		fetch(URL+"/get_inprogress_job_by_user_id",{
					headers:{
						 "Content-Type":"application/x-www-form-urlencoded"
					},
					method:"POST",
					body:"user_id="+ this.state.user_id
				}).then(response => response.json() )
				 		.then(result =>{
				 			console.log(result)
							
				 			if(result.error == false){

								

				 				this.setState({
				 					jobList:result.order_details
				 				})
				 			}else{
				 				this.setState({
				 					jobList:[]
				 				})
				 			}
				 		}).catch(error =>{
				 			console.log(error);
				 		});
				 	}
				 })
			}else{
				Alert.alert(
					"Network Error",
					"Please check your internet connection"
				)
			}
		})
	}else if(value === "Completed"){
		this.setState({
			
			jobList:[]
		})
		NetInfo.fetch().then(state =>{
			if(state.isConnected){
				AsyncStorage.getItem("user_id")
				 .then(result =>{
				 	if(result){
				 		this.setState({
				 			user_id:result
				 		})

				 		fetch(URL+"/get_completed_job_by_user_id",{
					headers:{
						 "Content-Type":"application/x-www-form-urlencoded"
					},
					method:"POST",
					body:"user_id="+ this.state.user_id
				}).then(response => response.json() )
				 		.then(result =>{
				 			console.log(result)
							 
				 			if(result.error == false){

								

				 				this.setState({
				 					jobList:result.order_details
				 				})
				 			}else{
				 				this.setState({
				 					jobList:[]
				 				})
				 			}
				 		}).catch(error =>{
				 			console.log(error);
				 		});
				 	}
				 })
			}else{
				Alert.alert(
					"Network Error",
					"Please check your internet connection"
				)
			}
		})
	}else if(value === "Cancel"){
		
		this.setState({
			
			jobList:[]
		})

		NetInfo.fetch().then(state =>{
			if(state.isConnected){
				AsyncStorage.getItem("user_id")
				 .then(result =>{
				 	if(result){
				 		this.setState({
				 			user_id:result
				 		})

				 		fetch(URL+"/get_cancelled_job_by_user_id",{
					headers:{
						 "Content-Type":"application/x-www-form-urlencoded"
					},
					method:"POST",
					body:"user_id="+ this.state.user_id
				}).then(response => response.json() )
				 		.then(result =>{
				 			console.log(result)
				 			if(result.error == false){
				 				this.setState({
				 					jobList:result.order_details
				 				})
				 			}else if(result.error == false && result.order_details ==""){
				 				this.setState({
				 					jobList:[]
				 				})
				 			}
				 		}).catch(error =>{
				 			console.log(error);
				 		});
				 	}
				 })
			}else{
				Alert.alert(
					"Network Error",
					"Please check your internet connection"
				)
			}
		})
	}else{
	
		this.getJobList();
	}

	
}
    render(){
		console.log(this.state.deletedJob);
		
        return(
			<View style={{
				flex:1
			}} >
				<View style={{
					flex:1
				}} >

				<Transitioning.View
			transition={transition}
			
			style={{
              
                flex:1
            }} >
              <View style={{
				  height:170,
				  width:Dimensions.get("screen").width,
				  backgroundColor:"#62463e",
				  borderBottomLeftRadius:20,
				  borderBottomRightRadius:20,
				  flexDirection:"row",
				  justifyContent:'space-between'
			  }} >
				 <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)} >
				 <Icon name="arrow-back" size={18} color="#FFF" style={{
					  margin:20
				  }} />
				 </TouchableOpacity>
				  <Text style={{
					  textAlign:"center",
					  color:"#FFF",
					  fontSize:18,
					  margin:20
				  }} >{ this.state.job_status }</Text>
				  <View style={{
					  height:50,
					  width:50
				  }} >

				  </View>

			  </View>

			  <View style={{
				  height:Dimensions.get("screen").height,
				  width:Dimensions.get("screen").width -45,
				  backgroundColor:"#FFF",
				  borderTopLeftRadius:20,
				  borderTopRightRadius:20,
				  position:"absolute",
				  top:75,
				  left:24,
				  right:24,
				  zIndex:1,
				  elevation:10
				 
			  }} >
				{
					this.state.jobList.length >0 ? (
						<View>
							<FlatList 
						data={this.state.jobList}
						contentContainerStyle={{
							paddingBottom:200,
							
						}}
					   showsVerticalScrollIndicator={false}
						renderItem={(items, index) =>{
							console.log(items.item.support_image.image_details);
							return(
								<View style={{
									justifyContent:"center",
									alignItems:'center',
									marginTop:15,
									
								}} >
									<View style={{
								   flexGrow:1,
								   width:Dimensions.get("screen").width *0.74,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
									borderRadius:8,
									backgroundColor:"#FFF",
									elevation:10,
									marginBottom:20,
									zIndex:0,
					
								}} >
								   <View style={{
									   padding:10,
									   borderBottomWidth:0.5,
   
								   }} >
										<Text style={{
									   fontSize:14,
									   fontWeight:"normal", 
									   padding:4
									}} > Job id:   {items.item.order_id}</Text>
									<Text style={{
										color:"#ff9800",
										fontSize:14,
										fontWeight:"bold",
										padding:2
									}} >{  moment(items.item.date_time).format("MMMM Do YYYY, h:mm:ss a") }</Text>
								   
								   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Pattern Number :</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:4
								   }} >{ items.item.pattern_no }</Text>
   
									   </View>
   
									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Distributer:</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:4,
									   paddingLeft:30
								   }} >{ items.item.parent_first_name } {items.item.parent_last_name}</Text>
   
									   </View>
   
									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Dealer       :</Text>

								   {
								     items.item.first_name  && items.item.last_name ? (
								   		<Text style={{
									   fontSize:12,
									   paddingLeft:30,
									   
									   padding:4
								   }} >{ items.item.first_name } { items.item.last_name }</Text>
								   	) :(
								   	<Text style={{
									   fontSize:12,
									   
									   padding:4,
									    paddingLeft:33,
								   }} >N/A</Text>
								   	)
								   }
								   
   
									   </View>
   
									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >quantity    :</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:4,
									   paddingLeft:33
								   }} >{ items.item.quantity }</Text>
   
									   </View>

									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Allocated To    :</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:12
								   }} >Sales Coordinator</Text>
   
									   </View>

									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Wall Size    :</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:4,
									   paddingLeft:27
								   }} >{ items.item.wall_size }</Text>
   
									   </View>

									   <View style={{
									   flexDirection:"row",
   
								   }} >
									   <Text style={{
									   fontSize:12,
									   color:"grey",
									   padding:4
								   }} >Media    :</Text>
								   <Text style={{
									   fontSize:12,
									   
									   padding:4,
									   paddingLeft:40,
									   width:200,
									   lineHeight:20
								   }} >{ items.item.media }</Text>
   
									   </View>
   
   
									   </View>
									   <TouchableOpacity activeOpacity={0.5} onPress = {() =>{
											   
											   this.setState({
												   current_index: this.state.current_index === items.item.id ? null : items.item.id
											   })
									   }} >
									   <Text style={{
								   textAlign:"center",
								   color:"blue",
								   marginTop:10,
								   fontWeight:"bold",
								   marginBottom:20
								   
							   }} >View Details</Text>
									   </TouchableOpacity>
   
									   { 
										   this.state.current_index === items.item.id ? (
											   <View>
												   <View style={{
												   borderBottomWidth:0.5,
												   marginTop:12
											   }} />
		   
											   
												   
		   
												   <View style={{
													   flexDirection:"row",
													   alignItems:'center',
													   justifyContent:"space-around",
													   marginTop:20
												   }} >
													  <TouchableOpacity activeOpacity={2} onPress={() =>this.props.navigation.navigate("postViewJob",{
														  pattern_number:items.item.pattern_no,
														  order_image:items.item.pattern_image_url,
														  supportive_image:items.item.support_image.image_details,
														  button_show:items.item.button_show,
														  order_id:items.item.id,
														  ordered_by:items.item.order_by_user_id
														  
														  
													  }) } >
													  <View style={{
													   justifyContent:'center',
												   
													   alignItems:'center'
												   }} >
													   <Icon name="attach-outline" style={{
														   margin:10,
													   
													   }} size={20} />
													   <Text style={{
														   fontSize:15,
														   marginLeft:20
													   }}>Preview Job</Text>
   
													   </View>
													  </TouchableOpacity>
												   
													  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("messaging",{
														  order_id:items.item.id,
														  show_id_order:items.item.order_id
													  }) } >
															 <View style={{
													   justifyContent:'center',
													   alignItems:'center'
												   }} >
													   <Icon name="calendar-outline" style={{
														   margin:10
													   }} size={20} />
													   <Text style={{
														   fontSize:15
													   }}> View Message</Text>
   
													   </View>
													  </TouchableOpacity>
   
													   </View>
   
   
													   <View style={{
													   flexDirection:"row",
													   alignItems:'center',
													   justifyContent:"space-around",
													   marginTop:25,
													   marginBottom:30
												   }} >
													  <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.navigate("tracker",{
														  order_id:items.item.id
													  })}  >
													  <View style={{
													   justifyContent:'center',
													 alignItems:'center',
										   
												   }} >
													   <Icon name="refresh-outline" style={{
														   margin:10
													   }} size={20} />
													   <Text style={{
														   fontSize:15,
												   
													   }}> View Histroy</Text>
   
													   </View>
													  </TouchableOpacity>
   
													  <TouchableOpacity onPress={() => this.cancelJob(items.item.id)} >
															<View style={{
															 justifyContent:'center',
															 alignItems:'center'
														 }} >
															 <IconName name="ban" style={{
																 margin:10
															 }} size={20} />
															 <Text style={{
																 fontSize:15
															 }}> Cancel Job</Text>
		 
															 </View>
		 
															</TouchableOpacity>
													   </View>
												   </View>
										   ) :null
									   }
									</View>
									
									</View  > 
							)
						}}
						keyExtractor={(item) => item.id}
					/>
					<View style={{
						height:50
					}} />
							</View>
					) :(
						<View style={{
							justifyContent:'center',
							alignitems:"center",
							flex:0.6
						}} >
						<Text style={{
							textAlign:'center',
							fontSize:18,
							
						}} >No Job Found</Text>

						</View>
					)
				}

			  </View>
     
            </Transitioning.View>

				</View>

				<View style={{
			 flexDirection:"row",
			 justifyContent:"space-between",
			 alignitems:'center',
			 backgroundColor:"#FFF",
			 height:50,
			 width:Dimensions.get("screen").width,
			 elevation:3,
			 borderTopWidth:0.3,
			 borderTopColor:"#eeee"
		 }} >
			
 {
 	this.state.status.map(value =>{
 		return(

 			<View style={{
 				flexDirection:"row",
 				justifyContent:"space-between"
 			}} >
 			{
 				this.checkJobStatus(value.value) ? (
 					<View >
 					<TouchableOpacity activeOpacity={2} onPress={() => this.setStatus(value.value)} >  
			<Text style={{
				 textAlign:"center",
				 padding:15,
				 color:"#FFF",
				 backgroundColor:"#62463e"
			 }} >{ value.value }</Text>
			 <View style={{
			 	borderBottomWidth:1,
			 	borderBottomColor:"red"
			 }} />
			</TouchableOpacity>

 					</View>
 				) :(
 					<View>
 					<TouchableOpacity activeOpacity={2} onPress={() => this.setStatus(value.value)} >  
			<Text style={{
				 textAlign:"center",
				 padding:15
			 }} >{ value.value }</Text>
			</TouchableOpacity>
 					</View>
 				)
 			}


 			</View>
 		)
 	})
 }

		 </View>

		 

  <Modal
  style={{
	  height:400
  }}
	 deviceHeight={ Dimensions.get("screen").height  }
  isVisible={ this.state.is_model_view } >
  <View style={{

justifyContent:"center",
alignItems:'center',
backgroundColor:"#FFFF",
}} >
<View style={{
 
 alignitems:'center',
 justifyContent:"center"

}} >

<View style={{
 flexDirection:"row",
 justifyContent:"space-between"
}} >
<View style={{
 height:10,
 width:130
}} />

<TouchableOpacity onPress={() => this.setState({
is_model_view:false
})} style={{

marginBottom:10
}} >
<Icon name="close-outline" size={25} color="black" />
</TouchableOpacity>

</View>
 <Text style={{
	 textAlign:"center",
	 fontSize:18,
	 fontWeight:"bold",
	 marginTop:18
 }} >Why do you want to cancel this job?
 </Text>
<View style={{
marginHorizontal:30,
marginTop:30
}} >
<RadioForm
radio_props={this.state.confirm_data}
initial={0}
value={this.state.confirm_data[0].value}
formHorizontal={false}
labelHorizontal={false}
buttonColor={'#2196f3'}
animation={true}
borderWidth={0.6}
 buttonInnerColor={'#e74c3c'}
 containerStyle={{
	 marginTop:20,

 }}

 buttonSize={7}
 buttonOuterSize={20}
 buttonStyle={{
	 margin:20,
	 marginTop:20
 }}
 buttonWrapStyle={{marginLeft: 0}}
onPress={(value) => this.setState({
desc:value
})}
/>
</View>

<TouchableOpacity style={{
alignItems:"center"
}} onPress={() => this.doneCancle()} activeOpacity={2}  >

<View style={{
height:40,
width:160,
backgroundColor:"red",
justifyContent:"center",
alignItems:"center",
marginTop:20, 
marginBottom:20
}} >
<Text style={{
   textAlign:"center",
   color:"#FFF",
   fontSize:16
}} >Confirm</Text>
</View>

</TouchableOpacity>

</View>

</View>
      </Modal>
			</View>
        )
    }
}