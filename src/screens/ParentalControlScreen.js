import React, { Component } from 'react'
import { Button, Label, Text, View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import t from 'tcomb-form-native';


class ParentalControlScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      email: '',
      password: '',
      modalVisible: false,
    }
  }

  toggleModal = () => {
    this.setState({ 
      modalVisible: !this.state.modalVisible 
    });
 }

  render() {
    return (
      <View>
           <Text>Parental Control</Text>
          <Modal 
          onRequestClose={() => { this.visibleModal(false); } } 
          visible = {!this.state.modalVisible}
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
          </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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