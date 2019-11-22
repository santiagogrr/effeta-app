import React, { Component } from 'react'
import { Button, Label, Text, View, StyleSheet, ScrollView } from 'react-native';
import InputField from "../components/InputField";
import RoundButton from "../components/RoundButton";
import Checkbox from "../components/Checkbox";
import {AsyncStorage} from 'react-native';
import api from '../api/api.js';


class EditRewardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
			name: '',
      value: '',
      validName: false,
      validValue: false,
      //user: [],
      formValid: false
    }
	}
  
  componentDidMount(){
    const { reward } = this.props.navigation.state.params
    console.log(reward)
    console.log(reward.name)
    this.setState({
      name: reward.name,
      value: reward.value,
    });
    const re = /^[0-9\b\.]+$/;
    if (re.test(reward.value.toString()) && reward.value.toString().length > 0) {
      this.setState({ validValue: true });
    }
    if (reward.name.length > 0) {
      this.setState({ validName: true });
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
		const { reward } = this.props.navigation.state.params
		const { name, value } = this.state
    try {
      const token = await AsyncStorage.getItem('userToken')
      
      await api.update('reward',{
        id: reward.id,
        name: name,
        value: value
      },{
        headers: {
          Authorization: `Bearer ${token}`
        } 
      }
      )
      this.props.navigation.goBack();
    } catch (error) {
      alert("Error")
      console.log(error)
    }
  }


  render() {
		const { name, value } = this.state
    return (
        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.avoidView}>
            <Text style={styles.header}>Edit Reward </Text>
            <InputField 
							labelText="ENTER REWARD NAME" 
							labelTextSize={14} 
							labelColor={'black'} 
							textColor={'black'} 
							borderBottomColor={'black'} 
							inputType="text"
							defaultValue={name} 
							onChangeText={this.onChangeName}
            />
						<InputField 
							labelText="ENTER REWARD VALUE" 
							labelTextSize={14}
							//defaultValue={reward.value.toString()}
							labelColor={'black'} 
							textColor={'black'} 
							borderBottomColor={'black'} 
							inputType="text"
							defaultValue={value.toString()} 
							onChangeText={this.onChangeValue}
						/>           
            <RoundButton
              labelText="Update"
              color = 'black'
              disabled={this.toggleButtonState()}
              submitform={this.submitForm}
              width= {140}
              height= {60}
              textColor= 'white'
              padding = {20}
              />
          </ScrollView>
      </View>
      
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
    fontSize: 30,
    color: 'black',
    fontWeight: "300",
    marginBottom: 30
  },
  subheader: {
    fontSize: 16,
    color: 'black',
    fontWeight: "800",
    marginBottom: 20
  },
  subtext: {
    fontSize: 20,
    color: '#707070',
    fontWeight: "300",
    marginBottom: 5
  },
});
export default EditRewardScreen;