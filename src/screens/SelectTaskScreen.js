import React, { Component } from 'react'
import { Button, Text, View, StyleSheet, FlatList } from 'react-native';
import {AsyncStorage} from 'react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from "../components/ListItem";
import TaskCard from "../components/TaskCard";
import CategoryCard from "../components/CategoryCard";

class SelectTaskScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      tasks: [],
      name: '',
      value: '',
      validName: false,
      validValue: false,
      formValid: false,
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

  isSelected = (category) => {
    const { selected } = this.state;
    if (selected.length > 0) {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i]['task-type'] === category.type) {
          return true
        }
      }
    } else {
      return false
    }
  }

  handlePress = (category) => {
    const { tasks, categories } = this.state;
    const res = tasks.filter(task => task['task-type'] === category.type)
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
      this.setState({
        selected: res,
        categories: newCategories
      });
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

  handleDelete = async (id) => {
    try{
      api.delete('rewards',id);
      this.setState({ 
        t: this.state.rewards.filter(item => item.id !== id),
      });
      alert('Delete Successful')
    }
    catch(error){
      console.log(error)
    }
  }


  render() {
    const { tasks, selected, categories } = this.state
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.header}>Select Tasks</Text>
          <Text style={styles.subtext}>Choose a category</Text>
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
          <View style={{marginTop: 15}}>
            <FlatList
            data={selected.length > 0 ? selected : tasks}
            keyExtractor={item => item.id}
            renderItem={({item}) => 
            <View>
              <TaskCard
              labelText={item.name}
              color= '#8F2D56'
              labelColor = 'black'
              icon = {this.handleIcon(item['task-type'])}
              iconColor = 'white'
              labelTextSize = {18}
              submitform={() => this.props.navigation.navigate('AssignTask', { task: item })} 
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
  wrapper: {
    display: "flex",
    flex: 1,
    backgroundColor: 'darkcyan'
  },
  scrollViewWrapper: {
    marginTop: 20,
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
    marginBottom: 30
  },
  subtext: {
    fontSize: 14,
    color: 'black',
    fontWeight: "500",
    alignSelf: 'flex-start',
    marginBottom: 10
  },
});

export default SelectTaskScreen;