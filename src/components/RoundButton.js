import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class RoundButton extends Component {

  render() {
    const { submitform, disabled, labelText, color, textColor, width, height, padding, labelTextSize, buttonAlign } = this.props;
    const opacityStyle = disabled ? 0.4 : 0.9;
    //const textSize = fontSize || 16;
    const fontSize = labelTextSize || 16;
    const alignItems = buttonAlign || 'center';
    return (
    <View style={[{ paddingTop: padding, alignItems}, styles.buttonWrapper]}>
      <TouchableOpacity 
      style={[{ backgroundColor: color, width: width, height: height , opacity: opacityStyle }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
        <Text style={[{ color: textColor, fontSize}, styles.text]}>{labelText}</Text>
        {/* <Icon
          name="angle-right"
          color="darkcyan"
          size={32}
          style={styles.icon}
        /> */}
      </TouchableOpacity>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    //alignItems: "center",
    //paddingTop: 0
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    // width: 140,
    // height: 60,
  },
  icon: {
    marginRight: -2,
    marginTop: -2
  },
  text: {
    //color: 'white',
    fontWeight: "700",
    textAlign: 'center'
    //fontSize: 16
  }
});

export default RoundButton;