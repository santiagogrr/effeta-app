import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Button, Label, TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import t from 'tcomb-form-native';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';
import InputField from "../components/InputField";
import ArrowButton from "../components/ArrowButton";
import RoundButton from "../components/RoundButton";
import Notification from "../components/Notification";
import auth from '../api/auth'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
      validEmail: false,
      validPassword: false,
      isLoading: false,
      formValid: true
    }
    //this.handleChange = this.handleChange.bind(this);
  }

  static navigationOptions = {
    header : null
  }

  onChangeEmail = (text) => {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({
      email: text,
    });

    if (!validEmail) {
      if (emailCheckRegex.test(text)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(text)) {
      this.setState({ validEmail: false });
    }
  }

  onChangePassword = (text) => {
    const { validPassword } = this.state;
    this.setState({
      password: text,
    });

    if (!validPassword) {
      if (text.length > 5) {
        this.setState({ validPassword: true });
      }
    } else if (text <= 5) {
      this.setState({ validPassword: false });
    }
  }

  toggleNextButtonState = () => {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  handleCloseNotification = () =>{
    this.setState({
      formValid: true,
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
      const user = await auth.get('/me', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`
          } 
        } 
      )
      console.log(user)
      if(user.data)
        await AsyncStorage.setItem('userId', user.data.id.toString())

      this.setState({
        isLoading: false,
        formValid: true
      });
      this.props.navigation.navigate('App');
    } catch (error) {
      alert('Usuario incorrecto')
      this.setState({
        isLoading: false,
        formValid: false
      });
    }
  }

  render() {
    const { formValid } = this.state;
    const showNotification = formValid ? false:true
    return (
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
              <Text style={styles.subtext}>Don't have an account?</Text>
              <RoundButton
              labelText="Sign Up"
              color = 'black'
              submitform={() => this.props.navigation.navigate('SignUp')}
              width= {130}
              height= {55}
              textColor= 'white'
              />
          </ScrollView>
        <ArrowButton
         submitform={this.submitForm}
         disabled={this.toggleNextButtonState()}
         />
         <View style={showNotification ? {marginTop: 10}: {}}>
          <Notification
          showNotification={showNotification}
          handleCloseNotification={this.handleCloseNotification}
          type="Error: "
          firstLine='Wrong credentials. '
          secondLine='Please try again'
          />
         </View>
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
      backgroundColor: 'darkcyan'
    },
    scrollViewWrapper: {
      marginTop: 85,
      flex: 1
    },
    avoidView: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 20,
      flex:1
     },
    loginHeader: {
      fontSize: 32,
      color: 'white',
      fontWeight: "400",
      marginBottom: 40
    },
    subtext: {
      fontSize: 14,
      color: 'white',
      fontWeight: "500",
      alignSelf: 'center',
      marginBottom: 10
    },
  });

export default LoginScreen