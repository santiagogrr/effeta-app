import React, { Component } from 'react'
import { Button, Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import FloatingButton from "../components/FloatingButton";
import Notification from "../components/Notification";
import ListItem from "../components/ListItem";
import { ScrollView } from 'react-native-gesture-handler';


class RewardScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      rewards: [],
      name: '',
      value: '',
      validName: false,
      validValue: false,
      //user: [],
      formValid: false,
      isRedeemed: false,
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

  getData = async () =>{
    try{
      const userId = await AsyncStorage.getItem('userId')
      const token = await AsyncStorage.getItem('userToken')
      const rewards = await api.get(`users/${userId}/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`
          } 
        } 
      )
      this.setState({
        rewards: rewards.data.filter(item => item.status !== 'redeemed'),
      });
    }
    catch(error) {
      console.log(error)
    }
  }

  onRefresh = () => {
    this.setState({ 
      rewards: [],
    });
    //Call the Service to get the latest data
    this.getData;
  }

  handleDelete = async (id) => {
    try{
      api.delete('rewards',id);
      this.setState({ 
        rewards: this.state.rewards.filter(item => item.id !== id),
      });
      alert('Delete Successful')
    }
    catch(error){
      console.log(error)
    }
  }

  handleReward = (item) => {
    Alert.alert(item.name,'Wanna redeem '+item.value+' points for this reward?',
    [
      {text: 'OK', onPress: () => this.confirmReward(item)},
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],)
  }

  confirmReward = async (reward) => {
    try {
      const { userTask, task, rewards } = this.state;
      const token = await AsyncStorage.getItem('userToken')
      const user = await auth.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(user.data.points > reward.value){
        await api.update('reward',{
          id: reward.id,
          status: 'redeemed',
        },{
          headers: {
            Authorization: `Bearer ${token}`
          } 
        })
        this.setState({
          isRedeemed: true,
          rewards: rewards.filter((item) => item.id !== reward.id),
        })
        this.props.navigation.navigate('Home')
      } else {
        alert("Puntos insuficientes")
      }
      
    } catch (error) {
      alert("Error")
    }
  }

  toggleLottie = () => {
    this.setState({ 
      isRedeemed: false,
    });
  }

  render() {
    const { rewards, isRedeemed } = this.state
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <Text style={styles.header}>Rewards List</Text>
          {isRedeemed ? (<LottieView 
              source={require('../../assets/exploding-confetti.json')} autoPlay loop={false}
              style={styles.lottieView}
              onAnimationFinish = {this.toggleLottie}
              />) : null}
          <FlatList
          data={rewards}
          ItemSeparatorComponent={this.renderSeparator}  
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <View>
              <ListItem
              firstLine={item.name}
              secondLine={'Puntos: '+item.value}
              submitform = {() => this.handleReward(item)}
              color= '#E8E8E8'
              icon = 'close-circle'
              iconColor = 'black'
              handleDelete = {() => this.handleDelete(item.id)}
              />
          </View> }
          /> 
        </ScrollView>
        <FloatingButton
          submitform={() => this.props.navigation.navigate('AddReward')}
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
    marginBottom: 20
  },
  item: {
    padding: 10,
    fontSize: 18,
    //height: 44,
  },
  lottieView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    //top: 10,
    alignSelf: 'center',
    //right: 5,
    zIndex: 1
  },
});

export default RewardScreen;