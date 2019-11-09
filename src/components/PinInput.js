import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

class PinInput extends Component {
  constructor(props) {
    super(props);
      this.state = {
        secureInput: (this.props.inputType === "text" || this.props.inputType === "email") ? false: true,
        inputValue: props.defaultValue,
    }
  }

  toggleShowPassword = () => {
    this.setState({ 
      secureInput: !this.state.secureInput 
    });
  }

  onChangeText = (text) =>  {
    this.props.onChangeText(text);
    this.setState({ inputValue: text });
  }

  render() {
    const { secureInput, inputValue } = this.state
    const {
        labelText,
        labelTextSize,
        labelColor,
        textColor,
        borderBottomColor,
        inputType,
        customStyle,
        defaultValue,
        onChangeText,
      } = this.props;
      const color = labelColor;
      const fontSize = labelTextSize;
      const inputColor = textColor ;
      const borderBottom = borderBottomColor || "transparent";
    return (
        <View style={[customStyle, styles.wrapper]}>
        <Text style={[{ color, fontSize }, styles.label]}>{labelText}</Text>
        <TextInput
          maxLength={4}
          keyboardType='number-pad'
          placeholder='Enter here'
          placeholderTextColor='#D3D3D3'
          autoCorrect={false}
          autoCapitalize='none'
          style={[
            { color: inputColor, borderBottomColor: borderBottom },
            styles.inputField
          ]}
          secureTextEntry={secureInput}
          value={inputValue}
          onChangeText={onChangeText}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    marginBottom:35
  },
  label: { 
    fontWeight: "700", 
    marginBottom: 10 
    },
  inputField: {
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 22,
    textAlign: 'center'
  },
  showButton: {
    position: "absolute",
    right: 0
  },
  showButtonText: {
    color: 'white',
    fontWeight: "700"
  }
});
export default PinInput;