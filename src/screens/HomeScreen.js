import React, { Component } from 'react'
import { Button, Label, Text, View } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
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

  render() {
    return (
      <View>
           <Text>Ahuevo</Text>
           <Button
           title="Log out"
           onPress={this.logout}
           />
           <LottieView 
           source={require('../../assets/data.json')} autoPlay loop 
           style={{width:120, height:220}}
           />
            <LottieView 
           source={require('../../assets/party.json')} autoPlay loop 
           style={{width:80, height:120}}
           />
            <LottieView 
           source={require('../../assets/stars.json')} autoPlay loop 
           style={{width:80, height:120}}
           />
      </View>
    )
  }
}
export default HomeScreen;