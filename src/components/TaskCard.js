import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

class TaskCard extends Component {

  render() {
    const { statusIcon, submitform, disabled, labelText, color, labelColor, icon, iconColor, labelTextSize, points} = this.props;
    const fontSize = labelTextSize || 16;
    const opacityStyle = disabled ? 0.4 : 1;
    return (
    <TouchableOpacity style={[{opacity: opacityStyle }, styles.buttonWrapper]}
    onPress={submitform}
    disabled={disabled}>
      <View style={[{ backgroundColor: color }, styles.iconButton]}>
        <View>
          <Icon
          name={icon}
          color= {iconColor}
          size={30}
          style={styles.icon}
          />
        </View>
      </View>
      <View style={styles.button}>
        <View style={styles.TaskText}>
          <Text style={[{ color: labelColor, fontSize}, styles.text]}>{labelText}</Text>
          {points ? (<Text style={[styles.subtext]}>{points}</Text>) : null}
        </View>
          {statusIcon !== null ? (<Icon
          name={statusIcon}
          color= {'darkcyan'}
          size={34}
          style={styles.status}
          />) : null}
      </View>
    </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    //flexWrap: 'wrap',
  },
  button: {
    borderRadius: 5,
    height: 65,
    flex: 7,
    flexDirection: 'row',
    backgroundColor: '#E8E8E8'
  },
  TaskText: {
    flex: 8,
    paddingLeft: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  status: {
    flex: 2,
    alignSelf: 'center',
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'flex-end',
    borderRadius: 5,
    flex: 1,
    height: 65,
    padding: 8,
  },
  text: {
    fontWeight: "700",
  },
  subtext: {
    fontWeight: "500",
    color: '#787878',
    fontSize: 14
  },
});

export default TaskCard;