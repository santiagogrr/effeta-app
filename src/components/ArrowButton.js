import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class ArrowButton extends Component {

  render() {
    const { submitform, disabled } = this.props;
    const opacityStyle = disabled ? 0.2 : 0.8;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ opacity: opacityStyle }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
        <Icon
          name="angle-right"
          color="darkcyan"
          size={32}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: "flex-end",
    right: 20,
    bottom: 20,
    paddingTop: 0
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: 'white'
  },
  icon: {
    marginRight: -2,
    marginTop: -2
  }
});

export default ArrowButton;