import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, FlatList } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import TaskCard from "../components/TaskCard";
import CategoryCard from "../components/CategoryCard";
import Checkbox from "../components/Checkbox";
import ModalView from "../components/ModalView";
import { ScrollView } from 'react-native-gesture-handler';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      tasks: [],
      name: '',
      value: '',
      taskDone: false,
      todayTasks: [],
      selected: [],
      categories: [
        {
          title: 'Kitchen',
          type: 'kitchen',
          icon: 'fridge',
          checked: false,
        },
        {
          title: 'Bed',
          type: 'bed',
          icon: 'bed-empty',
          checked: false,
        },
        {
          title: 'Clothing',
          type: 'clothing',
          icon: 'tshirt-crew',
          checked: false,
        },
      ],
    }
  }

  logout = async () => {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    }
    catch(exception) {
      alert('Error')
    }
  }

  onChangeName = (text) => {
    //const { validPassword } = this.state;
    this.setState({
      name: text,
    });
  }

  onChangeValue = (text) => {
    //const { validPassword } = this.state;
    this.setState({
      value: text,
    });
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

  isSelected = (category) => {
    const { selected } = this.state;
    if (selected.length > 0) {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].task['task-type'] === category.type) {
          return true
        }
      }
    } else {
      return false
    }
  }

  handlePress = (category) => {
    const { categories } = this.state;
    let newCategories = categories
    for (let i = 0; i < newCategories.length; i++) {
      if (category.type !== newCategories[i].type && newCategories[i].checked) {
        newCategories[i].checked = !newCategories[i].checked
      }
      if (newCategories[i].type === category.type) {
        newCategories[i].checked = !newCategories[i].checked
      }
    }
    if(this.isSelected(category)){
      this.setState({
        selected: [],
        categories: newCategories
      });
    } else {
      const { todayTasks } = this.state;
      const res = todayTasks.filter(userTask => userTask.task['task-type'] === category.type)
      this.setState({
        selected: res,
        categories: newCategories
      });
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
      const userId = await AsyncStorage.getItem('userId')
      const token = await AsyncStorage.getItem('userToken')
      const currentDay = new Intl.DateTimeFormat('en-US',{
        weekday: 'short'
      }).format(new Date()).toLowerCase()
      const todayTasks = await api.get(`users/${userId}/user-tasks`, {
          filter:{
            today: currentDay
          },
          include: 'task',
          headers: {
            Authorization: `Bearer ${token}`
          } 
        } 
      )
      this.setState({
        todayTasks: todayTasks.data,
      });
    }
    catch(error) {
      console.log(error)
    }
  }
  
  handleCheckBox = () => {
    this.setState({ 
      taskDone: !this.state.taskDone 
    })
  }

  submitForm = async () => {
    const { name, value, user } = this.state;
    try {
      await api.create('reward',{
        name: name,
        value: value,
        user: {
          id: user.id,
          type: 'users'
        }
      })
    } catch (error) {
      alert("Error en registro")
    }
  }


  render() {
    const { todayTasks, categories, selected } = this.state;
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
           {/* <LottieView 
           source={require('../../assets/data1.json')} autoPlay loop 
           style={{width:120, height:220}}
           /> */}
          <Text style={styles.header}>Hey Matt!</Text>
          <Text style={styles.subheader}>{new Intl.DateTimeFormat('en-US',{
            month: 'long',
            day: '2-digit',
            weekday: 'long'
          }).format(new Date())}</Text>
          {/* <Checkbox
            selected={this.state.taskDone} 
            onPress={this.handleCheckBox}
            color = '#211f30'
          /> */}
          <Text style={styles.label}>Categories</Text>
          <View style={styles.categoryRow}>
          <FlatList
            data={categories}
            horizontal={true}
            extraData = {selected}
            keyExtractor={item => item.title}
            renderItem={({item}) => 
            <View>
              <CategoryCard
                labelText={item.title}
                color = {item.checked ? 'darkcyan' :'#D3D3D3'}
                labelColor = 'black'
                fontWeight = {item.checked  ? '500' :'300'}
                icon = {item.icon}
                iconColor = {item.checked  ? 'white' :'black'}
                submitform={() => this.handlePress(item)} 
              />
            </View> }
            /> 
          </View>
          <Text style={[{ marginTop: 20 }, styles.label]}>Today</Text>
          <View style={styles.cardRow}>
            <FlatList
            data={(selected.length > 0 || categories.find(category=> category.checked === true)) ? selected : todayTasks}
            keyExtractor={item => item.id}
            renderItem={({item}) => 
              <View>
              <TaskCard
                labelText={item.task.name}
                color= '#8F2D56'
                labelColor = 'black'
                labelTextSize = {18}
                isComplete={item.status === 'complete'}
                points = {'Puntos: '+item.task.value}
                icon = {this.handleIcon(item.task['task-type'])}
                iconColor = 'white'
                submitform={() => this.props.navigation.navigate('Task', { task: item.task, userTask: item })} 
              />
              </View> }
            /> 
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    //marginTop: 30,
    flex: 1,
    backgroundColor: 'white',
  },
  categoryRow: {
    //marginTop: 30,
    flexWrap: 'wrap',
    flexDirection: 'row',
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
    fontWeight: "500",
    marginBottom: 5
  },
  subheader: {
    fontSize: 18,
    color: '#808080',
    fontWeight: "300",
    marginBottom: 40
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: "500",
    marginBottom: 10
  }
});
export default HomeScreen;