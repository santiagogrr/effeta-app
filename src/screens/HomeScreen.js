import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import {AsyncStorage} from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../api/api.js';
import auth from '../api/auth';
import InputField from "../components/InputField";
import TaskCard from "../components/TaskCard";
import CategoryCard from "../components/CategoryCard";
import Checkbox from "../components/Checkbox";
import { ScrollView } from 'react-native-gesture-handler';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      rewards: [],
      name: '',
      value: '',
      user: [],
      taskDone: false
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

  async componentDidMount(){
    try{
      const token = await AsyncStorage.getItem('userToken')
      const user = await auth.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`
          } 
        } 
      )
      console.log(user.data.id)
      this.setState({
        user: user.data
      });
      const rewards = await api.get(`users/${user.data['id']}`, {
          include: 'rewards',
          headers: {
            Authorization: `Bearer ${token}`
          } 
        } 
      )
      this.setState({
        rewards: rewards.data.rewards
      });
      //console.log(this.state.rewards)
    }
    catch(error){

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
      // this.setState({
      //   isLoading: false,
      //   formValid: false
      // });
    }
  }


  render() {
    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
           {/* <LottieView 
           source={require('../../assets/data1.json')} autoPlay loop 
           style={{width:120, height:220}}
           /> */}
          <Text style={styles.header}>Hey Matt!</Text>
          <Text style={styles.subheader}>Sunday, March 12</Text>
          {/* <Checkbox
            selected={this.state.taskDone} 
            onPress={this.handleCheckBox}
            color = '#211f30'
          /> */}
          <Text style={styles.label}>Categories</Text>
          <View style={styles.cardRow}>
            <CategoryCard
              labelText="Kitchen"
              color= '#e0ebeb'
              labelColor = 'black'
              icon = 'fridge'
              iconColor = 'black'
            />
            <CategoryCard
              labelText="Bed"
              color= 'black'
              labelColor = 'white'
              icon = 'bed-empty'
              iconColor = 'white'
            />
            <CategoryCard
              labelText="Clothing"
              color= '#00802b'
              labelColor = 'white'
              icon = 'tshirt-crew'
              iconColor = 'white'
            />
          </View>
          <Text style={[{ marginTop: 20 }, styles.label]}>Today</Text>
          <View style={styles.cardRow}>
            <TaskCard
            labelText="Lavar trastes"
            color= '#e0e0eb'
            labelColor = 'black'
            icon = 'fridge'
            iconColor = 'blue'
            />
            <TaskCard
            labelText="Tender la cama"
            color= '#e0e0eb'
            labelColor = 'black'
            icon = 'bed-empty'
            iconColor = 'green'
            />
            <TaskCard
            labelText="Lavarse los dientes"
            color= '#e0e0eb'
            labelColor = 'black'
            icon = 'human'
            iconColor = 'black'
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
  cardRow: {
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