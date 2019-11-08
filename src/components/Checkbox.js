import React, { Component } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class Checkbox extends Component {

  render() {
    const { selected, onPress, style, textStyle, size = 30, color, text = ''} = this.props;
    return (
    <TouchableOpacity 
    style={[styles.checkBox, style]} 
    onPress={onPress}>
        <Icon
          size={size}
          color={color}
          name={ selected ? 'check-circle' : 'checkbox-blank-circle-outline'}
        />
        <Text style={textStyle}> {text} </Text>
    </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  checkBox: {
      flexDirection: 'row',
      alignItems: 'center'
  }
});

export default Checkbox;