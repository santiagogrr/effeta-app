import React, { Component } from 'react'
import { Button, Label, Text, View, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FloatingButton from "../components/FloatingButton";
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from "../components/ListItem";
import ModalView from "../components/ModalView";
import api from '../api/api.js';
import auth from '../api/auth.js';
import {AsyncStorage} from 'react-native';
import RoundButton from '../components/RoundButton';


class ParentalControlScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      modalVisible: true,
      tasks: [],
      pin: '',
      validPin: false,
      validNewPin: false,
      changePinVisible: false,
      newPin: ''
    }
  }

  toggleModal = () => {
    this.setState({ 
      modalVisible: !this.state.modalVisible 
    });
    this.props.navigation.navigate('Home')
  }

  toggleNewPinModal = () => {
      this.setState({ 
        changePinVisible: !this.state.changePinVisible 
      });
  }

  onUpdatePin = () => {
    this.setState({ 
      changePinVisible: !this.state.changePinVisible 
    });
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

onChangeNewPin = (text) => {
  const { validNewPin, newPin } = this.state;
  const re = /^[0-9\b\.]+$/;
  this.setState({
    newPin: text,
  });

  if (!validNewPin) {
    if (re.test(text) && text.length == 4) {
      this.setState({ validNewPin: true });
    }
  } else if (!re.test(text) || text.length != 4) {
    this.setState({ validNewPin: false });
  }
}

toggleButtonState = () => {
  const { validPin} = this.state;
  if (validPin) {
    return false;
  }
  return true;
}

toggleButtonState2 = () => {
  const { validNewPin} = this.state;
  if (validNewPin) {
    return false;
  }
  return true;
}

 getData = async () =>{
  try{
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('userToken')
    const tasks = await api.get(`users/${userId}/user-tasks`, {
        include: 'task',
        headers: {
          Authorization: `Bearer ${token}`
        },
        //includes:  tasks
      } 
    )
    this.setState({
      tasks: tasks.data,
      modalVisible: true
    });
  }
  catch(error) {
    console.log(error)
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
  console.log('hola')
}

handleDelete = async (id) => {
  try{
    api.delete('user-task',id);
    this.setState({ 
      tasks: this.state.tasks.filter(item => item.id !== id),
    });
    alert('Delete Successful')
  }
  catch(error){
    console.log(error)
  }
}

submitForm = async () => {
  const { pin } = this.state;
  try {
    const token = await AsyncStorage.getItem('userToken')
    const user = await auth.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (user.data.pin === pin) {
      this.setState({ 
        modalVisible: !this.state.modalVisible 
      });
    } else {
      alert("Pin incorrecto")
    }
  } catch (error) {
    alert("Error en registro")
    console.log(error)
  }
}

  submitNewPin = async () => {
    const { newPin } = this.state;
    try {
      const token = await AsyncStorage.getItem('userToken')
      const userId = await AsyncStorage.getItem('userId')
      await api.update('user', {
        id: userId,
        pin: newPin,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        } 
      })
      this.setState({ 
        changePinVisible: !this.state.changePinVisible 
      });
      //alert("Pin actualizado")
      setTimeout(() => {
        alert("Pin actualizado")
        }, 1000);
    } catch (error) {
      alert("Error en registro")
      console.log(error)
    }
  }

  render() {
    const { tasks, modalVisible, changePinVisible} = this.state
    const opacityStyle = modalVisible ? 0.3 : 1;
    return (
      <View style={[{opacity: opacityStyle }, styles.scrollViewWrapper]}>
        <ScrollView style = {styles.avoidView}>
          <RoundButton 
              labelText="Change pin"
              color = '#8F2D56'
              submitform={this.onUpdatePin}
              width= {65}
              height= {50}
              labelTextSize = {13}
              textColor= 'white'
              buttonAlign = 'flex-end'
              padding = {-10}
            />
           <Text style={styles.header}>Parental Control</Text>
           <ModalView
            visible = {modalVisible}
            closeModal = {this.toggleModal}
            onChangeText = {this.onChangePin}
            disabledbutton = {this.toggleButtonState()}
            submitform = {this.submitForm}
            textModal = 'Enter Pin'
          />
          <ModalView
            visible = {changePinVisible}
            closeModal = {this.toggleNewPinModal}
            onChangeText = {this.onChangeNewPin}
            disabledbutton = {this.toggleButtonState2()}
            submitform = {this.submitNewPin}
            textModal = 'Enter New Pin'
          />
          <FlatList
          data={tasks}
          ItemSeparatorComponent={this.renderSeparator}  
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <View>
              <ListItem
              firstLine={item.task.name}
              //secondLine={'Type: '+item.task['task-type']}
              secondLine={item.freq}
              color= '#E8E8E8'
              icon = 'close-circle'
              iconColor = 'black'
              handleDelete = {() => this.handleDelete(item.id)}
              />
          </View> }
          /> 
          </ScrollView>
          <FloatingButton
          submitform={() => this.props.navigation.navigate('SelectTask')}
          //labelText="Log out" 
          />
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
    marginTop: 20,
    flex: 1,
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
  item: {
    padding: 10,
    fontSize: 18,
    //height: 44,
  },
  modalView: {
    marginTop: 275,
    height: 130,
    width: '75%',
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalText:{
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 20,
    //fontWeight: 'bold',
  },
});
export default ParentalControlScreen;