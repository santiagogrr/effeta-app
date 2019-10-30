import React, { Component } from 'react'
import { Button, Label, TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import t from 'tcomb-form-native';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';

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
    const request = {"email": this.state.email, "password": this.state.password, "grant_type": "password"};
    try {
      const response = await auth.post('/oauth/token', request)
      await AsyncStorage.setItem('userToken', response.data.access_token)
      this.props.navigation.navigate('App');
    } catch (error) {
      alert('Usuario incorrecto')
    }
  }

  render() {
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <TextInput
            style={{height: 40}}
            placeholder="Enter fucking mail!"
            onChangeText={this.onChangeEmail}
            value={this.state.email}
            />
            <TextInput
            style={{height: 40}}
            placeholder="Enter fucking password!"
            onChangeText={this.onChangePassword}
            value={this.state.password}
            />
            <Button
            title="Sign Up!"
            onPress={this.submitForm}
            />
        </View>
    </TouchableWithoutFeedback>
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
  });

export default LoginScreen