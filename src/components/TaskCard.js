import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class TaskCard extends Component {

  render() {
    const { submitform, disabled, labelText, color, labelColor, icon, iconColor } = this.props;
    const opacityStyle = disabled ? 0.4 : 0.8;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ backgroundColor: color, opacity: opacityStyle }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
        <View style={styles.iconWrapper}>
          <Icon
          name={icon}
          color= {iconColor}
          size={28}
          style={styles.icon}
          />
        </View >
        <View style={styles.textWrapper}>
          <Text style={[{ color: labelColor}, styles.text]}>{labelText}</Text>
        </View>
      </TouchableOpacity>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    //alignItems: "flex-start",
    padding: 11
  },
  iconWrapper: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10
  },
  textWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10
  },
  button: {
    // alignItems: "center",
    // justifyContent: "center",
    borderRadius: 20,
    width: 135,
    height: 100,
    //borderWidth: 1,
  },
  icon: {
    marginRight: 0,
    marginTop: 0
  },
  text: {
    //color: 'blue',
    fontWeight: "700",
    fontSize: 16
  }
});

export default TaskCard;