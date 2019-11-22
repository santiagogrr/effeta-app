import React, { Component } from 'react'
import { Button, Label, Text, View, StyleSheet, ScrollView } from 'react-native';
import InputField from "../components/InputField";
import RoundButton from "../components/RoundButton";
import Checkbox from "../components/Checkbox";
import {AsyncStorage} from 'react-native';
import api from '../api/api.js';


class EditTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMonday: false,
      isTuesday: false,
      isWednesday: false,
      isThursday: false,
      isFriday: false,
      userTask: [],
      task: [],
    }
  }

  submitForm = async () => {
    const { isMonday, isTuesday, isWednesday, isThursday, isFriday } = this.state;
    const { id } = this.props.navigation.state.params
    try {
      const token = await AsyncStorage.getItem('userToken')
      const userId = await AsyncStorage.getItem('userId')
      var freq = ''
      if (isMonday)
        freq+='mon,'
      if (isTuesday)
        freq+='tue,'
      if (isWednesday)
        freq+='wed,'
      if (isThursday)
        freq+='thu,'
      if (isFriday)
        freq+='fri,'
      
      await api.update('user-task',{
        id: id,
        freq: freq
      },{
        headers: {
          Authorization: `Bearer ${token}`
        } 
      }
      )
      this.props.navigation.navigate('ParentalControl');
    } catch (error) {
      alert("Error")
      console.log(error)
    }
  }

  toggleButtonState = () => {
    const { isMonday, isTuesday, isWednesday, isThursday, isFriday } = this.state;
    //const { validPin} = this.state;
    if (isMonday || isTuesday || isWednesday ||isThursday || isFriday) {
      return false;
    }
    return true;
  }

  async componentDidMount(){
    const { navigation } = this.props
    this.willFocusListener = navigation.addListener(
      'willFocus',
      () => {
        this.getData()
      }
    )
  }

  componentWillUnmount() {
    this.willFocusListener.remove()
  }

  getData = async () =>{
    try{
      const { id } = this.props.navigation.state.params
      const token = await AsyncStorage.getItem('userToken')
      const userTask = await api.get(`user-tasks/${id}`, {
          include: 'task',
          headers: {
            Authorization: `Bearer ${token}`
          } 
        } 
      )
      this.setState({
        userTask: userTask.data,
        task: userTask.data.task,
      });
      if(userTask.data.freq.includes('mon')) {
        this.setState({
          isMonday: true
        });
      }
      if(userTask.data.freq.includes('tue')) {
        this.setState({
          isTuesday: true
        });
      }
      if(userTask.data.freq.includes('wed')) {
        this.setState({
          isWednesday: true
        });
      }
      if(userTask.data.freq.includes('thu')) {
        this.setState({
          isThursday: true
        });
      }
      if(userTask.data.freq.includes('fri')) {
        this.setState({
          isFriday: true
        });
      }
    }
    catch(error) {
      console.log(error)
    }
  }


  render() {
    const { task } = this.state
    return (
        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.avoidView}>
            <Text style={styles.header}>{task.name}</Text>
            <Text style={styles.subheader}>{task['task-type']}</Text>
            <Text style={styles.subtext}>Select task frequency </Text>
            <Checkbox 
              text={'Monday'} 
              selected={this.state.isMonday} 
              onPress={() => this.setState({ 
                isMonday: !this.state.isMonday 
              })}/>
            <Checkbox 
              text={'Tuesday'} 
              selected={this.state.isTuesday} 
              onPress={() => this.setState({ 
                isTuesday: !this.state.isTuesday 
              })}/>
            <Checkbox 
              text={'Wednesday'} 
              selected={this.state.isWednesday} 
              onPress={() => this.setState({ 
                isWednesday: !this.state.isWednesday 
              })}/>
              <Checkbox 
              text={'Thursday'} 
              selected={this.state.isThursday} 
              onPress={() => this.setState({ 
                isThursday: !this.state.isThursday 
              })}/>
              <Checkbox 
              text={'Friday'} 
              selected={this.state.isFriday} 
              onPress={() => this.setState({ 
                isFriday: !this.state.isFriday 
              })}/>
  
            <RoundButton
              labelText="Add Frequency"
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
    marginBottom: 5
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
export default EditTaskScreen;