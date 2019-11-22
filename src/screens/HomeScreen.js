import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import TaskCard from "../components/TaskCard";
import CategoryCard from "../components/CategoryCard";
import ListItem from "../components/ListItem";
import Checkbox from "../components/Checkbox";
import ModalView from "../components/ModalView";
import { ScrollView } from 'react-native-gesture-handler';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      tasks: [],
      rewards: [],
      user: [],
      tasksActive: true,
      rewardsActive: false,
      name: '',
      value: '',
      rewardConfirmed: false,
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

  static navigationOptions = {
    header : null
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

  handleCategoryIcon = (type) => {
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
      const rewards = await api.get(`users/${userId}/rewards`, {
        filter:{
          status: 'redeemed'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const user = await auth.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      this.setState({
        rewardConfirmed: this.props.navigation.getParam('rewardConfirmed',false),
        todayTasks: todayTasks.data,
        rewards: rewards.data,
        user: user.data,
      });
    }
    catch(error) {
      console.log(error)
    }
  }

  handleTaskStatusIcon = (completed, confirmed) => {
    const currentDay = new Intl.DateTimeFormat('en-US',{
      weekday: 'short'
    }).format(new Date()).toLowerCase()
    if(confirmed !== null && confirmed.includes(currentDay)) {
      return 'thumb-up'
    } else if(completed !== null && completed.includes(currentDay)) {
      return 'check-circle'
    }
  }

  handleTask = (data) => {
    const currentDay = new Intl.DateTimeFormat('en-US',{
      weekday: 'short'
    }).format(new Date()).toLowerCase()
    if(data !== null && data.includes(currentDay)) {
      return true
    } else {
      return false
    }
  }

  toggleTab = () => {
    this.setState({ 
      tasksActive: !this.state.tasksActive,
      rewardsActive: !this.state.rewardsActive 
    });
  }

  toggleLottie = () => {
    this.setState({ 
      rewardConfirmed: !this.state.rewardConfirmed
    });
    this.props.navigation.setParams({rewardConfirmed: false})
  }

  render() {
    const { rewardConfirmed, todayTasks, categories, selected, user, tasksActive, rewardsActive, rewards } = this.state;
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          { rewardConfirmed ? <LottieView 
           source={require('../../assets/happy-birthday.json')} autoPlay loop={false} speed={0.5} onAnimationFinish={this.toggleLottie}
           style={styles.lottieView}
           /> : null }
           <View style={styles.headerRow}>
            <View style={styles.picWrapper}></View>
            <View style={{paddingHorizontal: 25}}>
              <Text style={styles.header}>Hey Matt!</Text>
              <Text style={styles.subheader}>{new Intl.DateTimeFormat('en-US',{
                month: 'long',
                day: '2-digit',
                weekday: 'long'
              }).format(new Date())}</Text>
            </View>
          </View>
          <Text style={styles.subtext1} >Points</Text>
          <View style={styles.viewWrapper} >
            <Text style={styles.subtext2}>{user.points}</Text>
          </View>
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
          <View style={styles.tabRow}>
            <TouchableOpacity style={tasksActive ? styles.tabActive:styles.tab } onPress={this.toggleTab} disabled={tasksActive} >
              <Text style={tasksActive ? styles.subheaderActive:styles.subheaderTab}>Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rewardsActive ? styles.tabActive:styles.tab } onPress={this.toggleTab} disabled={rewardsActive}>
              <Text style={rewardsActive ? styles.subheaderActive:styles.subheaderTab}>Rewards</Text>
            </TouchableOpacity>
          </View>
          {tasksActive ? 
            (<View style={styles.cardRow}>
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
                  statusIcon={this.handleTaskStatusIcon(item.completed, item.confirmed)}
                  points = {'Puntos: '+item.task.value}
                  icon = {this.handleCategoryIcon(item.task['task-type'])}
                  iconColor = 'white'
                  disabled={this.handleTask(item.confirmed) ? true : false}
                  submitform={!this.handleTask(item.completed) ? ( () => this.props.navigation.navigate('Task', { task: item.task, userTask: item } )) : ( () => this.props.navigation.navigate('ConfirmTasks',{ id: item.id }) )} 
                />
                </View> }
              /> 
            </View>
              
            ): <FlatList
                data={rewards}
                keyExtractor={item => item.id}
                renderItem={({item}) => 
                <View>
                    <ListItem
                    firstLine={item.name}
                    submitform = {() => this.props.navigation.navigate('ConfirmRewards',{reward: item})}
                    secondLine={'Puntos: '+item.value}
                    color= '#E8E8E8'
                    />
                </View> }
                />  }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    marginTop: 40,
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
    marginBottom: 20
  },
  subtext1: {
    fontSize: 18,
    color: 'black',
    fontWeight: "500",
    marginBottom: 5
  },
  subtext2: {
    fontSize: 22,
    color: 'white',
    fontWeight: "700",
    //marginBottom: 20
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: "500",
    marginBottom: 10
  },
  viewWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 50,
    height: 50,
    padding: 5,
    marginBottom: 20,
    backgroundColor: 'darkcyan'
    //borderWidth: 1,
  },
  tabRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 5
  },
  tab: {
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  tabActive: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    fontWeight: "500",
    borderBottomWidth: 1,
  },
  subheaderTab: {
    fontSize: 16,
    color: '#808080',
    fontWeight: "300",
    //marginBottom: 20
  },
  subheaderActive: {
    fontSize: 16,
    color: 'black',
    fontWeight: "500",
    //marginBottom: 20
  },
  picWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    width: 75,
    height: 75,
    //padding: 5,
    //marginBottom: 10,
    backgroundColor: '#808080'
    //borderWidth: 1,
  },
  headerRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 10,
    // marginTop: 5
  },
  lottieView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1
  },
});
export default HomeScreen;