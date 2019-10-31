import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

class InputField extends Component {
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
        {inputType === "password" ? (
          <TouchableOpacity
            style={styles.showButton}
            onPress={this.toggleShowPassword}
          >
            <Text style={styles.showButtonText}>
              {secureInput ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          style={[
            { color: inputColor, borderBottomColor: borderBottom },
            styles.inputField
          ]}
          secureTextEntry={secureInput}
          value={inputValue}
          onChangeText={this.onChangeText}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    marginBottom:40
  },
  label: { 
    fontWeight: "700", 
    marginBottom: 10 
    },
  inputField: {
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5
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
export default InputField;