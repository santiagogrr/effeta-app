import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, FlatList } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from '../api/api.js';
import auth from '../api/auth';
import ModalView from "../components/ModalView";
import RoundButton from "../components/RoundButton";
import { ScrollView } from 'react-native-gesture-handler';


class ConfirmTasksScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      userTask: [],
      task: [],
      modalVisible: false,
      validPin: false,
      pin: ''
    }
  }

  handleIcon = (type) => {
    if(type === 'kitchen') {
      return 'fridge'
    } else if(type === 'bed') {
      return 'bed-empty'
    } else if(type === 'clothing') {
      return 'tshirt-crew'
    } else {
      return 'circle'
    }
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
    }
    catch(error) {
      console.log(error)
    }
  }

  confirmTask = async () => {
    try {
      const { userTask, pin, task } = this.state;
      const token = await AsyncStorage.getItem('userToken')
      const user = await auth.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (user.data.pin === pin) {
        const currentDay = new Intl.DateTimeFormat('en-US',{
          weekday: 'short'
        }).format(new Date()).toLowerCase()
        const confirmed = userTask.confirmed || ''
        this.setState({ 
          modalVisible: !this.state.modalVisible 
        });
        await api.update('user-task',{
          id: userTask.id,
          confirmed: confirmed + `${currentDay},`,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          } 
        })
        await api.update('user',{
          id: user.data.id,
          points: user.data.points + task.value,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          } 
        })
        alert("Tarea Confirmada")
        this.props.navigation.navigate('Home')
      } else {
        alert("Pin incorrecto")
      }
    } catch (error) {
      alert("Error")
    }
  }

  toggleModal = () => {
    this.setState({ 
      modalVisible: !this.state.modalVisible 
    });
    this.props.navigation.navigate('Home')
  }

  toggleButtonState = () => {
    const { validPin} = this.state;
    if (validPin) {
      return false;
    }
    return true;
  }

  onChangePin = (text) => {
    const { validPin } = this.state;
    const re = /^[0-9\b\.]+$/;
    this.setState({
      pin: text,
    });
  
    if (!validPin) {
      if (re.test(text) && text.length == 4) {
        this.setState({ validPin: true });
      }
    } else if (!re.test(text) || text.length != 4) {
      this.setState({ validPin: false });
    }
  }

  onUpdatePin = () => {
    this.setState({ 
      modalVisible: !this.state.modalVisible 
    });
  }


  render() {
    const { task, modalVisible } = this.state;
    const opacityStyle = modalVisible ? 0.3 : 1;
    return (
      <View style={[{opacity: opacityStyle }, styles.scrollViewWrapper]}>
        <ScrollView style={styles.avoidView}>
        <View style= {styles.iconWrapper}>
            <Icon
              name={this.handleIcon(task['task-type'])}
              color= {'white'}
              size={28}
              />
          </View>
          {/* <Text style={[{ marginTop: 20 }, styles.label]}>Today</Text> */}
          <Text style={styles.header}>{task.name}</Text>
          <RoundButton
          labelText="Confirm Task"
          color = 'black'
          submitform={this.onUpdatePin}
          width= {140}
          height= {60}
          textColor= 'white'
          padding = {20}
          />
          <ModalView
            visible = {modalVisible}
            closeModal = {this.toggleModal}
            onChangeText = {this.onChangePin}
            disabledbutton = {this.toggleButtonState()}
            textModal = 'Enter Pin'
            submitform={() => this.confirmTask('confirmed')} 
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  avoidView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex:1
   },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: "500",
    marginBottom: 10
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
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 50,
    height: 50,
    padding: 5,
    marginBottom: 10,
    backgroundColor: 'darkcyan'
    //borderWidth: 1,
  },
});
export default ConfirmTasksScreen;