    import React, {Component} from 'react';

    import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Text,
    FlatList,
    Button,
    Alert,
    AsyncStorage,
    ScrollView,
    TextInput,
    } from 'react-native';
    import Icon from 'react-native-vector-icons/Feather';
    import Modal from 'react-native-modal';
    import Icons from 'react-native-vector-icons/Ionicons';
    import MIIcon from 'react-native-vector-icons/MaterialIcons';
    import trackPlayerService from './track_services';
    import {URL, imageUrl} from '../api';
    import NetInfo from '@react-native-community/netinfo';
    import {NetworkInfo} from 'react-native-network-info';
    import Sound from 'react-native-sound';
    import TrackPlayer from 'react-native-track-player';
    import Textarea from 'react-native-textarea';
    import { getImagesWithoutSize } from 'react-native-image-view/src/utils';
    import moment from 'moment';
    import {Picker} from '@react-native-picker/picker';
    import { getDayDateFormat } from './helper/utility';
    import { CustomModal } from './components';

    let urlsDomain = 'https://stcapp.stcwallpaper.com/';
    let {height, width} = Dimensions.get('screen');

    export default class postViewJob extends Component {
    constructor(props) {
    super(props);

    this.state = {
        pattern_number: this.props.route.params.pattern_number,
        order_image: this.props.route.params.order_image,
        supportive_image: this.props.route.params.supportive_image,
        //button_show:this.props.route.params.button_show,
        order_id: this.props.route.params.order_id,
        ordered_by: this.props.route.params.ordered_by,
        job_description: this.props.route.params.job_description,
        audio: this.props.route.params.audio,
        order_user_type: this.props.route.params.user_type,
        ip_address: '',
        prev_img: '',
        distributer_approve: '',
        dealer_approve: '',
        user_type: 'unknown',
        status: '',
        isDisabled: true,
        user_id: '',
        description: '',
        dist_only: false,
        prev_img_desc: '',
        isVisibleMediaTypeModal: false,
        isVisibleQtyModal: false,
        remark: 'No remarks',
        approve_action: false,
        dealer_remarks: '',
        distributer_remarks: '',
        remark_button: true,
        job_id: '',
        jobDetail: {},
        preview_images: [],
        previewImageApprovedByDelear: {},
        previewImageRejectedByDelear: {},
        previewImageApprovedByDistributor: {},
        previewImageRejectedByDistributor: {},
        paper_list: [],
        paperType: [],
        mediaType: '',
        selectedPaper: '',
        quantity: '',
    };
    }

    componentDidMount() {
        if (width > height) {
            let temp = width;
            width = height;
            height = temp;
        }
        if (this.state.order_user_type == 'Distributor')
            this.setState({dist_only: true});

        console.log(this.state.dist_only);
        TrackPlayer.setupPlayer().then(() => {
            console.log('player set');
        });
        TrackPlayer.registerPlaybackService(() => trackPlayerService);

        console.log(this.state.job_description);
        console.log('ordered by');
        console.log(this.state.ordered_by);
        AsyncStorage.getItem('user_id').then((result) => {
            NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                console.log('fetching');
                fetch(URL + '/get_user_details_by_user_id', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                body: 'user_id=' + result,
                })
                .then((response) => response.json())
                .then((result) => {
                    if (result) {
                    console.log(result);
                    //console.log(result.user_role_name)

                    this.setState({user_type: result.user_role_name});
                    console.log(this.state.user_type);
                    }
                });
            }
            });
        });

        console.log(this.state.user_type);
        NetworkInfo.getIPV4Address().then((ipv4Address) => {
            this.setState({
            ip_address: ipv4Address,
            });
        });

        AsyncStorage.getItem('user_id').then((result) =>
            this.setState({user_id: result}),
        );

        console.log(this.state.order_id);
        fetch(URL + '/get_latest_order_status_by_post_job_order_id', {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: 'post_job_order_id=' + this.state.order_id,
        })
            .then((response) => response.json())
            .then((result) => {
            console.log(result);
            console.log(result.status_details);
            let st = result.status_details;
            console.log(st);
            if (result) {
                this.setState({
                status: st[0].order_status_id,
                description: st[0].status_name,
                });
                console.log('helolo');
                console.log('h');
                console.log(this.state.status);
                this.get_prevImage();
            }
            })
            .catch((error) => console.log(error));

        this.getJobDetail()

        // get Preview images
        fetch(URL + '/get_all_previews_by_order_id', {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: 
                'order_id=' +
                this.state.order_id +
                '&role=' +
                this.state.user_type
        })
        .then((response) => response.json())
        .then((result) => {
            if (result) {
                console.log('result============>', result, this.state.order_id, this.state.user_type)
                const { preview_details } = result;
                if (preview_details && preview_details.length) {
                    let isApproveDisabled = false;
                    const previewImageApprovedByDelear = preview_details.filter(item => item.approved_by_dealer === 1);
                    const previewImageRejectedByDelear = preview_details.filter(item => item.approved_by_dealer === 2);
                    const previewImageApprovedByDistributor = preview_details.filter(item => item.approved_by_distributer === 1);
                    const previewImageRejectedByDistributor = preview_details.filter(item => item.approved_by_distributer === 2);

                    previewImageApprovedByDelear && previewImageApprovedByDelear.length && this.setState({ previewImageApprovedByDelear: previewImageApprovedByDelear[0] })
                    previewImageRejectedByDelear && previewImageRejectedByDelear.length && this.setState({ previewImageRejectedByDelear: previewImageRejectedByDelear[0] })
                    previewImageApprovedByDistributor && previewImageApprovedByDistributor.length && this.setState({ previewImageApprovedByDistributor: previewImageApprovedByDistributor[0] })
                    previewImageRejectedByDistributor && previewImageRejectedByDistributor.length && this.setState({ previewImageRejectedByDistributor: previewImageRejectedByDistributor[0] })
                }
                this.setState({ preview_images: preview_details });

            }
        })
        .catch((err) => console.log('error', err));
    }

    isEditableMediaType = (order_status_id) => {
        switch(order_status_id && order_status_id.toString()) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '6':
            case '8':
            case '9':
            case '10':
            case '11':
            case '12':
                return true;
            default: 
                return false;
        }
    }

    isEditableQuantity = (order_status_id) => {
        switch(order_status_id && order_status_id.toString()) {
            case '1':
            case '2':
            case '4':
            case '8':
            case '9':
            case '10':
            case '11':
            case '12':
            case '13':
                return true;
            default: 
                return false;
        }
    }

    getJobDetail = () => {
        fetch(URL + '/get_job_details_by_order_id', {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: 'post_job_order_id=' + this.state.order_id,
        })
        .then((response) => response.json())
        .then((result) => {
            if (result) {
                console.log('job Details===========>', result)
                this.setState({
                    distributer_remarks: result.distributor_preview_description,
                    dealer_remarks: result.dealer_preview_description,
                    job_id: result.order_id,
                    jobDetail: result,
                    mediaType: result.mediaTypeId,
                    selectedPaper: result.paperTypeId || '',
                    quantity: result.quantity
                });
                this.getPaperType(result.mediaTypeId)
            }
        })
        .catch((err) => console.log('error', err));
    }

    updateMediaType = () => {
        if (this.state.mediaType !== "" && this.state.selectedPaper !== "") {
            fetch(URL+"/change_media_by_order_id",{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body:"user_id="+
                    this.state.user_id+
                    "&order_id="+
                    this.state.order_id+
                    "&media_type="+
                    this.state.mediaType+
                    "&paper_type="+
                    this.state.selectedPaper
            }).then(response => response.json())
            .then(result =>{
                if(result.error == false){
                    this.setState({ isVisibleMediaTypeModal: false })
                    this.getJobDetail();
                    Alert.alert(
                        "Data updated successfully!"
                    );
                }
            }).catch(error =>{
                console.log(error);
            })
        } else {
            if (this.state.mediaType === "") {
                Alert.alert(
                    "Media type is required"
                );
            }
            if (this.state.selectedPaper === "") {
                Alert.alert(
                    "Paper type is required"
                );
            }
        }
    }

    updateQuantity = () => {
        if (this.state.quantity !== "") {
            const body = "order_id="+
            this.state.jobDetail.order_id+
            "&quantity="+
            this.state.quantity;

            fetch(URL+"/update_job_post_quantity_by_order_id",{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                method:"POST",
                body
            }).then(response => response.json())
            .then(result =>{
                if(result.error == false){
                    this.setState({ isVisibleQtyModal: false })
                    this.getJobDetail();
                    Alert.alert(
                        "Quantity updated successfully!"
                    );
                    this.props.navigation.navigate('onGoingJoblist', {});
                }
            }).catch(error =>{
                console.log(error);
            })
        } else {
            if (this.state.quantity === "") {
                Alert.alert(
                    "Quantity is required"
                );
            }
        }
    }

    getPaperType = (value) =>{
		fetch(URL+"/get_paper_details_by_id",{
			headers:{
				"Content-Type":"application/x-www-form-urlencoded"
			},
			method:"POST",
			body:"id="+ value
		}).then(response => response.json())
		.then(result =>{
			if(result.error == false){
                const list = [ {id: '', paper_type_name: 'Select' }, ...result.paper_list];
				this.setState({
					paperType: list,
					
				});
			}
		}).catch(error =>{
			console.log(error);
		})
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
							paper_list:result.sheet_list
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

    setOptions = () => {
    if (this.state.status && this.state.user_type) {
        switch (this.state.user_type) {
        case 'Dealer':
            switch (this.state.status) {
            case 9:
                this.setState({dealer_approve: ''});
                this.setState({distributer_approve: ''});
                this.setState({isDisabled: false});
                if (this.state.user_id == this.state.ordered_by)
                this.setState({isDisabled: false});
                else this.setState({isDisabled: true});
                break;

            case 10:
                this.setState({
                dealer_approve: 'Approved',
                distributer_approve: 'Pending',
                isDisabled: true,
                });
                console.log(this.state.dealer_approve);
                if (this.state.dist_only == true)
                this.setState({dealer_approve: ''});
                break;
            case 8:
                this.setState({
                dealer_approve: 'Approved',
                distributer_approve: 'Approved',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;
            case 11:
                this.setState({
                dealer_approve: 'Change/Reject Request',
                distributer_approve: 'Pending',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;
            case 12:
                this.setState({
                dealer_approve: 'Change/Reject Request',
                distributer_approve: 'Change/Reject Request',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
            default:
                this.setState({isDisabled: true});
                break;
            }
            break;
        case 'Distributor':
            switch (this.state.status) {
            case 9:
                this.setState({dealer_approve: ''});
                this.setState({distributer_approve: ''});
                this.setState({isDisabled: true});
                if (this.state.user_id == this.state.ordered_by)
                this.setState({isDisabled: false});
                break;
            case 10:
                this.setState({
                dealer_approve: 'Approved',
                distributer_approve: 'Pending',
                isDisabled: false,
                });
                if (this.state.user_id == this.state.ordered_by)
                this.setState({isDisabled: false});
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;
            case 8:
                this.setState({
                dealer_approve: 'Approved',
                distributer_approve: 'Approved',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;

            case 11:
                this.setState({
                dealer_approve: 'Change/Reject Request',
                distributer_approve: 'Pending',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;
            case 12:
                this.setState({
                dealer_approve: 'Change/Reject Request',
                distributer_approve: 'Change/Reject Request',
                isDisabled: true,
                });
                if (this.state.dist_only == true)
                this.setState({dealer_approve: null});
                break;
            default:
                this.setState({isDisabled: true});
                break;
            }

        default:
            break;
        }
    }
    };

    playSound = () => {
    console.log('audioUrl', this.state.audio);
    var url = this.state.audio;
    var url1 = 'https://stcapp.stcwallpaper.com/audio/audio-20210508151225.wav';
    url.toString();
    const track = {
        id: '1',
        url: url,
        title: 'audio',
        artist: 'new1',
    };
    TrackPlayer.add([track]).then(() => {
        TrackPlayer.play();
    });

    //SoundPlayer.loadUrl(url)
    //SoundPlayer.play()
    };

    pauseSound = () => {
    TrackPlayer.pause();
    };

    get_prevImage = () => {
    fetch(URL + '/get_approve_image_by_order_id', {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: 'post_job_order_id=' + this.state.order_id,
    })
        .then((response) => response.json())
        .then((result) => {
        if (result) {
            this.setState({
            prev_img: result.upload_image_url,
            prev_img_desc: result.description,
            });
            this.setOptions();
            console.log(this.state.prev_img);
        } else {
            Alert.alert('Failed', 'Failed to get preview image');
        }
        console.log(this.state.order_image);
        });
    };

    onPressGoBack(){
        this.props.navigation.goBack(null);
    }

    render() {
    return (
        <View
        style={{
            flex: 1,
        }}>
        
        <View
            style={{
            flex: 1,
            }}>
            <StatusBar barStyle="default" backgroundColor="#62463e" />
            <View
            style={{
                justifyContent: 'space-between',
                height: 170,
                width: width,
                backgroundColor: '#62463e',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                flexDirection: 'row',
            }}>
            <TouchableOpacity
                activeOpacity={2}
                onPress={() => this.onPressGoBack()}>
                <Icons
                name="arrow-back"
                style={{
                    margin: 20,
                }}
                size={18}
                color="#FFFF"
                />
            </TouchableOpacity>

            <Text
                style={{
                textAlign: 'center',
                fontSize: 18,
                color: '#FFF',
                margin: 20,
                }}>
                Preview Job
            </Text>
            <View
                style={{
                height: 40,
                width: 60,
                }}
            />
            </View>

            <View
            style={{
                height: height,
                width: width - 45,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: 'absolute',
                top: 70,
                left: 24,
                right: 24,
                backgroundColor: '#fff',
                flex: 1,
            }}>
            <ScrollView
                vertical={true}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{
                paddingBottom: 180,
                }}>
                <View style={{borderBottomWidth: 0.5, paddingBottom: 10}}>
                <Text
                    style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: '#62463e',
                    marginTop: 10,
                    }}>
                    Job id: {this.state.jobDetail.order_id}
                </Text>
                <Image
                    source={{
                    uri: imageUrl + '' + this.state.jobDetail.pattern_image_url,
                    }}
                    style={{
                    height: 240,
                    borderRadius: 4,
                    elevation: 5,
                    margin: 10,
                    }}
                />
                <Text
                    style={{fontSize: 16, color: 'grey', paddingHorizontal: 10}}>
                    {`Pattern: ` + this.state.jobDetail.pattern_no}
                </Text>
                </View>
                <View style={{borderBottomWidth: 0.5, paddingVertical: 10, paddingHorizontal: 5}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Status:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {this.state.jobDetail.status_name}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Order date:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {moment(this.state.jobDetail.date_time).format('LLL')}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Pattern Number:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {this.state.jobDetail.pattern_no}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Distributor:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {this.state.jobDetail.user_role_id && this.state.jobDetail.user_role_id.toString() === '2'
                        ? this.state.jobDetail.first_name +
                        ' ' +
                        this.state.jobDetail.last_name
                        : this.state.jobDetail.parent_first_name +
                        ' ' +
                        this.state.jobDetail.parent_last_name}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Dealer:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {this.state.jobDetail.user_role_id && this.state.jobDetail.user_role_id.toString() === '3'
                        ? this.state.jobDetail.first_name +
                        ' ' +
                        this.state.jobDetail.last_name
                        : 'N/A'}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                        Qty:
                        </Text>
                        <Text style={{fontSize: 12, padding: 4}}>
                        {this.state.quantity}
                        </Text>
                    </View>
                    {this.isEditableQuantity(this.state.jobDetail.order_status_id) ?
                        <TouchableOpacity
                            onPress={() => {
                                // this.getSheet();
                                this.setState({ isVisibleQtyModal: true });
                            }}
                            style={{
                                width: '20%',
                                marginRight: 8,
                                height: 25,
                                width: 25,
                                borderRadius: 15,
                                backgroundColor: '#62463e',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <MIIcon name="edit" color="white" size={15} />
                        </TouchableOpacity>
                    : null}
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Allocated to:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {'Sales Coordinator'}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                    Wall size:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                    {this.state.jobDetail.wall_size}
                    </Text>
                </View>
                <View
                    style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', width: '68%'}}>
                    <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                        Media type:
                    </Text>
                    <Text style={{fontSize: 12, padding: 4}}>
                        {this.state.jobDetail.media}
                    </Text>
                    </View>
                    {this.isEditableMediaType(this.state.jobDetail.order_status_id) ?
                        <TouchableOpacity
                            onPress={() => {
                                this.getSheet();
                                this.setState({ isVisibleMediaTypeModal: true });
                            }}
                            style={{
                                width: '20%',
                                marginRight: 8,
                                height: 25,
                                width: 25,
                                borderRadius: 15,
                                backgroundColor: '#62463e',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <MIIcon name="edit" color="white" size={15} />
                        </TouchableOpacity>
                    : null}
                </View>
                </View>
                <View style={{elevation: 2, marginBottom: 4}}>
                    <View
                        style={{
                        borderBottomWidth: 0.5,
                        }}>
                        <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 18,
                            color: '#62463e',
                            marginLeft: 10,
                            marginTop: 10,
                        }}>
                        Job Description:
                        </Text>

                        <Text
                        style={{
                            padding: 20,
                            fontSize: 16,
                            color: 'grey',
                            textAlign: 'left',
                        }}
                        selectable={true}>
                        {this.state.job_description}
                        </Text>
                    </View>

                    <Text
                        style={{
                        textAlign: 'left',
                        fontSize: 18,
                        color: '#62463e',
                        marginTop: 10,
                        marginLeft: 10,
                        }}>
                        Job Audio:
                    </Text>

                    <View>
                        {this.state.audio ? (
                        <View style={{flexDirection: 'row'}}>
                            <View style={{height: 50, width: 50}}>
                            <Icons
                                name="play"
                                style={{
                                height: 50,
                                width: 50,
                                marginTop: 10,
                                marginLeft: 20,
                                }}
                                color="blue"
                                size={40}
                                onPress={() => this.playSound()}
                            />
                            </View>

                            <View style={{height: 50, width: 50}}>
                            <Icons
                                name="pause"
                                style={{
                                height: 50,
                                width: 50,
                                marginTop: 10,
                                marginLeft: 20,
                                }}
                                color="blue"
                                size={40}
                                onPress={() => this.pauseSound()}
                            />
                            </View>
                            <View
                            style={{
                                borderBottomWidth: 0.5,
                            }}
                            />
                        </View>
                        ) : (
                        <Text
                            style={{
                            padding: 20,
                            fontSize: 16,
                            color: 'grey',
                            textAlign: 'center',
                            }}>
                            No Job Audio
                        </Text>
                        )}
                    </View>

                    <View
                        style={{
                        borderBottomWidth: 0.5,
                        }}
                    />
                    {/* <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        }}>
                        <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'normal',
                            margin: 8,
                            color: '#62463e',
                        }}>
                        Pattern:
                        </Text>
                    </View>

                    <Image
                        source={{uri: imageUrl + '' + this.state.order_image}}
                        style={{
                        height: 240,
                        width: '95%',
                        borderRadius: 4,
                        elevation: 5,
                        margin: 10,
                        }}
                    />
                    <View
                        style={{
                        borderBottomWidth: 0.5,
                        }}>
                        <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'normal',
                            margin: 8,
                            color: '#62463e',
                            textAlign: 'center',
                        }}>
                        {this.state.pattern_number}
                        </Text>
                    </View> */}
                </View>
                <View style={{marginBottom: 4, borderBottomWidth: 0.5}}>
                <Text
                    style={{
                        fontSize: 18,
                        margin: 10,
                        color: '#62463e',
                        textAlign: 'left',
                    }}>
                    Support Images:
                </Text>
                {this.state.jobDetail.support_image && this.state.jobDetail.support_image.image_details.length > 0 ? (
                    <View>
                    <FlatList
                        numColumns={1}
                        horizontal={true}
                        data={this.state.jobDetail.support_image.image_details}
                        renderItem={(items) => {
                        return (
                            <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={true}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('preview', {
                                        uri: imageUrl+items.item.image_url,
                                        isShowShare: true,
                                        isShowDownload: true
                                    });
                                    }}>
                                    <Image
                                    source={{
                                        uri: imageUrl + '/' + items.item.image_url,
                                    }}
                                    style={{
                                        height: 240,
                                        width: width * 0.9,
                                        borderRadius: 4,
                                        elevation: 5,
                                        margin: 10,
                                        borderWidth: 1,
                                        borderColor: '#eeee',
                                    }}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                            </View>
                        );
                        }}
                        keyExtractor={(item) => item.id}
                    />
                    </View>
                ) : (
                    <View
                    style={{
                        justifyContent: 'center',

                        marginBottom: 20,
                    }}>
                    <Text
                        style={{
                        fontSize: 16,
                        color: 'grey',
                        textAlign: 'center',
                        }}>
                        No supportive image found
                    </Text>
                    </View>
                )}
                </View>

                <View>
                    <View>
                        <Text
                        style={{
                            fontSize: 18,
                            margin: 10,
                            color: '#62463e',
                            textAlign: 'left',
                        }}>
                        Preview Images:
                        </Text>
                    </View>
                    <View style={{ borderBottomWidth: 0.5 }}>
                        {this.state.preview_images && this.state.preview_images.length > 0 ? (
                            <View>
                                <FlatList
                                    numColumns={1}
                                    horizontal={true}
                                    data={this.state.preview_images}
                                    renderItem={({item}) => {
                                    return (
                                        <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={true}>
                                            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 10}} onPress={() => {
                                                let isApproveDisabled
                                                if (this.state.user_type === 'Dealer') {
                                                    isApproveDisabled = this.state.previewImageApprovedByDelear && Object.keys(this.state.previewImageApprovedByDelear) && Object.keys(this.state.previewImageApprovedByDelear).length > 0
                                                } else if (this.state.user_type === 'Distributor') {
                                                    isApproveDisabled = this.state.previewImageApprovedByDistributor && Object.keys(this.state.previewImageApprovedByDistributor) && Object.keys(this.state.previewImageApprovedByDistributor).length > 0
                                                }

                                                if (this.state.jobDetail && this.state.jobDetail.cancel_job === 1) {
                                                    isApproveDisabled = true;
                                                }
                                                
                                                this.props.navigation.navigate('chatAgainstIndividualPreviews', {item: { ...this.state.jobDetail, ...item, user_type: this.state.user_type, status: this.state.status, isApproveDisabled }});
                                            }}>
                                                <Image
                                                source={{
                                                    uri: imageUrl + '/' + item.upload_image_url,
                                                }}
                                                style={{
                                                    height: 240,
                                                    width: width * 0.9,
                                                    borderRadius: 4,
                                                    elevation: 5,
                                                    margin: 10,
                                                    borderWidth: 1,
                                                    borderColor: '#eeee',
                                                }}
                                                />
                                                <Text style={{ top: -5 }}>id: {item.preview_image_id}</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                        </View>
                                    );
                                    }}
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                        ) : (
                            <View
                            style={{
                                justifyContent: 'center',

                                marginBottom: 20,
                            }}>
                                <Text
                                    style={{
                                    fontSize: 16,
                                    color: 'grey',
                                    textAlign: 'center',
                                    }}>
                                    No preview image found
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{marginBottom: 4, borderRadius: 4, borderBottomWidth: 0.5, paddingBottom: 20}}>
                    <View
                        style={{
                        padding: 10,
                        }}>
                        <Text
                        style={{
                            fontSize: 18,
                            marginTop: 10,
                            textAlign: 'left',
                            color: '#62463e',
                        }}>
                        Preview Approved by Distributor:
                        </Text>
                    </View>
                    {this.state.previewImageApprovedByDistributor && Object.keys(this.state.previewImageApprovedByDistributor) && Object.keys(this.state.previewImageApprovedByDistributor).length ? (
                        <TouchableOpacity
                            onPress={() => {
                            this.props.navigation.navigate('preview', {
                                uri: imageUrl+this.state.previewImageApprovedByDistributor.upload_image_url,
                                isShowShare: true,
                                isShowDownload: true
                            });
                            }}>
                            <Image
                            source={{uri: imageUrl+this.state.previewImageApprovedByDistributor.upload_image_url}}
                            style={{
                                height: 240,
                                width: '97%',
                                borderRadius: 4,
                                elevation: 5,
                                marginTop: 5,
                                alignSelf: 'center',
                                borderWidth: 1,
                                borderColor: '#eeee',
                            }}
                            />
                            <Text style={{ paddingTop: 10, textAlign: 'center' }}>Id: {this.state.previewImageApprovedByDistributor.preview_image_id} ({getDayDateFormat(this.state.previewImageApprovedByDistributor.modified_by_date_time)})</Text>
                        </TouchableOpacity>
                    ) : (
                        <View
                        style={{
                            justifyContent: 'center',

                            marginBottom: 20,
                        }}>
                            <Text
                                style={{
                                fontSize: 16,
                                color: 'grey',
                                textAlign: 'center',
                                }}>
                                No image found
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{marginBottom: 4, borderRadius: 4, borderBottomWidth: 0.5, paddingBottom: 20}}>
                    <View
                        style={{
                        padding: 10,
                        }}>
                        <Text
                        style={{
                            fontSize: 18,
                            marginTop: 10,
                            textAlign: 'left',
                            color: '#62463e',
                        }}>
                        Preview Approved by Dealer:
                        </Text>
                    </View>
                    {this.state.previewImageApprovedByDelear && Object.keys(this.state.previewImageApprovedByDelear) && Object.keys(this.state.previewImageApprovedByDelear).length ? (
                        <TouchableOpacity
                            onPress={() => {
                            this.props.navigation.navigate('preview', {
                                uri: imageUrl+this.state.previewImageApprovedByDelear.upload_image_url,
                                isShowShare: true,
                                isShowDownload: true
                            });
                            }}>
                            <Image
                            source={{uri: imageUrl+this.state.previewImageApprovedByDelear.upload_image_url}}
                            style={{
                                height: 240,
                                width: '97%',
                                borderRadius: 4,
                                elevation: 5,
                                marginTop: 5,
                                alignSelf: 'center',
                                borderWidth: 1,
                                borderColor: '#eeee',
                            }}
                            />
                            <Text style={{ paddingTop: 10, textAlign: 'center' }}>Id: {this.state.previewImageApprovedByDelear.preview_image_id} ({getDayDateFormat(this.state.previewImageApprovedByDelear.modified_by_date_time)})</Text>
                        </TouchableOpacity>
                    ) : (
                        <View
                        style={{
                            justifyContent: 'center',

                            marginBottom: 20,
                        }}>
                            <Text
                                style={{
                                fontSize: 16,
                                color: 'grey',
                                textAlign: 'center',
                                }}>
                                No image found
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            </View>
        </View>
            <CustomModal isVisible={this.state.isVisibleMediaTypeModal}
                backButtonPress={() => {
                    this.setState({isVisibleMediaTypeModal: false});
                }}>
                <View style={{flex: 1}}>
                    <View
                        style={{
                        height: 380,
                        width: '88%',
                        marginTop: 200,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        elevation: 5,
                        borderRadius: 5,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isVisibleMediaTypeModal: false});
                            }}
                            style={{width: 50, height: 50, alignSelf: 'flex-end'}}>
                            <Icon
                                name="x-circle"
                                size={20}
                                color="#62463e"
                                style={{alignSelf: 'flex-end', padding: 10}}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: '#62463e',
                                fontSize: 18,
                                fontWeight: 'bold',
                                paddingHorizontal: 20,
                                paddingBottom: 20

                            }}>
                            Change Media Type
                        </Text>
                        <View
                          style={{
                            height: 35,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            borderColor: '#62463e',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            alignSelf: 'center',
                            marginVertical: 10
                          }}>
                          <Picker
                            selectedValue={this.state.mediaType}
                            style={{height: 50, width: '100%'}}
                            onValueChange={(value) => {
                              this.setState({
                                mediaType: value,
                                selectedPaper: ''
                              })
                              this.getPaperType(value)
                            }}>
                            {this.state.paper_list.map((value) => (
                              <Picker.Item
                                label={value.sheet_name.substring(0, 18)}
                                value={value.id}
                              />
                            ))}
                          </Picker>
                        </View>
                        <View
                          style={{
                            height: 35,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            borderColor: '#62463e',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            alignSelf: 'center',
                            marginVertical: 10
                          }}>
                          <Picker
                            selectedValue={this.state.selectedPaper}
                            style={{height: 50, width: '100%'}}
                            onValueChange={(value) =>
                              this.setState({
                                selectedPaper: value,
                              })
                            }>
                            {this.state.paperType.map((value) => (
                              <Picker.Item
                                label={value.paper_type_name.substring(0, 18)}
                                value={value.id}
                              />
                            ))}
                          </Picker>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.updateMediaType();
                            }}
                            style={{
                                height: 40,
                                // width: 80,
                                backgroundColor: '#62463e',
                                alignSelf: 'center',
                                alignContent: 'center',
                                marginBottom: 10,
                                marginTop: 50,
                                paddingHorizontal: 20,
                                borderRadius: 20
                            }}>
                            <Text
                                style={{
                                color: 'white',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                marginTop: 10,
                                }}>
                                Update Media Type
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomModal>

            <CustomModal isVisible={this.state.isVisibleQtyModal}
                backButtonPress={() => {
                    this.setState({isVisibleQtyModal: false});
                }}>
                <View style={{flex: 1}}>
                    <View
                        style={{
                        height: 250,
                        width: '88%',
                        marginTop: 200,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        elevation: 5,
                        borderRadius: 5,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isVisibleQtyModal: false});
                            }}
                            style={{width: 50, height: 50, alignSelf: 'flex-end'}}>
                            <Icon
                                name="x-circle"
                                size={20}
                                color="#62463e"
                                style={{alignSelf: 'flex-end', padding: 10}}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: '#62463e',
                                fontSize: 18,
                                fontWeight: 'bold',
                                paddingHorizontal: 20,
                                paddingBottom: 20

                            }}>
                            Change Quantity
                        </Text>
                        
                        <TextInput
                            placeholder="Enter Quantity"
                            defaultValue={this.state.quantity.toString()}
                            onChangeText={(value) => {
                                this.setState({
                                    quantity: value,
                                });
                            }}
                            style={{
                                height: 45,
                                width: '90%',
                                borderWidth: 0.8,
                                borderRadius: 6,
                                borderColor: '#62463e',
                                padding: 12,
                                alignSelf: 'center'
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                this.updateQuantity();
                            }}
                            style={{
                                height: 40,
                                backgroundColor: '#62463e',
                                alignSelf: 'center',
                                alignContent: 'center',
                                marginBottom: 10,
                                marginTop: 30,
                                paddingHorizontal: 20,
                                borderRadius: 20
                            }}>
                            <Text
                                style={{
                                color: 'white',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                marginTop: 10,
                                }}>
                                Update Qty
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomModal>
        </View>
    );
    }
    }

    const styles = StyleSheet.create({
    rejectbutton_enabled: {
    backgroundColor: '#f4f4f4',
    height: 44,
    width: width * 0.43,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1.5,
    borderColor: '#be0000',
    },
    rejecttext_enabled: {
    textAlign: 'center',
    color: '#be0000',

    fontSize: 16,
    },
    approvebutton_enabled: {
    backgroundColor: '#2b580c',
    height: 44,
    width: width * 0.43,
    justifyContent: 'center',
    alignItems: 'center',
    //flexGrow:0.5,
    //borderRadius:10,
    borderColor: '#2b580c',
    borderWidth: 1.5,
    },
    approvetext_enabled: {
    textAlign: 'center',
    color: '#FFFF',
    marginBottom: 2,
    fontSize: 16,
    },
    rejectbutton_disabled: {
    backgroundColor: '#f4f4f4',
    height: 44,
    width: width * 0.43,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1.5,
    borderColor: '#bababa',
    },
    rejecttext_disabled: {
    textAlign: 'center',
    color: '#bababa',

    fontSize: 16,
    },
    approvebutton_disabled: {
    backgroundColor: '#f4f4f4',
    height: 44,
    width: width * 0.43,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1.5,
    borderColor: '#bababa',
    },
    approvetext_disabled: {
    textAlign: 'center',
    color: '#bababa',

    fontSize: 16,
    },
    });
