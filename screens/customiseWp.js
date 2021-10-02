import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import TabComponnet from '../screens/TabnarComponent.js';
import {URL, imageUrl, FileUploadURL} from '../api.js';

import TaqbContainer from '../screens/TabnarComponent.js';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'uuid-random';
import * as Progress from 'react-native-progress';

let {height, width} = Dimensions.get('screen');
let imagesGrid = [];
export default class customiseComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUpload: '',
      photo: '',
      photo2: '',
      Quantity: '1',
      height: '',
      width: '',
      imageObj2: {},
      photo2Arr: [],
      imageId: 1,
      progressStat: false,
      progress: '',
      quantity: '',
      uploadFile: {},
      image_flag: '',
      fileObj: null,
    };
  }

  componentDidMount() {
    if (width > height) {
      let temp = width;
      width = height;
      height = temp;
    }
    console.log('catlog pattenr_id' + this.props.route.params.image_id);

    console.log('flag' + this.props.route.params.flag);
    if (this.props.route.params.image) {
      this.setState({
        photo: this.props.route.params.image,
        imageObj2: this.props.route.params.imageObj,
        height: this.props.route.params.height,
        width: this.props.route.params.width,
        image_flag: this.props.route.params.imge_flag,
      });
    }
  }

  handleChooseImage = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Stc alert',
        message: 'Stc need to Access your File',
        buttonNutral: 'ask Me latter',
        buttonNegetive: 'No',
        buttonPositive: 'yes',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openPicker({
        multiple: true,
      }).then((image) => {
        console.log(image);
        let tempArray = [];
        image.forEach((value) => {
          var image = {
            uri: value.path,
            id: this.state.imageId++,
          };
          tempArray.push(image);
          this.setState({
            photo2Arr: [...this.state.photo2Arr, ...tempArray],
          });
          console.log(photo2Arr);
        });

        console.log(tempArray);
      });
    } else {
      alert('Please try again latter');
    }
  };

  launchCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'STC alert',
        message: 'STC needs to access your Camera ',
        buttonNutral: 'ask me latter',
        buttonPositive: 'Yes',
        buttonNegetive: 'No',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('yes');
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
      }).then((image) => {
        this.setState({
          photo: image.path,
        });
      });
    } else {
      alert('Please Try again Latter');
    }
  };

  launchCamera2 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'STC alert',
        message: 'STC needs to access your Camera ',
        buttonNutral: 'ask me latter',
        buttonPositive: 'Yes',
        buttonNegetive: 'No',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
      }).then((image) => {
        var ImageObj = {
          uri: image.path,
          id: uuid(),
        };

        let tempImage = [];
        tempImage.push(ImageObj);
        console.log(tempImage);

        this.setState({
          photo2Arr: [...this.state.photo2Arr, ...tempImage],
        });

        var form = new FormData();

        this.state.photo2Arr.forEach((item, i) => {
          form.append('image', {
            uri: item.uri,
            type: 'image/' + item.uri.split('.').pop(),
            name: item.uri.replace(/^.*[\\\/]/, ''),
          });
        });

        var xhr = new XMLHttpRequest();

        xhr.open('POST', FileUploadURL+'/postjob.php');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(form);

        if (xhr.upload) {
          xhr.upload.onprogress = ({total, loaded}) => {
            this.setState({
              progress: loaded / total,
              progressStat: true,
            });
          };
        }

        setTimeout(() => {
          this.setState({
            progressStat: false,
          });
        }, 1100);
      });

      // upload image code
    } else {
      alert('Please Try again Latter');
    }
  };
  quantity1 = (qty) => {
    let q = Number(qty);
    this.setState({
      Quantity: q + 1,
    });
  };

  quantity2 = (qty) => {
    let q = Number(qty);
    if (qty <= 1) {
    } else {
      this.setState({
        Quantity: q - 1,
      });
    }
  };

  orderSubmit = () => {
    console.log(this.props.route.params.flag);
    if (
      this.state.height == '' &&
      this.state.width == '' &&
      this.state.photo == ''
    ) {
      Alert.alert(
        'Validation Error',
        'Please select pattern before submitting.',
      );
      return;
    } else if (this.state.photo == '' || this.state.uploadFile == '') {
      Alert.alert(
        'Validation Error',
        'Please Add Image File Or Select Pattern',
      );
      return;
    } else if (this.state.height == '' && this.state.width == '') {
      Alert.alert('Validation Error', 'Please enter width and height');
      return;
    } else if (this.state.height == undefined) {
      Alert.alert('Validation Error', 'Please enter height');

      return;
    } else if (this.state.width == undefined) {
      Alert.alert('Validation Error', 'Please enter width');

      return;
    } else if (this.state.height == '') {
      Alert.alert('Validation Error', 'Please enter height');

      return;
    } else if (this.state.width == '') {
      Alert.alert('Validation Error', 'Please enter width');

      return;
    }

    if (this.props.route.params.flag == null) {
      if (JSON.stringify(this.state.fileObj) != null) {
        console.log('file object is not null ');
        this.props.navigation.navigate('description', {
          supportImages: this.state.photo2Arr,
          imageObj: this.props.route.params.imageObj,
          fileObj: this.state.fileObj,
          image_id: this.props.route.params.image_id,
          height: this.state.height,
          width: this.state.width,
          fileupload: this.state.uploadFile,
          quantity: this.state.Quantity,
          patternUrl: this.props.route.params.image,
          imge_flag: this.state.image_flag,
        });
      } else {
        this.props.navigation.navigate('description', {
          supportImages: this.state.photo2Arr,
          imageObj: this.props.route.params.imageObj,
          fileObj: this.props.route.params.file,
          image_id: this.props.route.params.image_id,
          height: this.state.height,
          width: this.state.width,
          fileupload: this.state.uploadFile,
          quantity: this.state.Quantity,
          patternUrl: this.props.route.params.image,
          imge_flag: this.props.route.params.flag,
        });
      }
    } else if (this.props.route.params.flag == undefined) {
      this.props.navigation.navigate('description', {
        supportImages: this.state.photo2Arr,
        imageObj: this.props.route.params.imageObj,
        fileObj: this.state.fileObj,
        image_id: this.props.route.params.image_id,
        height: this.state.height,
        width: this.state.width,
        fileupload: this.state.uploadFile,
        quantity: this.state.Quantity,
        patternUrl: this.props.route.params.image,
        imge_flag: this.props.route.params.flag,
      });
    } else {
      this.props.navigation.navigate('description', {
        supportImages: this.state.photo2Arr,
        imageObj: this.props.route.params.imageObj,
        fileObj: this.props.route.params.file,
        image_id: this.props.route.params.image_id,
        height: this.state.height,
        width: this.state.width,
        fileupload: this.state.uploadFile,
        quantity: this.state.Quantity,
        patternUrl: this.props.route.params.image,
        imge_flag: this.props.route.params.flag,
      });
    }
  };

  uploadSupportiveImage = () => {
    var form = new FormData();

    this.state.photo2Arr.forEach((item, i) => {
      form.append('image', {
        uri: item.uri,
        type: 'image/' + item.uri.split('.').pop(),
        name: item.uri.replace(/^.*[\\\/]/, ''),
      });
    });

    var xhr = new XMLHttpRequest();

    xhr.open('POST', FileUploadURL+'/postjob.php');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(form);

    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        this.setState({
          progress: loaded / total,
          progressStat: true,
        });
      };
    }

    setTimeout(() => {
      this.setState({
        progressStat: false,
      });
    }, 1100);
  };
  selectImageFromGalary = async () => {
    this.setState({
      image_flag: '2',
    });
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Stc alert',
        message: 'Stc need to Access your File',
        buttonNutral: 'ask Me latter',
        buttonNegetive: 'No',
        buttonPositive: 'yes',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openPicker({
        multiple: true,
      }).then((image) => {
        console.log(image);
        let tempArray = [];
        image.forEach((value) => {
          var image = {
            uri: value.path,
            id: uuid(),
          };
          tempArray.push(image);
        });
        this.setState({
          photo2Arr: [...this.state.photo2Arr, ...tempArray],
        });

        var form = new FormData();

        this.state.photo2Arr.forEach((item, i) => {
          form.append('image', {
            uri: item.uri,
            type: 'image/' + item.uri.split('.').pop(),
            name: item.uri.replace(/^.*[\\\/]/, ''),
          });
        });

        var xhr = new XMLHttpRequest();

        xhr.open('POST', FileUploadURL+'/postjob.php');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(form);

        if (xhr.upload) {
          xhr.upload.onprogress = ({total, loaded}) => {
            this.setState({
              progress: loaded / total,
              progressStat: true,
            });
          };
        }

        setTimeout(() => {
          this.setState({
            progressStat: false,
          });
        }, 1100);
      });
    } else {
      alert('Please try again latter');
    }
  };

  selectMultiPleImage = () => {
    console.log('success');
  };

  addMore = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Stc alert',
        message: 'Stc need to Access your File',
        buttonNutral: 'ask Me latter',
        buttonNegetive: 'No',
        buttonPositive: 'yes',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openPicker({
        multiple: false,
      }).then((image) => {
        console.log(image);
        let tempArray = [];
        image.forEach((value) => {
          var image = {
            uri: value.path,
            id: uuid(),
          };
          tempArray.push(image);
          this.setState({
            photo2Arr: [...this.state.photo2Arr, ...tempArray],
          });
          console.log(photo2Arr);
        });

        console.log(tempArray);
      });
    } else {
      alert('Please try again latter');
    }
  };

  deleteImage = async (id) => {
    Alert.alert(
      'STC alert',
      'Are you sure to delete custom image ??',
      [
        {
          text: 'yes',
          onPress: async () => {
            let newArray = [];
            newArray = this.state.photo2Arr;

            const deltedItem = newArray.find((item) => item.id === id);
            const index = await newArray.indexOf(deltedItem);
            newArray.splice(index, 1);
            if (index > -1) {
              this.setState({
                photo2Arr: newArray,
              });
            }
          },
        },
        {text: 'No', onPress: () => null},
      ],
      {
        cancelable: false,
      },
    );

    console.log(this.state.photo2Arr);
  };
  uploadFile = async () => {
    console.log('yes');
    this.setState({
      image_flag: '',
    });
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Stc alert',
        message: 'Stc need to Access your File',
        buttonNutral: 'ask Me latter',
        buttonNegetive: 'No',
        buttonPositive: 'yes',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.openPicker({}).then((image) => {
        this.setState({
          photo: image.path,
          uploadFile: image,
          fileObj: image,
          image_flag: '2',
        });

        var form = new FormData();

        var filename = image.path.replace(/^.*[\\\/]/, '');

        form.append('image', {
          uri: image.path,
          type: image.mime,
          name: filename,
        });
        console.log({
          uri: image.path,
          type: image.mime,
          name: filename,
        });

        var xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          FileUploadURL+'/edit_pattern.php',
        );
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(form);
        console.log(xhr);

        if (xhr.upload) {
          xhr.upload.onprogress = ({total, loaded}) => {
            this.setState({
              progress: loaded / total,
              progressStat: true,
            });
          };
        } else {
          alert('Image not uplaoded');
        }

        setTimeout(() => {
          this.setState({
            progressStat: false,
          });
        }, 1100);
      });
    } else {
      alert('Please try again latter');
    }
  };

  render() {
    console.log(this.state.height);
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
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
              activeOpacity={2}
              onPress={() => this.props.navigation.navigate('home')}>
              <Icon
                name="arrow-back"
                color="#FFF"
                size={20}
                style={{
                  margin: 20,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: '#FFF',
                margin: 18,
              }}>
              Customized Wallpaper
            </Text>
            <View
              style={{
                height: 40,
                width: 50,
              }}></View>
          </View>

          <View
            style={{
              height: height,
              width: width * 0.94,
              position: 'absolute',
              top: 78,
              //left:20,
              //right:0,
              alignItems: 'center',
              justifyContent: 'space-around',
              alignSelf: 'center',

              backgroundColor: '#FFF',
              borderTopRightRadius: 18,
              borderTopLeftRadius: 18,
              flex: 1,
            }}>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 120,
              }}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    margin: 13,
                    color: '#404040',
                    alignSelf: 'flex-start',
                  }}>
                  Select Image{' '}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {this.state.photo ? (
                    <View
                      style={{
                        alignSelf: 'center',
                        backgroundColor: '#fafafa',
                        elevation: 5,
                        marginHorizontal: 10,
                      }}>
                      <Image
                        source={{uri: this.state.photo}}
                        style={{
                          height: width * 0.3,
                          width: width * 0.35
                          // width: width * 0.5,
                          //marginBottom:40
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        height: 110,
                        width: 120,
                        elevation: 5,
                        marginHorizontal: 10,
                      }}>
                      {this.props.route.params.image == '' ? (
                        <Image
                          source={require('../assets/uload3.jpg')}
                          style={{
                            height: 110,
                            width: 120,
                            marginLeft: 6,
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../assets/uload3.jpg')}
                          style={{
                            height: 110,
                            width: 120,
                            marginLeft: 6,
                          }}
                        />
                      )}
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'column',
                      width: width * 0.5,
                      alignItems: 'stretch',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        //marginLeft:width*0.1
                      }}>
                      <View
                        style={{
                          backgroundColor: '#62463e',
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                          marginTop: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          //marginLeft:10
                        }}>
                        <TouchableOpacity
                          activeOpacity={2}
                          onPress={() =>
                            this.props.navigation.navigate('customCatelog')
                          }>
                          <Image
                            source={require('../assets/menu.jpg')}
                            style={{
                              height: 20,
                              width: 28,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        activeOpacity={2}
                        onPress={() =>
                          this.props.navigation.navigate('customCatelog')
                        }>
                        <Text
                          style={{
                            textAlign: 'center',

                            margin: 12,
                            fontSize: 16,
                            color: '#404040',
                          }}>
                          Select A Pattern
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        color: 'grey',
                        marginLeft: width * 0.2,
                        fontSize: 14,
                      }}>
                      --- Or ---
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        //marginLeft:width*0.1
                      }}>
                      <View
                        style={{
                          backgroundColor: '#62463e',
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                          marginTop: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          //marginLeft:10
                        }}>
                        <TouchableOpacity
                          activeOpacity={2}
                          onPress={() => this.uploadFile()}>
                          <Icon
                            name="cloud-upload-outline"
                            size={18}
                            color="#FFF"
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => this.uploadFile()}>
                        <Text
                          style={{
                            textAlign: 'center',
                            margin: 12,
                            marginHorizontal: 20,
                            fontSize: 16,
                            color: '#404040',
                          }}>
                          Upload File
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../assets/desc_01.jpg')}
                    style={{
                      height: width * 0.37,
                      width: width * 0.6,

                      marginTop: 10,
                      marginBottom: 20,
                      marginRight: 6,
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Bold',
                        margin: 4,
                        fontSize: 12,
                        color: '#404040',
                      }}>
                      Wall Dimension :
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontColor: 'grey',
                        fontSize: 12,
                      }}>
                      (in inches)
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        margin: 9,
                      }}>
                      W
                    </Text>
                      <TextInput
                        placeholder="Width"
                        defaultValue={this.state.width.toString()}
                        onChangeText={(value) =>
                          this.setState({
                            width: value,
                          })
                        }
                        style={{
                          width: width * 0.15,
                          height: 40,
                          borderWidth: 0.2,
                          borderRadius: 5,
                          textAlign: 'center',
                        }}
                        keyboardType="numeric"
                      />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        marginTop: 10,
                        marginLeft: 10,
                      }}>
                      {' '}
                      ×{' '}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        margin: 10,
                      }}>
                      H
                    </Text>
                      <TextInput
                        placeholder="Height"
                        onChangeText={(value) =>
                          this.setState({
                            height: value,
                          })
                        }
                        style={{
                          width: width * 0.15,
                          height: 40,
                          borderWidth: 0.2,
                          borderRadius: 5,

                          textAlign: 'center',
                        }}
                        defaultValue={this.state.height.toString()}
                        keyboardType="numeric"
                      />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Bold',
                      fontSize: 12,
                      margin: 8,
                      marginTop: 25,
                      color: '#404040',
                    }}>
                    Quantity :
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 30,
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      activeOpacity={2}
                      onPress={() => this.quantity2(this.state.Quantity)}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 28,
                          width: 28,
                          borderRadius: 28 / 2,
                          borderWidth: 0.4,
                          borderRadiusColor: 'black',
                          marginHorizontal: 10,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                          }}>
                          -
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: width * 0.2,
                        height: 30,
                        borderRadius: 13,
                        borderColor: 'black',
                        borderWidth: 0.3,
                      }}>
                      <Text
                        onChangeText={(value) =>
                          this.setState({
                            quantity: value,
                          })
                        }
                        style={{
                          textAlign: 'center',
                          marginTop: 5,
                        }}>
                        {this.state.Quantity}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={2}
                      onPress={() => this.quantity1(this.state.Quantity)}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 28,
                          width: 28,
                          borderRadius: 28 / 2,
                          borderWidth: 0.4,
                          borderRadiusColor: 'black',
                          marginHorizontal: 10,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 13,
                          }}>
                          +
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 14,
                      marginTop: 14,
                      width: 300,
                      lineHeight: 20,
                      color: '#404040',
                      textAlign: 'center',
                    }}>
                    Maximum 300dpi with size of 6mb to 7mb required in pdf or ai
                    format
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.6,
                    borderBottomColor: 'black',
                    marginTop: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />

                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 14,
                    textAlign: 'center',
                    marginBottom: 6,
                    color: '#404040',
                  }}>
                  Add Supporting Images (Custom or wall Image){' '}
                </Text>

                {this.state.photo2 ? (
                  <Image
                    source={{uri: this.state.photo2}}
                    style={{
                      height: 120,
                      width: 120,
                    }}
                  />
                ) : null}
                {this.state.photo2Arr.length > 0 ? (
                  <View>
                    <FlatList
                      showsHorizontalScrollView={false}
                      data={this.state.photo2Arr}
                      horizontal
                      contentContainerStyle={{
                        paddingBottom: 20,
                      }}
                      renderItem={(items, index) => {
                        console.log(items.item.id);
                        return (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 1,
                            }}>
                            <TouchableOpacity
                              onPress={() => this.deleteImage(items.item.id)}>
                              <Image
                                source={{uri: items.item.uri}}
                                style={{
                                  height: 140,
                                  width: 160,
                                  margin: 12,
                                }}
                              />
                              <Text
                                style={{
                                  textAlign: 'center',
                                }}>
                                Attachment
                              </Text>

                              <Icon
                                name="close"
                                style={{
                                  position: 'absolute',
                                  top: 70,
                                  left: 80,
                                  right: 0,
                                }}
                                size={30}
                                color="red"
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                      keyExtractor={(item) => item.id}
                    />

                    {/* <View style={{
  width:200,
  marginLeft:40,
  marginTop:30
}} >
  <Button
  onPress={() =>  this.uploadSupportiveImage()}
  title="Upload"
  color="#62463e"
  accessibilityLabel="Learn more about this purple button"
/>

  </View> */}
                  </View>
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={2}
                    onPress={() => this.launchCamera2()}>
                    <Text
                      style={{
                        fontSize: 15,

                        marginTop: 15,
                        marginHorizontal: 10,
                      }}>
                      Capture Image
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      backgroundColor: '#62463e',
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      marginTop: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <TouchableOpacity
                      activeOpacity={2}
                      onPress={() => this.launchCamera2()}>
                      <Icon name="camera-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    activeOpacity={2}
                    onPress={() => this.selectImageFromGalary()}>
                    <View
                      style={{
                        backgroundColor: '#62463e',
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 5,
                      }}>
                      <Image
                        source={require('../assets/menu.jpg')}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={2}
                    onPress={() => this.selectImageFromGalary()}>
                    <Text
                      style={{
                        fontSize: 15,

                        marginTop: 15,
                        marginHorizontal: 10,
                      }}>
                      Select Image
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 90,
                  }}>
                  Any special image to be appended on Wall
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity activeOpacity={2} onPress={() => this.orderSubmit()}>
          <View
            style={{
              alignItems: 'center',
              height: 45,
              width: width,

              backgroundColor: '#62463e',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                alignItems: 'center',
                color: '#FFF',
                fontSize: 18,
              }}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
