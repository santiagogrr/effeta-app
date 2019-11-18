import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View, Modal, TextInput} from "react-native";
import PinInput from "../components/PinInput";
import RoundButton from "../components/RoundButton";

class ModalView extends Component {

  render() {
    const { closeModal, disabledbutton, labelText, color, visible, onChangeText, submitform, textModal } = this.props;
    return (
    <View style={styles.avoidView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        backdropColor={"white"}
        //style={{ margin: 0 }}
        >
        <View style={styles.modalView}>
        <TouchableOpacity 
        style={styles.closeButton} 
        onPress={closeModal}
        >
          <Icon
          name='times'
          size={20}
          color='white'
          />
        </TouchableOpacity> 
          <Text style={styles.modalText}>{textModal}</Text>
          <Text style={styles.modalSubtext}>4 digits</Text>
          <View>
            <PinInput
              //labelText="ENTER PIN" 
              labelTextSize={20} 
              labelColor={'white'} 
              textColor={'white'} 
              borderBottomColor={'white'} 
              inputType="password"
              onChangeText={onChangeText}
            />
            <RoundButton
            labelText="OK"
            color = 'white'
            disabled={disabledbutton}
            width= {110}
            height= {60}
            textColor= 'black'
            submitform={submitform}
            />
          </View>
        </View>
      </Modal>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: "center",
    paddingTop: 0
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    width: 140,
    height: 60,
  },
  text: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16
  },
  modalView: {
    marginTop: 255,
    height: 245,
    borderRadius: 20,
    width: '80%',
    backgroundColor: 'darkcyan',
    alignItems: 'center',
    alignSelf: 'center',
    //justifyContent: 'center',
  },
  modalText:{
    fontSize: 24,
    paddingTop: 20,
    color: 'white',
    fontWeight: '500',
  },
  modalSubtext:{
    fontSize: 14,
    paddingTop: 5,
    color: 'white',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  avoidView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex:1
   },
});

export default ModalView;