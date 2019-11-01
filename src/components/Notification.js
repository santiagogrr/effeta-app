import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

class Notification extends Component {

  closeNotification = () =>  {
    this.props.handleCloseNotification();
    //this.setState({ inputValue: text });
  }

  render() {
    const { type, firstLine, secondLine, showNotification } = this.props;
    return (
      <View>
      {showNotification ?
      <View style={styles.wrapper}>
      <View style={styles.notificationContent}>
          <Text style={styles.errorText}>{type}</Text>
          <Text style={styles.errorMessage}>{firstLine}</Text>
          <Text style={styles.errorMessage}>{secondLine}</Text>
        </View>
        <TouchableOpacity 
        style={styles.closeButton} 
        onPress={this.closeNotification}
        >
          <Icon
          name='times'
          size={20}
          color='lightgrey'
          />
        </TouchableOpacity> 
        </View>: null }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    //flex: 1,
    backgroundColor: 'white',
    height: 60,
    padding: 10,
    width: '100%'
  },
  notificationContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  errorText: {
    color: 'red',
    marginRight: 5,
    fontSize: 14,
    marginBottom: 2,
  },
  errorMessage: {
    // flexDirection: 'row',
    // flex: 1,
    marginBottom: 2,
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    //zIndex: 999,
  },
});

export default Notification;