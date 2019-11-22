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
      rewards: [],
      pin: '',
      validPin: false,
      validNewPin: false,
      changePinVisible: false,
      newPin: '',
      tasksActive: true,
      rewardsActive: false,
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

  toggleTab = () => {
    this.setState({ 
      tasksActive: !this.state.tasksActive,
      rewardsActive: !this.state.rewardsActive 
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
      } 
    )
    const rewards = await api.get(`users/${userId}/rewards`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    } 
  )
    this.setState({
      tasks: tasks.data,
      rewards: rewards.data,
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
}

handleDelete = async (model,id,target) => {
  try{
    api.delete(model,id);
    this.setState({ 
      [target]: this.state[target].filter(item => item.id !== id),
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
    const { tasks, rewards, modalVisible, changePinVisible, tasksActive, rewardsActive} = this.state
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
          <View style={styles.tabRow}>
            <TouchableOpacity style={tasksActive ? styles.tabActive:styles.tab } onPress={this.toggleTab} disabled={tasksActive} >
              <Text style={tasksActive ? styles.subheaderActive:styles.subheader}>Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rewardsActive ? styles.tabActive:styles.tab } onPress={this.toggleTab} disabled={rewardsActive}>
              <Text style={rewardsActive ? styles.subheaderActive:styles.subheader}>Rewards</Text>
            </TouchableOpacity>
          </View>
          {tasksActive ? 
          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={({item}) => 
            <View>
                <ListItem
                firstLine={item.task.name}
                //secondLine={'Type: '+item.task['task-type']}
                submitform = {() => this.props.navigation.navigate('EditTask',{id: item.id})}
                secondLine={item.freq.replace(/,/g, ' ')}
                color= '#E8E8E8'
                icon = 'close-circle'
                iconColor = 'black'
                handleDelete = {() => this.handleDelete('user-task',item.id,'tasks')}
                />
            </View> }
            /> 
          :<FlatList
          data={rewards}
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <View>
              <ListItem
              firstLine={item.name}
              //secondLine={'Type: '+item.task['task-type']}
              submitform = {() => this.props.navigation.navigate('EditReward',{reward: item})}
              secondLine={item.value}
              color= '#E8E8E8'
              icon = 'close-circle'
              iconColor = 'black'
              handleDelete = {() => this.handleDelete('reward',item.id,'rewards')}
              />
          </View> }
          />  }
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
    //marginBottom: 5
  },
  subheader: {
    fontSize: 18,
    color: '#808080',
    fontWeight: "300",
    //marginBottom: 20
  },
  subheaderActive: {
    fontSize: 18,
    color: 'black',
    fontWeight: "500",
    //marginBottom: 20
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
  tabRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 20
  },
  tab: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  tabActive: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontWeight: "500",
    borderBottomWidth: 1,
  },
});
export default ParentalControlScreen;