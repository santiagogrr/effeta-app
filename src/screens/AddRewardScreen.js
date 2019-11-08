import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import RoundButton from "../components/RoundButton";
import { ScrollView } from 'react-native-gesture-handler';


class AddRewardScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      rewards: [],
      name: '',
      value: '',
      validName: false,
      validValue: false,
      //user: [],
      formValid: false
    }
  }

  onChangeName = (text) => {
    const { validName } = this.state;
    this.setState({
      name: text,
    });

    if (!validName) {
      if (text.length > 0) {
        this.setState({ validName: true });
      }
    } else if (text <= 0) {
      this.setState({ validName: false });
    }
  }

  onChangeValue = (text) => {
    const { validValue } = this.state;
    const re = /^[0-9\b\.]+$/;
    this.setState({
      value: text,
    });

    if (!validValue) {
      if (re.test(text) && text.length > 0) {
        this.setState({ validValue: true });
      }
    } else if (!re.test(text) || text.length <= 0) {
      this.setState({ validValue: false });
    }
  }

  toggleButtonState = () => {
    const { validName, validValue } = this.state;
    if (validName && validValue) {
      return false;
    }
    return true;
  }


  submitForm = async () => {
    const { name, value } = this.state;
    try {
      const userId = await AsyncStorage.getItem('userId')
      const token = await AsyncStorage.getItem('userToken')
      await api.create('reward',{
        name: name,
        value: value,
        user: {
          id: userId,
        }
      },{
        headers: {
          Authorization: `Bearer ${token}`
        } 
      }
      )
      this.props.navigation.navigate('Reward');
    } catch (error) {
      alert("Error en registro")
      console.log(error)
    }
  }




  render() {
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.header}>Rewards</Text>
          <InputField 
          labelText="ENTER REWARD NAME" 
          labelTextSize={14} 
          labelColor={'black'} 
          textColor={'black'} 
          borderBottomColor={'black'} 
          inputType="text" 
          onChangeText={this.onChangeName}
          />
          <InputField 
            labelText="ENTER REWARD VALUE" 
            labelTextSize={14} 
            labelColor={'black'} 
            textColor={'black'} 
            borderBottomColor={'black'} 
            inputType="text"
            onChangeText={this.onChangeValue}
          />
          {/* <Button
          title="Add reward!"
          onPress={this.submitForm}
          //disabled={this.state.isLoading}
          color='black'
          />   */}
          <RoundButton
            //submitform={this.submitForm}
            labelText="Add Reward"
            color = 'black'
            disabled={this.toggleButtonState()}
            submitform={this.submitForm}
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
    marginTop: 50,
    flex: 1
  },
  avoidView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex:1
   },
  header: {
    fontSize: 30,
    color: 'black',
    fontWeight: "300",
    marginBottom: 40
  }
});

export default AddRewardScreen;