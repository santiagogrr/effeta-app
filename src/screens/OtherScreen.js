import React, { Component } from 'react'
import { Button, Label, Text, View } from 'react-native';
import t from 'tcomb-form-native';


class OtherScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return (
      <View>
           <Text>Ahuevo other</Text>
      </View>
    )
  }
}
export default OtherScreen;