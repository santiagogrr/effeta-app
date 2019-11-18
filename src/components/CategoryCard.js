import React, { Component } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class CategoryCard extends Component {

  render() {
    const { submitform, disabled, labelText, color, labelColor, icon, iconColor, fontWeight } = this.props;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ backgroundColor: color }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
        <View style={styles.iconWrapper}>
          <Icon
          name={icon}
          color= {iconColor}
          size={26}
          style={styles.icon}
          />
        </View>
        {/* <View style={styles.textWrapper}>
          <Text style={[{ color: labelColor}, styles.text]}>{labelText}</Text>
        </View> */}
      </TouchableOpacity>
      <Text style ={[{ color: labelColor, fontWeight: fontWeight}, styles.subtext]}>{labelText}</Text>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    //alignItems: "flex-start",
    padding: 8,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    //alignItems: "center",
    // paddingTop: 8,
    // paddingLeft: 5
    // paddingRight: 10
  },
  textWrapper: {
    // alignItems: "flex-start",
    justifyContent: "center",
    padding: 5
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 62,
    height: 62,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 5
    //borderWidth: 1,
  },
  text: {
    //color: 'blue',
    fontWeight: "400",
    fontSize: 15
  },
  subtext: {
    fontSize: 13,
    paddingTop: 10,
    //fontWeight: "300",
    alignSelf: 'center',
  },
});

export default CategoryCard;