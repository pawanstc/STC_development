import React, {useState, useRef} from 'react';
import moment from 'moment';
import { StyleSheet, View, Text, FlatList } from 'react-native';

function Trail(props) {
  const {statusList} = props;

  const renderPage = (rowData) => {
    const {item, index} = rowData;
    return (
      <View style={[styles.rowItem, index === 0 ? {paddingTop: 20} : {}]}>
        <View style={[index === 0 ? styles.roundContainerFirstPriority : styles.roundContainer]}>
            <Text style={[styles.priorityText, index === 0 ? {color: '#fbbc04', fontWeight: 'bold'} : {}]}>{item.priority}</Text>
        </View>
        {statusList.length -1 !== index ? <View style={styles.tail} /> : null}
        <View>
            <Text style={styles.title}>{item.label}</Text>
            <Text style={styles.body}>{moment(item.dataTime).format("MMMM Do YYYY, h:mm:ss a")}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flexGrow: 1 }}
        data={statusList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderPage}
      />
    </View>
  );
}

export default Trail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  rowItem: {
    // flex: 3,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10
  },
  roundContainer: {
    padding: 6, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    backgroundColor: '#fbbc04',
    borderColor: '#fbbc04',
    height: 28, 
    width: 28, 
    borderRadius: 14,
    marginRight: 10,
    zIndex: 111
},
roundContainerFirstPriority: {
  padding: 6, 
  justifyContent: 'center', 
  alignItems: 'center', 
  borderWidth: 2, 
  borderColor: '#fbbc04',
  height: 28, 
  width: 28, 
  borderRadius: 14,
  marginRight: 10,
  zIndex: 111
},
priorityText: {
  color: '#ffffff', 
  fontSize: 10
},
tail: {
    width: 2, 
    backgroundColor: '#fbbc04', 
    top: 28, 
    left: -25
},
  title: {
    flex: 1,
    fontSize: 14,
    color: 'black',
  },
  body: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    paddingBottom: 30,
  },
});