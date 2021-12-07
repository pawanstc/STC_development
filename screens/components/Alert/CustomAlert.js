import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import PropTypes from 'prop-types';


function CustomAlert(props) {
    const {
        modelVisible,
        alertSuccessButtonClick,
        alertCancelButtonClick,
        isChildren,
        childrenComponent,
        title,
        Subtitile,
        cancelButtonTitle,
        successButtonTitle,
        isButtonsInOneRow,
        closeModel
    } = props;


    return (
        <Modal visible={modelVisible} transparent={true} onRequestClose={closeModel}>
            <TouchableOpacity style={styles.modelBackground}
            onPress={closeModel}
            >            
            <View style={styles.mainView}>
                <View style={styles.alertView}>
                    <Text style={styles.alertTitle}> {title}</Text>
                    {isChildren ? childrenComponent : null}
                    <Text style={styles.desTitle}> {Subtitile}</Text>
                    <View style={[!isButtonsInOneRow?styles.buttonView:{marginTop:20}]}>
                        {cancelButtonTitle ? (
                            <TouchableOpacity
                                style={[!isButtonsInOneRow?styles.cancelButtonView:styles.isButtonsInOneRowStyle]}
                                onPress={alertCancelButtonClick}>
                                <Text style={styles.cancelButtonText}>{cancelButtonTitle}</Text>
                            </TouchableOpacity>
                        ) : null}
                        {successButtonTitle ? (
                            <TouchableOpacity
                                onPress={alertSuccessButtonClick}
                                style={[!isButtonsInOneRow?styles.successButtonView:styles.isButtonsInOneRowStyle]}>
                                <Text style={styles.successButtonText}>{successButtonTitle}</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
            </TouchableOpacity>
        </Modal>
    );
}

CustomAlert.propTypes = {
    modelVisible: PropTypes.bool,
    isChildren: PropTypes.bool,
    alertSuccessButtonClick: PropTypes.func,
    alertCancelButtonClick: PropTypes.func,
    childrenComponent: PropTypes.func,
    title: PropTypes.string,
    Subtitile: PropTypes.string,
    cancelButtonTitle: PropTypes.string,
    successButtonTitle: PropTypes.string,
    isButtonsInOneRow: PropTypes.bool,
    closeModel: PropTypes.func
};
CustomAlert.defaultProps = {
    modelVisible: false,
    isChildren: false,
    openBuildingModel: null,
    selectBuildingModel: null,
    childrenComponent: null,
    title: 'Alert Title',
    Subtitile: 'Alert Sub Title',
    cancelButtonTitle: 'Cancel',
    successButtonTitle: 'oK',
    isButtonsInOneRow:false,
    closeModel:null
};
export default CustomAlert;
