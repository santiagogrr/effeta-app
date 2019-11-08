import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class LogoutButton extends Component {

  render() {
    const { submitform, disabled, labelText } = this.props;
    const opacityStyle = disabled ? 0.4 : 0.8;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ opacity: opacityStyle }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
        <Text style={styles.text}>{labelText}</Text>
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
    alignItems: "center",
    paddingTop: 0
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    width: 260,
    height: 60,
    backgroundColor: 'black'
  },
  icon: {
    marginRight: -2,
    marginTop: -2
  },
  text: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16
  }
});

export default LogoutButton;