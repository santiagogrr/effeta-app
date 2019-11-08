import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class ListItem extends Component {

  handleDelete = (id) => {

    alert(id)

  }

  render() {
    const { submitform, handleDelete, disabled, firstLine, secondLine, color, labelColor, icon, iconColor } = this.props;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ backgroundColor: color }, styles.button1]}
      onPress={submitform}
      disabled={disabled}
      >
      <View style={styles.textWrapper}>
          <Text style={[styles.text1]}>{firstLine}</Text>
          <Text style={[styles.text2]}>Puntos: {secondLine}</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity 
      style={[styles.button2]}
      onPress = {handleDelete}
      //onPress={() => this.handleDelete(id)}
      disabled={disabled}
      >
      <View style={styles.iconWrapper}>
        <Icon
        name={icon}
        color= {iconColor}
        size={28}
        style={styles.icon}
        />
      </View>
      </TouchableOpacity>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    //alignItems: "flex-start",
    padding: 8,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignItems: 'flex-start',
    //justifyContent: "flex-start",
  },
  iconWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    //alignContent: 'flex-end',
    //flexDirection: 'row',
  },
  textWrapper: {
    justifyContent: "center",
    padding: 5
  },
  button1: {
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 10,
    width: 250,
    height: 80,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    padding: 5,
  },
  button2: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 40,
    height: 50,
    padding: 5,
  },
  text1: {
    //color: 'blue',
    fontWeight: "600",
    fontSize: 20,
    paddingBottom: 5
  },
  text2: {
    //color: 'blue',
    fontWeight: "500",
    color: '#787878',
    fontSize: 16
  }
});

export default ListItem;