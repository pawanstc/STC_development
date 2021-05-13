import React from 'react';
 
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily:'Roboto',
  },
});

export default function fixOppoTextCutOff() {
  const oldRender = Text.prototype.render;
  Text.prototype.render = function render(...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
     
      style: [styles.defaultFontFamily, origin.props.style],
    });
  };
}