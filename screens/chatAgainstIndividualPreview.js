import React, {Component} from 'react';

import { View, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView, StyleSheet, Image, Alert, AsyncStorage } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {URL, imageUrl} from '../api';
import moment from 'moment';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import Textarea from 'react-native-textarea';
import {NetworkInfo} from 'react-native-network-info';
import NetInfo from '@react-native-community/netinfo';

let {height, width} = Dimensions.get('screen');

export default class chatAgainstIndividualPreviews extends Component {
    constructor(props) {
        super(props);

        console.log('this.props.route.params.status==============>', this.props.route.params.item.status);

        this.state = {
            modalVisible: false,
            isDisabled: false,
            isApproveDisabled: false,
            isRejectDisabled: false,
            jobDetail: this.props.route.params.item,
            approve_action: false,
            modalvisibale: false,
            remark: 'No remarks',
            ip_address: '',
            user_type: 'unknown',
            status: this.props.route.params.item.status,
            role: ''
        };
    }

    componentDidMount() {
        NetworkInfo.getIPV4Address().then((ipv4Address) => {
            this.setState({
            ip_address: ipv4Address,
            });
        });
        AsyncStorage.getItem('role').then(role=>{
            this.setState({ role });
        });
        console.log('jobDetails==============>', this.state.jobDetail)
    };

    levelCheck = () => {
        let level = false;
        if (this.state.status === 9 && this.state.user_type == 'Dealer')
            level = true;
        if (this.state.status === 10 && this.state.user_type == 'Distributor')
            level = true;
        return level;
    };

    rejectStatus = () => {
        if (this.state.user_type == 'Dealer') this.setState({status: 11});
        else if (this.state.user_type == 'Distributor') this.setState({status: 12});
    };

    setStatus = () => {
        console.log('setting status');
        console.log(this.state.user_type);
        if (this.state.user_type == 'Dealer') {
            this.setState({status: 10});
            console.log(this.state.status);
        } else if (this.state.user_type == 'Distributor')
            this.setState({status: 8});
    };

    rejectJob = () => {
        this.rejectStatus();
        console.log('Rejecting');
        AsyncStorage.getItem('user_id').then((result) => {
            if (result) {
            NetInfo.fetch()
                .then((state) => {
                if (state.isConnected) {
                    fetch(URL + '/reject_preview_image_by_id', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body:
                        'order_id=' +
                        this.state.jobDetail.order_id +
                        '&user_id=' +
                        result +
                        '&role=' +
                        this.state.role +
                        '&post_job_approved_image_id=' +
                        this.state.jobDetail.preview_image_id,
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result);
                        if (!result.error) {
                        Alert.alert(
                            'Success Message',
                            'Preview Change/Reject Requested',
                        );
                        this.props.navigation.navigate('onGoingJob', { isRefresh: true });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert('Error Message', {error});
                    });
                } else {
                    Alert.alert(
                    'Network Error',
                    'Please check your Internet connection',
                    );
                }
                })
                .catch((err) => console.log(err));
            }
        });
    };

    approveJob = () => {
        if (!this.levelCheck) {
            Alert.alert('Error', 'You are not allowed to approve this job yet!');
            return;
        } else {
            this.setStatus();
    
            AsyncStorage.getItem('user_id').then((result) => {
            if (result) {
                console.log(result);
                NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    fetch(URL+'/approve_preview_image_by_id', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body:
                        'order_id=' +
                        this.state.jobDetail.order_id +
                        '&user_id=' +
                        result +
                        '&role=' +
                        this.state.role +
                        '&post_job_approved_image_id=' +
                        this.state.jobDetail.preview_image_id,
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        // console.log(this.state.jobDetail.order_id);
                        // console.log('status update result');
                        console.log(result);
                        if (!result.error) {
                        this.setState({
                            button_show: 'No',
                        });
    
                        Alert.alert(
                            'Success Message',
                            'Preview Approved Successfully',
                        );
                        this.props.navigation.navigate('onGoingJob', { isRefresh: true });
                        } else {
                        console.log(result.error);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Alert.alert('Error Message', {error});
                    });
                } else {
                    Alert.alert(
                    'Network Error',
                    'Please check your Internet connection',
                    );
                }
                });
            } else {
            }
            });
        }
    };

    approveJobAlert = () => {
        if (this.state.user_type == 'Distributor') {
            Alert.alert(
            'Approve Preview',
            `Are You Sure You Want To Approve This Preview?\n \nNote: Once approved order cannot be cancelled.`,
            [
                {
                text: 'Ok',
                onPress: () => this.approveJob(),
                },
                {
                text: 'Cancel',
                onPress: () => null,
                },
            ],
            );
        } else {
            Alert.alert(
            'Approve Preview',
            'Are You Sure You Want To Approve This Preview?',
            [
                {
                text: 'Ok',
                onPress: () => this.approveJob(),
                },
                {
                text: 'Cancel',
                onPress: () => null,
                },
            ],
            );
        }
    };

    rejectJobAlert = () => {
        Alert.alert(
            'Change/Reject Preview',
            'Are You Sure You Want To Change/Reject This Preview?',
            [
            {
                text: 'Ok',
                onPress: () => this.rejectJob(),
            },
            {
                text: 'Cancel',
                onPress: () => null,
            },
            ],
        );
    };

    render() {
        if (this.state.jobDetail.user_role_name === 'Dealer') {
            if (this.state.jobDetail.approved_by_dealer === 1) {
                this.state.isApproveDisabled = true;
            } else if (this.state.jobDetail.approved_by_dealer === 2) {
                this.state.isRejectDisabled = true;
            } else {
                this.state.isApproveDisabled = false;
                this.state.isRejectDisabled = false;
            }
        }
        if (this.state.jobDetail.user_role_name === 'Distributor') {
            if (this.state.jobDetail.approved_by_distributer === 1) {
                this.state.isApproveDisabled = true;
            } else if (this.state.jobDetail.approved_by_distributer === 2) {
                this.state.isRejectDisabled = true;
            } else {
                this.state.isApproveDisabled = false;
                this.state.isRejectDisabled = false;
            }
        }
        // const approved_by_dealer = this.state.jobDetail.approved_by_dealer
        return (
            <View>
                <StatusBar barStyle="default" backgroundColor="#62463e" />
                <View>
                    <View
                        style={{ justifyContent: 'space-between', flexDirection: 'row',
                        height: 170,
                        width: width,
                        backgroundColor: '#62463e',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20, }}>
                        <TouchableOpacity activeOpacity={2} onPress={() => this.props.navigation.goBack(null)}>
                            <Icons name="arrow-back" style={{ margin: 20, }} size={18} color="#FFFF" />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#FFF', margin: 15, }} selectable={true}>Preview Image</Text>
                        <View style={{ height: 40, width: 60, }} />
                        
                    </View>

                    <View style={{ height: height, width: width - 45, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff', alignSelf: 'center', top: -100, paddingTop: 20 }}>
                        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 150 }}>
                            <View style={{borderBottomWidth: 0.5, paddingBottom: 10}}>
                                <Text style={{ textAlign: 'center', fontSize: 18, color: '#62463e', marginTop: 10 }} selectable={true}>
                                    Job id: {this.state.jobDetail.order_id}
                                </Text>
                                <Text style={{ fontSize: 15, color: '#62463e', marginTop: 10, marginLeft: 10 }} selectable={true}>
                                    Status: {this.state.jobDetail.status_name}
                                </Text>
                            </View>
                            <View
                                style={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                padding: 10
                                }}>
                                <TouchableOpacity
                                disabled={this.state.isRejectDisabled}
                                onPress={() => this.rejectJobAlert()}
                                    style={
                                    this.state.isRejectDisabled
                                        ? styles.rejectbutton_disabled
                                        : styles.rejectbutton_enabled
                                    }>
                                    <Text
                                    style={
                                        this.state.isRejectDisabled
                                        ? styles.rejecttext_disabled
                                        : styles.rejecttext_enabled
                                    }>
                                    Change/Reject Preview
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                disabled={this.state.isApproveDisabled}
                                onPress={() => this.approveJobAlert()}
                                 style={
                                    this.state.isApproveDisabled
                                        ? styles.approvebutton_disabled
                                        : styles.approvebutton_enabled
                                    }>
                                    <Text
                                    style={
                                        this.state.isApproveDisabled
                                        ? styles.approvetext_disabled
                                        : styles.approvetext_enabled
                                    }>
                                    Approve Preview
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 10, zIndex:9999}} onPress={() => {
                                this.props.navigation.navigate('preview', {
                                    uri: imageUrl+this.state.jobDetail.upload_image_url,
                                    message: `Hi, Please check the preview of the order id:${this.state.jobDetail.order_id}`,
                                    isShowShare: true,
                                    isShowDownload: true
                                });
                                }}>
                                <Image
                                    source={{
                                        uri: imageUrl + this.state.jobDetail.upload_image_url,
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
                                <Text>Preview id: {this.state.jobDetail.preview_image_id}</Text>
                            </TouchableOpacity>
                            
                            <View style={{flexDirection: 'row', paddingLeft: 10}}>
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}} selectable={true}>
                                Status:
                                </Text>
                                <Text style={{fontSize: 12, padding: 4}} selectable={true}>
                                    {this.state.jobDetail.status_name}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingLeft: 10}}>
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}} selectable={true}>
                                Date Time:
                                </Text>
                                <Text style={{fontSize: 12, padding: 4}} selectable={true}>
                                    {moment(this.state.jobDetail.date_time).format('LLL')}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}} selectable={true}>
                                Description:&nbsp;&nbsp;
                                    <Text style={{fontSize: 12, color: 'black' }} selectable={true}>
                                        {this.state.jobDetail.description || 'N/A'}
                                    </Text>
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('messaging',{ 
                                    flowDirection: 'previewImage', 
                                    preview_image_id: this.state.jobDetail.preview_image_id,
                                    order_id: this.state.jobDetail.order_id
                                })
                                }}
                                style={{ 
                                    borderWidth: 0.5, 
                                    padding: 5, 
                                    borderRadius: 15, 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    alignSelf: 'center', 
                                    width: '50%', 
                                    marginTop: 30 
                                }}
                            >
                                <Text>Remarks</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    };
};

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
    width: width * 0.4,
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