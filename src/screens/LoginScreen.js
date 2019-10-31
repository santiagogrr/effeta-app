import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Button, Label, TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import t from 'tcomb-form-native';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';
import InputField from "../components/InputField";

import auth from '../api/auth'


const Form = t.form.Form;

const User = t.struct({
  email: t.String,
  password: t.String,
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
      isLoading: false
    }
    //this.handleChange = this.handleChange.bind(this);
  }

  static navigationOptions = {
    header : null
  }

  onChangeEmail = (text) => {
    this.setState({
      email: text,
    });
  }

  onChangePassword = (text) => {
    this.setState({
      password: text,
    });
  }

  submitForm = async () => {
    this.setState({
        isLoading: true,
      });
    const request = {"email": this.state.email, "password": this.state.password, "grant_type": "password"};
    try {
      const response = await auth.post('/oauth/token', request)
      await AsyncStorage.setItem('userToken', response.data.access_token)
      this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate('App');
    } catch (error) {
      alert('Usuario incorrecto')
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //     <View style={styles.container}>
    //         <TextInput
    //         style={{height: 40}}
    //         placeholder="Enter fucking mail!"
    //         onChangeText={this.onChangeEmail}
    //         value={this.state.email}
    //         keyboardType='email-address'
    //         autoCapitalize='none'
    //         autoFocus
    //         />
    //         <TextInput
    //         style={{height: 40}}
    //         placeholder="Enter fucking password!"
    //         onChangeText={this.onChangePassword}
    //         value={this.state.password}
    //         autoCapitalize='none'
    //         secureTextEntry={true}
    //         />
    //         <Button
    //         title="Sign Up!"
    //         onPress={this.submitForm}
    //         disabled={this.state.isLoading}
    //         />
    //     </View>
    // </TouchableWithoutFeedback>
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.loginHeader}>Login</Text>
          <InputField 
              labelText="EMAIL ADDRESS" 
              labelTextSize={14} 
              labelColor={'white'} 
              textColor={'white'} 
              borderBottomColor={'white'} 
              inputType="email"
              keyboardType='email-address'   
              onChangeText={this.onChangeEmail}
            />
            <InputField 
              labelText="PASSWORD" 
              labelTextSize={14} 
              labelColor={'white'} 
              textColor={'white'} 
              borderBottomColor={'white'} 
              inputType="password"
              onChangeText={this.onChangePassword}

            />
            <Button
            title="Sign Up!"
            onPress={this.submitForm}
            disabled={this.state.isLoading}
            />
        </ScrollView>
      </View>
   </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      marginTop: 50,
      padding: 20,
      backgroundColor: '#ffffff',
    },
    wrapper: {
      display: "flex",
      flex: 1,
      backgroundColor: 'mediumseagreen'
    },
    scrollViewWrapper: {
      marginTop: 70,
      flex: 1
    },
    avoidView: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 20,
      flex:1
     },
    loginHeader: {
      fontSize: 28,
      color: 'white',
      fontWeight: "300",
      marginBottom: 40
    }
  });

export default LoginScreen