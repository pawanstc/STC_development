import React from 'react';
import Modal from 'react-native-modal';

function CustomModal(props){
    const { isVisible, backButtonPress, children } = props;

    const onPressBack = () => {
        backButtonPress && backButtonPress();
    }
    return (
        <Modal backdropOpacity={0.3} isVisible={isVisible} onBackButtonPress={onPressBack}>
            {children}
        </Modal>
    );
}

export default CustomModal;