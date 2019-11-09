import React, { Component } from 'react'
import { Button, Text, View, StyleSheet, FlatList } from 'react-native';
import {AsyncStorage} from 'react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from "../components/ListItem";


class SelectTaskScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      tasks: [],
      name: '',
      value: '',
      validName: false,
      validValue: false,
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

  renderSeparator = () => {  
    return (  
        <View  
            style={{  
                height: 1,  
                width: "100%",  
                backgroundColor: '#CED0CE',
                //borderTopWidth: 1
                //backgroundColor: "red",
            }}  
        />  
    );  
}; 

async componentDidMount(){
  const { navigation } = this.props
  this.willFocusListener = navigation.addListener(
    'willFocus',
    () => {
      this.getData()
    }
  )
}

getData = async () =>{
  try{
    const token = await AsyncStorage.getItem('userToken')
    const tasks = await api.get(`tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        } 
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

componentWillUnmount() {
  this.willFocusListener.remove()
  console.log('hola')
}


  render() {
    const { tasks } = this.state
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.header}>Select Tasks</Text>
          <FlatList
          data={tasks}
          ItemSeparatorComponent={this.renderSeparator}  
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <View>
            {/* <TouchableOpacity style={styles.button}>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity> */}
              <ListItem
              firstLine={item.name}
              secondLine={item['task-type']}
              color= '#E8E8E8'
              submitform = {() => this.props.navigation.navigate('AssignTask',{ task: item })}
              />
          </View> }
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
    marginTop: 40,
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

export default SelectTaskScreen;