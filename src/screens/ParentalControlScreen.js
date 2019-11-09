import React, { Component } from 'react'
import { Button, Label, Text, View, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FloatingButton from "../components/FloatingButton";
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from "../components/ListItem";
import ModalView from "../components/ModalView";
import PinInput from "../components/PinInput";
import api from '../api/api.js';
import {AsyncStorage} from 'react-native';


class ParentalControlScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      modalVisible: true,
      tasks: [],
      pin: '',
      validPin: false
    }
  }

  toggleModal = () => {
    this.setState({ 
      modalVisible: !this.state.modalVisible 
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

toggleButtonState = () => {
  const { validPin} = this.state;
  if (validPin) {
    return false;
  }
  return true;
}

 renderSeparator = () => {  
  return (  
      <View  
          style={{  
              height: 1,  
              width: "100%",  
              backgroundColor: '#CED0CE',
          }}  
      />  
  );  
}; 

 getData = async () =>{
  try{
    const userId = await AsyncStorage.getItem('userId')
    const token = await AsyncStorage.getItem('userToken')
    const tasks = await api.get(`users/${userId}/user-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        //includes:  tasks
      } 
    )
    this.setState({
      tasks: tasks.data,
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

  render() {
    const { tasks, modalVisible} = this.state
    const opacityStyle = modalVisible ? 0.3 : 1;
    return (
      <View style={[{opacity: opacityStyle }, styles.scrollViewWrapper]}>
        <ScrollView style = {styles.avoidView}>
           <Text style={styles.header}>Parental Control</Text>
          {/* <Modal 
          onRequestClose={() => { this.visibleModal(false); } } 
          visible = {this.state.modalVisible}
          animationType = {"fade"}
          transparent = {true}
          >
              <View style={styles.modalView}>
                  <Text style={styles.modalText}>Are you sure you want to randomize all?</Text>
                <View>
                  <TouchableOpacity style={styles.buttonContainer1}>
                    <Text style={styles.button1}>Yes</Text>
                  </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer2} onPress = {this.toggleModal}>
                  <Text style={styles.button2}>No</Text>
                </TouchableOpacity>
                </View>
              </View>
          </Modal> */}
           <ModalView
            visible = {this.state.modalVisible}
            closeModal = {this.toggleModal}
            onChangeText = {this.onChangePin}
            disabledbutton = {this.toggleButtonState()}
          />
          <FlatList
          data={tasks}
          ItemSeparatorComponent={this.renderSeparator}  
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <View>
              <ListItem
              firstLine={item.name}
              secondLine={'Type: '+item['task-type']}
              color= '#E8E8E8'
              icon = 'close-circle'
              iconColor = 'black'
              //handleDelete = {() => this.handleDelete(item.id)}
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
  buttonContainer1:{
    backgroundColor:'black',
    margin: 7,
   },
   buttonContainer2:{
    //backgroundColor:'#E0E0E0',
    margin: 5,
   },
   button1:{
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: 'white',
  },
  button2:{
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center'
  },
});
export default ParentalControlScreen;