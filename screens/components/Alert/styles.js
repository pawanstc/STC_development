const React = require('react-native');
const {
    StyleSheet,
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modelBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    mainView: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        position: 'absolute',


    },
    alertView: {
        backgroundColor: 'rgba(203, 203, 203, 1.0)',
        justifyContent: 'center',
        marginHorizontal: 52,
        borderRadius: 10

    },
    alertTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        color: 'black',
        marginTop: 19,
    },
    desTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 13,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center',
        color: 'black',
        marginTop: 4,
        marginHorizontal: 20
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    
    cancelButtonView: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(60, 60, 67, 0.29)',
        borderRightColor: 'rgba(60, 60, 67, 0.29)',
        flex: 1
    },
    isButtonsInOneRowStyle: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(60, 60, 67, 0.29)',
    },
    successButtonView: {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: 'rgba(60, 60, 67, 0.29)',
        borderLeftColor: 'rgba(60, 60, 67, 0.29)',
        flex: 1
    },
    successButtonText: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Roboto',
        fontSize: 17,
        fontWeight: 'normal',
        fontStyle: 'normal',
        marginVertical: 12
    },
    cancelButtonText: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Roboto',
        fontSize: 17,
        fontWeight: 'normal',
        fontStyle: 'normal',
        marginVertical: 12
    },


});
export default styles;

