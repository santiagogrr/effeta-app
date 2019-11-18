import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Button, Label, TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import t from 'tcomb-form-native';
import {AsyncStorage} from 'react-native';
import InputField from "../components/InputField";
import ArrowButton from "../components/ArrowButton";
import Notification from "../components/Notification";
import Icon from "react-native-vector-icons/MaterialIcons";
import auth from '../api/auth'
import api from '../api/api'


const User = t.struct({
  email: t.String,
  password: t.String,
});

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
      password_conf:'',
      validEmail: false,
      validPassword: false,
      validPasswordConf: false,
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

  onChangePasswordConfirmation = (text) => {
    const { validPasswordConf } = this.state;
    this.setState({
      password_conf: text,
    });

    if (!validPasswordConf) {
      if (text.length > 5) {
        this.setState({ validPasswordConf: true });
      }
    } else if (text <= 5) {
      this.setState({ validPasswordConf: false });
    }
  }

  toggleNextButtonState = () => {
    const { validEmail, validPassword, validPasswordConf, password, password_conf } = this.state;
    if (validEmail && validPassword && validPasswordConf && password === password_conf ) {
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
    const { email, password, password_conf } = this.state;
    this.setState({
        isLoading: true,
      });
    
    try {
      await auth.post('/users',{
        user: {
          email: email,
          password: password,
          password_confirmation: password_conf
        }
      })
      const request = {"email": email, "password": password, "grant_type": "password"};
      const response = await auth.post('/oauth/token', request)
      await AsyncStorage.setItem('userToken', response.data.access_token)
      this.setState({
        isLoading: false,
        formValid: true
      });
      this.props.navigation.navigate('App');
    } catch (error) {
      alert("Error en registro")
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
            <Text style={styles.header}>Sign Up</Text>
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
              <InputField 
                labelText="CONFIRM PASSWORD" 
                labelTextSize={14} 
                labelColor={'white'} 
                textColor={'white'} 
                borderBottomColor={'white'} 
                inputType="password"
                onChangeText={this.onChangePasswordConfirmation}
              />
              <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => this.props.navigation.goBack()}
              >
                <Icon
                name='arrow-back'
                size={28}
                color='white'
                />
              </TouchableOpacity> 
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
          firstLine='Wrong registration. '
          secondLine='Please try again'
          />
         </View>
      </View>
   </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    wrapper: {
      display: "flex",
      flex: 1,
      backgroundColor: 'darkcyan'
    },
    scrollViewWrapper: {
      marginTop: 90,
      flex: 1
    },
    avoidView: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 20,
      flex:1
     },
    header: {
      fontSize: 32,
      color: 'white',
      fontWeight: "400",
      marginBottom: 40,
      paddingTop: 40
    },
    backButton: {
      position: 'absolute',
      //left: 5,
      top: -15,
      //zIndex: 999,
    },
  });

export default SignUpScreen