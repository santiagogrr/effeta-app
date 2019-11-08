import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";

class FloatingButton extends Component {

  render() {
    const { submitform, disabled
        , color } = this.props;
    return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
      style={[{ backgroundColor: color }, styles.button]}
      onPress={submitform}
      disabled={disabled}
      >
          <Image
          source={require('../../assets/unnamed.png')}
          style={styles.icon}
          />
        {/* <Icon
          name="plus-circle"
          color="#4747d1"
          size={70}
          style={styles.icon}
        /> */}
      </TouchableOpacity>
    </View>
    )
  }
}
//source={require('../../assets/data1.json')}

const styles = StyleSheet.create({
  buttonWrapper: {
    // flex: 1,
    //backgroundColor: '#F5F5F5',
  },
  button: {
    position: 'absolute',
    // width: 50,
    // height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right:30,
    bottom: 30,
    shadowColor: "black",
    shadowOffset: { height: 1},
    shadowOpacity: 0.5,
  },
  icon: {
    // marginRight: -2,
    // marginTop: -2,
    //borderRadius: 20,
    resizeMode: 'contain',
    width: 65,
    height: 65,
  },
  text: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16
  }
});

export default FloatingButton;