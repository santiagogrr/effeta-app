import React, { Component } from 'react'
import { Button, Text, View, StyleSheet, ScrollView } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import LogoutButton from "../components/LogoutButton";


class ProfileScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      name: '',
      value: '',
    }
  }


  logout = async () => {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    }
    catch(exception) {
      alert('Error')
    }
  }


  submitForm = async () => {
    const { name, value, user } = this.state;
    try {
      await api.create('reward',{
        name: name,
        value: value,
        user: {
          id: user.id,
          type: 'users'
        }
      })
    } catch (error) {
      alert("Error en registro")
    }
  }


  render() {
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.header}>Profile</Text>
          {/* <Button
           title="Log out"
           onPress={this.logout}
           /> */}
          <LogoutButton
          submitform={this.logout}
          labelText="Log out" 
          />
        </ScrollView>
      </View>
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
    marginTop: 30,
    flex: 1
  },
  avoidView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex:1
   },
  header: {
    fontSize: 28,
    color: 'black',
    fontWeight: "300",
    marginBottom: 40
  }
});
export default ProfileScreen;