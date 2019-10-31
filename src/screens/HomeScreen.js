import React, { Component } from 'react'
import { Button, Label, Text, View } from 'react-native';
import {AsyncStorage} from 'react-native';
import t from 'tcomb-form-native';


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
      </View>
    )
  }
}
export default HomeScreen;