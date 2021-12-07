import React, {Component} from 'react';

import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  PermissionsAndroid,
  AsyncStorage,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {NetworkInfo} from 'react-native-network-info';
import NetInfo from '@react-native-community/netinfo';
import {Picker} from '@react-native-picker/picker';
import {imageUrl, URL, FileUploadURL} from '../api.js';
import emailValidator from '../screens/Validator';

import * as Progress from 'react-native-progress';
import { CustomAlert } from './components';
let {height,width} = Dimensions.get('screen')

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      camImage: '',
      first_name: '',
      last_name: '',
      company_name: '',
      office_address: '',
      ip_address: '',
      city_id: '',
      pin_code: '',
      district_id: '',
      state_id: '',
      user_id: '',
      toastMessage: '',
      states: [],
      city: [],
      district: [],
      state_name: [],
      mobile_number: '',
      imgObj: null,
      fileType: '',
      filename: '',
      progress: '',
      progressStat: false,
      profile_image: '',
      companyLogo: '',
      camImage2: '',
      fileType2: '',
      filename2: '',
      email_id: '',
      imagePickerModalVisible: false,
      uploadFor: '',
    };
  }

  componentDidMount() {
    this.getUsers();
    
    if(width>height){
      let temp = width;
      width= height;
      height=temp;
     
      
  }

    NetworkInfo.getIPAddress().then((ipAddress) => {
      this.setState({
        ip_address: ipAddress.toString(),
      });
    });

    try {
      AsyncStorage.getItem('user_id').then((result) => {
        console.log(result);
        if (result) {
          this.setState({
            user_id: result,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getUsers = () => {
    AsyncStorage.getItem('user_id').then((result) => {
      console.log(result);

      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetch(URL + '/get_user_details_by_user_id', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: 'user_id=' + result,
          })
            .then((response) => response.json())
            .then((result) => {
              console.log('result==============>', result);
              if (result) {
                if (result.company_logo == null) {
                  this.setState({
                    companyLogo: '',
                  });
                } else {
                  this.setState({
                    companyLogo: result.company_logo,
                  });
                }

                if (result.profilePicture == null) {
                  this.setState({
                    profile_image: '',
                  });
                } else {
                  this.setState({
                    profile_image: result.profilePicture,
                  });
                }
                console.log(result.company_logo);
                this.setState({
                  first_name: result.first_name,
                  mobile_number: result.mobile_number,
                  state_id: result.state_id,
                  district_id: result.district_id,
                  office_address: result.office_address,
                  pin_code: result.pin_code,
                  city_id: result.city_id,
                  last_name: result.last_name,
                  company_name: result.companyName,
                  state_name: result.state_name,

                  email_id: result.email_id,
                });
                this.getStates();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Alert.alert(' Warning', 'Please check your Internet connection');
        }
      });
    });
  };
  
  profilePicChoose = () => {
    this.setState({imagePickerModalVisible: true, uploadFor: 'profile'});
  };

  updateProfile = () => {
    console.log(this.state.city_id);
    console.log(this.state.state_id);

    if (this.state.first_name == '') {
      Alert.alert('Validation', 'Please enter your first name');
    } else if (this.state.last_name === '') {
      Alert.alert('Validation', 'Please enter your last name');
    } else if (this.state.company_name === '') {
      Alert.alert('Validation', 'Please enter company name');
    } else if (this.state.office_address === '') {
      Alert.alert('Validation', 'Please enter office address');
    } else if (this.state.email_id == '') {
      Alert.alert('Validation Error', 'Please enter your email id');
    } else if (!emailValidator(this.state.email_id)) {
      Alert.alert('Validation Error', 'Please enter proper email id');
    } else if (this.state.city === '') {
      Alert.alert('Validation', 'City name is required');
    } else if (this.state.district != '') {
      Alert.alert('Validation', 'District name is requried');
    } else if (this.state.pin_code === '') {
      Alert.alert('Validation', 'Please enter your pin code.');
    } else {
      console.log({
        uri: this.state.camImage,
        type: 'image/jpeg',
        name: this.state.filename,
      });

      var form = new FormData();
      form.append('image', {
        uri: this.state.camImage,
        type: 'image/jpeg',
        name: this.state.filename,
      });

      const xhr = new XMLHttpRequest();

      xhr.open('POST', FileUploadURL+'/uploads.php');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(form);
      console.log(xhr.responseText);

      if (xhr.upload) {
        console.log(xhr.upload);
        console.log(xhr.upload);
        xhr.upload.onprogress = ({total, loaded}) => {
          const Progress = loaded / total;
          this.setState({
            progress: Progress,
            progressStat: true,
          });
        };

        setTimeout(() => {
          this.setState({
            progressStat: false,
          });
        }, 600);
      }

      fetch(URL + '/update_profile_details_by_id', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body:
          'first_name=' +
          this.state.first_name +
          '&last_name=' +
          this.state.last_name +
          '&companyName=' +
          this.state.company_name +
          '&office_address=' +
          this.state.office_address +
          '&city_id=' +
          this.state.city_id +
          '&state_id=' +
          this.state.state_id +
          '&pin_code=' +
          this.state.pin_code +
          '&profile_picture=' +
          this.state.filename +
          '&company_logo=' +
          this.state.filename2 +
          '&modify_by_id=' +
          this.state.user_id +
          '&id=' +
          this.state.user_id +
          '&email_id=' +
          this.state.email_id,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error == false) {
            Alert.alert('Success', 'User Profile upload successfully');

            setTimeout(() => {
              this.props.navigation.goBack('profile');
            }, 1200);
          } else if (result.length == 0) {
            Alert.alert('Success', 'User Profile upload successfully');

            this.props.navigation.goBack(null);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  getStates = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        fetch(URL + '/get_state_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.setState({
              states: result.state_list,
              //state_id: result.id,
              
            });
            this.showCityfirst(this.state.state_id)
            
                      })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Alert.alert('Warning', 'Please check your Internet connection');
      }
    });
  };

  // getDistricts = ()=>{

  //     if(this.state.state_id){
  //         NetInfo.fetch().then(state =>{
  //             if(state.isConnected){
  //                 fetch("http://phpstack-508730-1686395.cloudwaysapps.com/backend/v1/get_district_list_by_state_id",{
  //                    method:"POST",
  //                    headers:{
  //                     'Content-Type': 'application/x-www-form-urlencoded',
  //                    },
  //                  body:"state_id=" +this.state.district_id
  //                 }).then(response => response.json())
  //                 .then(result =>{
  //                     console.log(result)
  //                     this.setState({
  //                         district:result.district_list
  //                     });
  //                 }).catch(error =>{
  //                     console.log(error);
  //                 });
  //             }else{
  //                 Alert.alert(
  //                     "Warning",
  //                     "Please check Your Internet connection"
  //                 )
  //             }
  //         })
  //     }else{

  //     }
  // }

  getCityes = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        fetch(URL + '/get_city_list_by_district_id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.setState({
              city: result.city_list,
              city_id: result.city_id,
              state_id: id,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Alert.alert('Warning', 'Please check Your internet cnnection');
      }
    });
  };

  showDistrict = (id) => {
    if (id) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetch(URL + '/get_district_list_by_state_id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'state_id=' + id,
          })
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              this.setState({
                district: result.district_list,
                state_id: id,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Alert.alert('Warning', 'Please check Your Internet connection');
        }
      });

      return true;
    } else {
      return false;
    }
  };


  showCityfirst = (id) => {
    console.log(id);

    // var image = this.state.Capimage;

    //     if(image.length >0){
    //         if(image.path == "base64"){
    //             alert("image file has been chamge")
    //         }
    //     }else{
    //         alert("No image file are found")
    //     }
    this.setState({
      state_id: id,
    });
    if (id) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetch(URL + '/get_city_list_by_state_id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'state_id=' + id,
          })
            .then((response) => response.json())
            .then((result) => {
              this.setState({
                city: result.city_list,
                //city_id: result.city_list[0].city_id,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Alert.alert('Warning', 'Please check Your internet cnnection');
        }
      });

      return true;
    } else {
      return false;
    }
  };
  

  showCity = (id) => {
    console.log(id);

    // var image = this.state.Capimage;

    //     if(image.length >0){
    //         if(image.path == "base64"){
    //             alert("image file has been chamge")
    //         }
    //     }else{
    //         alert("No image file are found")
    //     }
    this.setState({
      state_id: id,
    });
    if (id) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetch(URL + '/get_city_list_by_state_id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'state_id=' + id,
          })
            .then((response) => response.json())
            .then((result) => {
              this.setState({
                city: result.city_list,
                city_id: result.city_list[0].city_id,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Alert.alert('Warning', 'Please check Your internet cnnection');
        }
      });

      return true;
    } else {
      return false;
    }
  };

  handleCamera = async () => {
    if (this.state.uploadFor === 'profile') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'STC Permissions',
          message: "Stc need's to allow your camera Permissions",
          buttonNutral: 'Ask me Latter',
          buttonPositive: 'Yes',
          buttonNegative: 'No',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          mediaType: 'photo'
        }).then(image => {
            // console.log('image============>', image);
            this.setState({
              camImage: image.path,
              fileType: image.mime,
              filename: image.modificationDate+'.jpeg',
            });
            
            this.setState({imagePickerModalVisible: false, uploadFor: ''});
        }).catch(err => {
            console.log('error', err)
        });
      
      } else {
        Alert.alert('Pleace try again');
      }
    }
    if (this.state.uploadFor === 'company') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'STC Permissions',
          message: "Stc need's to allow your camera Permissions",
          buttonNutral: 'Ask me Latter',
          buttonPositive: 'Yes',
          buttonNegative: 'No',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          mediaType: 'photo'
        }).then(image => {
          this.setState({imagePickerModalVisible: false, uploadFor: ''});

            var form = new FormData();
            form.append('image', {
              uri: image.path,
              type: image.mime,
              name: image.modificationDate+'.jpeg',
            });

            var xhr = new XMLHttpRequest();
            xhr.open('POST', FileUploadURL+'/uploads.php');
            xhr.setRequestHeader('Contnet-Type', 'multipart/form-data');
            xhr.send(form);

            if (xhr.upload) {
              console.log(image.path);
              xhr.upload.onprogress = ({total, loaded}) => {
                const Progress = loaded / total;
                console.log(Progress);
                this.setState({
                  progress: Progress,
                  progressStat: true,
                });
              };

              setTimeout(() => {
                this.setState({
                  progressStat: false,
                });
              }, 1600);
            }

            if (image) {
              console.log(image);
            }

            this.setState({
              camImage2: image.path,
              fileType2: image.mime,
              filename2: image.modificationDate+'.jpeg',
            });
        }).catch(err => {
            console.log('error', err)
        });
      
      } else {
        Alert.alert('Pleace try again');
      }
    }
  }

  handleGallery = async () => {
    if (this.state.uploadFor === 'profile') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'STC Permissions',
          message: "Stc need's to allow your camera Permissions",
          buttonNutral: 'Ask me Latter',
          buttonPositive: 'Yes',
          buttonNegative: 'No',
        },
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openPicker({
          mediaType: 'photo'
        }).then(image => {
            // console.log('image============>', image);
            
            this.setState({imagePickerModalVisible: false});
            
            this.setState({
              camImage: image.path,
              fileType: image.mime,
              filename: image.modificationDate+'.jpeg',
            });
        }).catch(err => {
            console.log('error', err)
        });
      
      } else {
        Alert.alert('Pleace try again');
      }
    }

    if (this.state.uploadFor === 'company') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'STC Permissions',
          message: "Stc need's to allow your camera Permissions",
          buttonNutral: 'Ask me Latter',
          buttonPositive: 'Yes',
          buttonNegative: 'No',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openPicker({
          mediaType: 'photo'
        }).then(image => {
          this.setState({imagePickerModalVisible: false, uploadFor: ''});

            var form = new FormData();
            form.append('image', {
              uri: image.path,
              type: image.mime,
              name: image.modificationDate+'.jpeg',
            });

            var xhr = new XMLHttpRequest();
            xhr.open('POST', FileUploadURL+'/uploads.php');
            xhr.setRequestHeader('Contnet-Type', 'multipart/form-data');
            xhr.send(form);

            if (xhr.upload) {
              console.log(image.path);
              xhr.upload.onprogress = ({total, loaded}) => {
                const Progress = loaded / total;
                console.log(Progress);
                this.setState({
                  progress: Progress,
                  progressStat: true,
                });
              };

              setTimeout(() => {
                this.setState({
                  progressStat: false,
                });
              }, 1600);
            }

            if (image) {
              console.log(image);
            }

            this.setState({
              camImage2: image.path,
              fileType2: image.mime,
              filename2: image.modificationDate+'.jpeg',
            });
        }).catch(err => {
            console.log('error', err)
        });
      
      } else {
        Alert.alert('Pleace try again');
      }
    }
  }

  render() {
    console.log(this.state.city_id);
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  height: 170,
                  width: width,
                  backgroundColor: '#62463e',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack(null)}>
                  <Icon
                    name="arrow-back"
                    color="#FFF"
                    size={18}
                    style={{
                      margin: 25,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: '#FFF',
                    margin: 25,
                  }}>
                  Edit Profile
                </Text>
                <View
                  style={{
                    height: 40,
                    width: 60,
                  }}></View>
              </View>

              <View
                style={{
                  position: 'absolute',
                  height: height,
                  width: width - 45,
                  backgroundColor: '#FFF',
                  top: 75,
                  left: 23,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  alignItems: 'center',
                }}>
                <KeyboardAvoidingView
                  behavior="padding"
                  style={{
                    height: height,
                    marginBottom: 30,
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingBottom: 180,
                    }}
                    style={{
                      marginBottom: 50,
                      height: height + 500,
                    }}>
                    <Text
                      style={{
                        padding: 10,
                        fontSize: 14,
                      }}>
                      Select Profile Picture
                    </Text>
                    {this.state.camImage ? (
                      <Image
                        source={{uri: this.state.camImage}}
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 50,
                          marginTop: 20,
                          marginHorizontal: 15,
                        }}
                      />
                    ) : (
                      <View>
                        {this.state.profile_image != '' ? (
                          <Image
                            source={{
                              uri: imageUrl + '/' + this.state.profile_image,
                            }}
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 50,
                              marginTop: 20,
                              marginHorizontal: 15,
                            }}
                          />
                        ) : (
                          <Image
                            source={require("../assets/images/userProfile.png")
                              
                            }
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 50,
                              marginTop: 20,
                              marginHorizontal: 15,
                            }}
                          />
                        )}
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        // this.profilePicChoose()
                        this.setState({imagePickerModalVisible: true, uploadFor: 'profile'});
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
                          position: 'absolute',
                          top: 120,
                          left: 95
                      }}>
                      <MIIcon name="edit" color="white" size={15} />
                    </TouchableOpacity>

                    <View
                      style={{
                        justifyContent: 'center',
                        padding: 20,
                      }}>
                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 500,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginBottom: 10,
                          }}>
                          First Name
                        </Text>
                      </View>
                      {this.state.first_name ? (
                        <TextInput
                          placeholder="Enter First Name"
                          defaultValue={this.state.first_name.toString()}
                          onChangeText={(value) => {
                            this.setState({
                              first_name: value,
                            });
                          }}
                          style={{
                            height: 45,
                            width: '90%',
                            borderWidth: 0.8,
                            borderRadius: 6,

                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      ) : (
                        <TextInput
                          placeholder="Enter First Name"
                          onChangeText={(value) => {
                            this.setState({
                              first_name: value,
                            });
                          }}
                          style={{
                            height: 45,
                            width: '90%',
                            borderWidth: 0.6,
                            borderRadius: 6,

                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      )}

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 500,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginTop: 10,
                            marginBottom: 10,
                          }}>
                          Last Name
                        </Text>
                      </View>

                      {this.state.last_name ? (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              last_name: value,
                            })
                          }
                          defaultValue={this.state.last_name.toString()}
                          placeholder="Enter Last Name"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,

                            borderWidth: 0.6,
                            //marginTop: 10,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      ) : (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              last_name: value,
                            })
                          }
                          placeholder="Enter Last Name"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      )}

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 300,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginTop: 10,
                            marginBottom: 10,
                          }}>
                          Email Id
                        </Text>
                      </View>

                      {this.state.email_id ? (
                        <TextInput
                          defaultValue={this.state.email_id.toString()}
                          onChangeText={(value) =>
                            this.setState({
                              email_id: value,
                            })
                          }
                          placeholder="Enter Email id"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            // marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      ) : (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              email_id: value,
                            })
                          }
                          placeholder="Enter Email id"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      )}
                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 300,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          Company Name
                        </Text>
                      </View>

                      {this.state.company_name ? (
                        <TextInput
                          defaultValue={this.state.company_name.toString()}
                          onChangeText={(value) =>
                            this.setState({
                              company_name: value,
                            })
                          }
                          placeholder="Enter Company Name"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      ) : (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              company_name: value,
                            })
                          }
                          placeholder="Enter Company Name"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      )}

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 300,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          Company Address
                        </Text>
                      </View>

                      {this.state.office_address ? (
                        <TextInput
                          multiline={true}
                          numberOfLines={3}
                          defaultValue={this.state.office_address.toString()}
                          onChangeText={(value) =>
                            this.setState({
                              office_address: value,
                            })
                          }
                          placeholder="Enter Office Address"
                          style={{
                            maxHeight: 80,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      ) : (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              office_address: value,
                            })
                          }
                          placeholder="Enter Company Address"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                        />
                      )}

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 500,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          Select State
                        </Text>
                      </View>

                      <View
                        style={{
                          height: 45,
                          width: '90%',
                          borderRadius: 6,
                          borderWidth: 0.6,
                          //marginTop: 20,
                          borderColor: '#62463e',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Picker
                          selectedValue={this.state.state_id}
                          enabled
                          style={{height: 50, width: '100%'}}
                          onValueChange={(value) => this.showCity(value)}>
                          {this.state.states.map((value) => (
                            <Picker.Item
                              label={value.state_name.substring(0, 18)}
                              value={value.id}
                            />
                          ))}
                        </Picker>
                      </View>

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 460,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          Select City
                        </Text>
                      </View>

                      {this.state.city ? (
                        <View
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Picker
                            selectedValue={this.state.city_id}
                            style={{height: 50, width: '100%'}}
                            onValueChange={(value) =>
                              this.setState({
                                city_id: value,
                              })
                            }>
                            {this.state.city.map((value) => (
                              <Picker.Item
                                label={value.city_name.substring(0, 18)}
                                value={value.city_id}
                              />
                            ))}
                          </Picker>
                        </View>
                      ) : (
                        <View
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            //marginTop: 20,
                            borderColor: '#62463e',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Picker
                            style={{
                              height: 50,
                              width: '90%',
                              borderRadiusColor: 'black',
                            }}
                            selectedValue="baal"
                            onValueChange={(value) => {
                              this.setState({
                                city_id: value,
                              });
                            }}>
                            <Picker.Item
                              label="Select city  found"
                              value="baal"
                            />
                          </Picker>
                        </View>
                      )}

                      <View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#62463e',
                            width: 300,
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginTop: 15,
                            marginBottom: 10,
                          }}>
                          Pin Code
                        </Text>
                      </View>

                      {this.state.pin_code ? (
                        <TextInput
                          defaultValue={this.state.pin_code.toString()}
                          onChangeText={(value) =>
                            this.setState({
                              pin_code: value,
                            })
                          }
                          placeholder="Enter Office Address"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            // marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                          keyboardType="number-pad"
                        />
                      ) : (
                        <TextInput
                          onChangeText={(value) =>
                            this.setState({
                              pin_code: value,
                            })
                          }
                          placeholder="Enter Pin Code"
                          style={{
                            height: 45,
                            width: '90%',
                            borderRadius: 6,
                            borderWidth: 0.6,
                            // marginTop: 20,
                            borderColor: '#62463e',
                            padding: 12,
                          }}
                          keyboardType="number-pad"
                        />
                      )}

                      {/* <Text style={{
                      
                      fontSize:16,
                      margin:5
                  }} >Pincode</Text>
                 {
                     this.state.pin_code !="" ? (
                        <TextInput 
                        // defaultValue={this.state.pin_code.toString()}
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                              height:40,
                              width:240,
                              borderBottomWidth:0.5,
                              borderBottomColor:'black',
                              margin:5
                          }}
                        />
                     ) :(
                        <TextInput 
                        
                        onChangeText={(value) => this.setState({
                            pin_code:value
                        })}
                          placeholder="Enter Pincode"
                          style={{
                              height:40,
                              width:240,
                              borderBottomWidth:0.5,
                              borderBottomColor:'black',
                              margin:5
                          }}
                        />
                     )
                 }
                       */}
                      {/* <TouchableOpacity activeOpacity={0.7}  onPress={() => this.updateProfile()}  style={{
                          height:40,
                          width:200,
                          backgroundColor:'#62463e',
                          marginHorizontal:35,
                          marginTop:40,
                          borderRadius:12,
                          marginBottom:50
                      }} >
                          <Text style={{
                              textAlign:'center',
                              fontSize:18,
                              color:"#FFF",
                             lineHeight:35,
                             marginTop:2
                          }} >Submit</Text>
                      </TouchableOpacity> */}
                    </View>
                    <View />
                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 14,
                        textAlign: 'left',
                        marginBottom: 16,
                      }}>
                      Select Company Logo{' '}
                    </Text>

                    {this.state.camImage2 != '' &&
                    this.state.camImage2 != undefined ? (
                      <View>
                        <Image
                          source={{uri: this.state.camImage2}}
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 80 / 2,
                            marginHorizontal:15
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({imagePickerModalVisible: true, uploadFor: 'company'});
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
                              position: 'absolute',
                              top: 50,
                              left: 80
                          }}>
                          <MIIcon name="edit" color="white" size={15} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={{marginLeft:2}}>
                        {this.state.companyLogo != '' ? (
                          <Image
                            source={{
                              uri: imageUrl + '/' + this.state.companyLogo,
                            }}
                            style={{
                              height: 80,
                              width: 80,
                              borderRadius: 80 / 2,
                              marginLeft: 20,
                            }}
                          />
                        ) : (
                          <View>
                            <Image
                              source={require("../assets/images/userProfile.png")}
                              style={{
                                height: 80,
                                width: 80,
                                borderRadius: 80 / 2,
                                marginLeft: 20,
                              }}
                            />
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => {
                            this.setState({imagePickerModalVisible: true, uploadFor: 'company'});
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
                              position: 'absolute',
                              top: 50,
                              left: 80
                          }}>
                          <MIIcon name="edit" color="white" size={15} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </ScrollView>
                  <View />
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => this.updateProfile()}>
          <View
            style={{
              height: 50,
              width: width,
              backgroundColor: '#62463e',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#FFF',
                fontSize: 18,
              }}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>
        <CustomAlert 
          modelVisible={this.state.imagePickerModalVisible}
          cancelButtonTitle='Gallery'
          alertCancelButtonClick={this.handleGallery}
          successButtonTitle='Camera'
          alertSuccessButtonClick={this.handleCamera}
          Subtitile=''
          title='Upload from:'
          closeModel={() => this.setState({imagePickerModalVisible: false, uploadFor: ''})}
        />
      </View>
    );
  }
}
