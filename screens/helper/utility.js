import { Image, PermissionsAndroid, Platform, Linking } from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'
import Toast from 'react-native-simple-toast'
import RNFetchBlob from 'rn-fetch-blob'

const { config, fs } = RNFetchBlob
const isIOS = Platform.OS === 'ios'

export const showToastMessage = (message, duration) => {
    const toastDuration = duration === 'long' ? Toast.LONG : Toast.SHORT
    return Toast.show(message, toastDuration)
}

async function requestPermission(permission) {
  return PermissionsAndroid.request(permission)
}

export async function checkAndroidHardwarePermission(permission) {
    const haveAndroidHardwarePermission = await PermissionsAndroid.check(permission)
    return haveAndroidHardwarePermission
  }

export const haveAndroidHardwarePermission = async (permission, hardware) => {
    const havePermission = await checkAndroidHardwarePermission(permission)
    if (!havePermission) {
      const havePermission = await requestPermission(permission, hardware)
      return havePermission
    }
    return true
}

export const downloadFile = (filePathUrl, cbUrl) => {
  const uri = filePathUrl
  const type = filePathUrl.split('.')
  const fileType = type[type.length - 1]

  const modifiedFileName = uri.slice(uri.indexOf('upload/') + 7)

  async function getPermissionAndDownload() {
    const haveWriteExternalStoragePermission =
    isIOS ? true : await haveAndroidHardwarePermission('android.permission.WRITE_EXTERNAL_STORAGE', 'storage')

    if (haveWriteExternalStoragePermission) {
      if (isIOS) {
        if (fileType !== 'pdf') {
          CameraRoll.saveToCameraRoll(uri)
            .then(() => {
              showToastMessage('Saved successfully')
            })
            .catch(() => {
              showToastMessage('Error while saving')
            })
        } else {
          Linking.openURL(uri)
        }
      } else {
        const downloadDir = fs.dirs.DownloadDir
        const options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${downloadDir}/STC/${modifiedFileName}`,
            description: 'Downloading file.'
          }
        }
        config(options)
          .fetch('GET', uri)
          .then(res => {
              if (res.data) {
                if (cbUrl) {
                    cbUrl(res.data);
                } else {
                    showToastMessage(`${res.data}`)
                }
              }
          })
      }
    } else {
      showToastMessage('no permission')
    }
  }

  getPermissionAndDownload()
}