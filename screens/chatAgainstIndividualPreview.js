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

        this.state = {
            modalVisible: false,
            isDisabled: false,
            jobDetail: this.props.route.params.item,
            approve_action: false,
            modalvisibale: false,
            remark: 'No remarks',
            ip_address: '',
            user_type: 'unknown',
            status: this.props.route.params.status
        };
    }

    componentDidMount() {
        NetworkInfo.getIPV4Address().then((ipv4Address) => {
            this.setState({
            ip_address: ipv4Address,
            });
        });
        console.log('jobDetails==============>', this.state.jobDetail)
    };

    rejectJobConf = () => {
        this.setState({approve_action: false});
        this.setState({modalvisibale: true});
    };

    approveJobconf = () => {
        this.setState({approve_action: true});
        this.setState({modalvisibale: true});
    };

    levelCheck = () => {
        let level = false;
        if (this.state.status == 9 && this.state.user_type == 'Dealer')
            level = true;
        if (this.state.status == 10 && this.state.user_type == 'Distributor')
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
                    fetch(URL + '/order_accep_reject_by_order_id', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body:
                        'order_id=' +
                        this.state.jobDetail.order_id +
                        '&user_id=' +
                        result +
                        '&created_by_ip=' +
                        this.state.ip_address +
                        '&status_id=' +
                        this.state.status +
                        '&description=' +
                        this.state.remark,
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result);
                        if (!result.error) {
                        Alert.alert(
                            'Success Message',
                            'Preview Change/Reject Requested',
                        );
                        this.props.navigation.replace('onGoingJob');
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
                    fetch(URL + '/order_accep_reject_by_order_id', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'POST',
                    body:
                        'order_id=' +
                        this.state.jobDetail.order_id +
                        '&user_id=' +
                        result +
                        '&created_by_ip=' +
                        this.state.ip_address +
                        '&status_id=' +
                        this.state.status +
                        '&description=' +
                        this.state.remark,
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(this.state.jobDetail.order_id);
                        console.log('status update result');
                        console.log(result);
                        if (!result.error) {
                        this.setState({
                            button_show: 'No',
                        });
    
                        Alert.alert(
                            'Success Message',
                            'Preview Approved Successfully',
                        );
                        this.props.navigation.replace('onGoingJob');
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

    checkAction = (flag) => {
        if (flag) {
            if (this.state.remark === 'No remarks') {
            Alert.alert('Note!', 'Please add remarks!');
            return;
            }
        }
    
        this.setState({modalvisibale: false});
    
        if (this.state.approve_action) {
            this.approveJobAlert();
        } else {
            this.rejectJobAlert();
        }
    };

    render() {
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
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#FFF', margin: 15, }}>Preview Image</Text>
                        <View style={{ height: 40, width: 60, }} />
                        
                    </View>

                    <View style={{ height: height, width: width - 45, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff', alignSelf: 'center', top: -100, paddingTop: 20 }}>
                        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 150 }}>
                            <View style={{borderBottomWidth: 0.5, paddingBottom: 10}}>
                                <Text style={{ textAlign: 'center', fontSize: 18, color: '#62463e', marginTop: 10 }}>
                                    Job id: {this.state.jobDetail.order_id}
                                </Text>
                                <Text style={{ fontSize: 15, color: '#62463e', marginTop: 10, marginLeft: 10 }}>
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
                                disabled={this.state.isDisabled}
                                onPress={() => this.rejectJobConf()}
                                    style={
                                    this.state.isDisabled
                                        ? styles.rejectbutton_disabled
                                        : styles.rejectbutton_enabled
                                    }>
                                    <Text
                                    style={
                                        this.state.isDisabled
                                        ? styles.rejecttext_disabled
                                        : styles.rejecttext_enabled
                                    }>
                                    Change/Reject Preview
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                disabled={this.state.isDisabled}
                                onPress={() => this.approveJobconf()}
                                 style={
                                    this.state.isDisabled
                                        ? styles.approvebutton_disabled
                                        : styles.approvebutton_enabled
                                    }>
                                    <Text
                                    style={
                                        this.state.isDisabled
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
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                                Status:
                                </Text>
                                <Text style={{fontSize: 12, padding: 4}}>
                                    {this.state.jobDetail.status_name}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingLeft: 10}}>
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                                Date Time:
                                </Text>
                                <Text style={{fontSize: 12, padding: 4}}>
                                    {moment(this.state.jobDetail.date_time).format('LLL')}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12, color: 'grey', padding: 4}}>
                                Description:&nbsp;&nbsp;
                                    <Text style={{fontSize: 12, color: 'black' }}>
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

                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.modalvisibale}
                    onBackButtonPress={() => {
                    Alert.alert('No update performed');
                    this.setState({modalvisibale: false});
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
                            this.setState({modalvisibale: false});
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
                            textAlign: 'center',
                            fontWeight: 'bold',

                        }}>
                        Please enter your remarks below:-
                        </Text>
                        <Textarea
                        maxLength={1000}
                        onChangeText={(value) => this.setState({remark: value})}
                        containerStyle={{
                            height: 150,
                            width: '88%',
                            borderWidth: 0.3,
                            margin: 20,
                        }}
                        maxLength={80}
                        placeholder={'Add a remark for the following action! '}
                        placeholderTextColor={'#c7c7c7'}
                        underlineColorAndroid={'transparent'}
                        />
                        <TouchableOpacity
                        onPress={() => {
                            this.checkAction(true);
                        }}
                        style={{
                            height: 40,
                            width: 80,
                            backgroundColor: '#62463e',
                            alignSelf: 'center',
                            alignContent: 'center',
                            marginBottom: 10,
                        }}>
                        <Text
                            style={{
                            color: 'white',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            marginTop: 10,
                            }}>
                            NEXT
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={() => {
                            this.checkAction(false);
                        }}
                        style={{
                            height: 40,
                            width: 200,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            alignContent: 'center',
                        }}>
                        <Text
                            style={{
                            color: '#62463e',
                            alignSelf: 'center',
                            marginTop: 10,
                            }}>
                            Skip without remarks
                        </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
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