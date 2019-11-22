import React, { Component } from 'react'
import { Text, View, StyleSheet, Animated, Easing } from 'react-native';
import {AsyncStorage} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animation from 'lottie-react-native';
import api from '../api/api.js';
import RoundButton from "../components/RoundButton";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { ScrollView } from 'react-native-gesture-handler';


class TaskScreen extends Component {
  constructor(props) {
    super(props);
      this.state = {
      isStart: false,
      isComplete: false,
      speed: 1,
      progress: new Animated.Value(0),
    }
  }

  toggleStart = () => {
    this.setState({
      isStart: true,
    });
  }

  componentDidMount(){
    const { navigation } = this.props
    this.willFocusListener = navigation.addListener(
      'willFocus',
      () => {
        this.getData()
      }
    )
    // this.animation.play(30, 120);
    // Animated.timing(this.state.progress, {
    //   toValue: 1,
    //   duration: 1000,
    //   easing: Easing.linear,
    // }).start();
    // console.log(this.state.progress)
    this.playLottie();
    //this.animation.play();
  }

  playLottie = () => {
    Animated.timing(this.state.progress, {
      toValue: 0.5,
      // from: 0,
      // to: 0.5,
      duration: 5000,
      easing: Easing.linear,
    }).start();
    //this.animation.play(30, 120);
  }

    playAnimation = () => {
      this.setState({speed: 1})
  }

  pauseAnimation = () => {
      this.setState({speed: 0})
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
        rewards: rewards.data,
      });
    }
    catch(error) {
      console.log(error)
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

  onSubmitSteps = async () => {
    this.setState({
      isComplete: true,
    })
    setTimeout(async () => {
      try {
        const { userTask } = this.props.navigation.state.params
        const token = await AsyncStorage.getItem('userToken')
        const currentDay = new Intl.DateTimeFormat('en-US',{
          weekday: 'short'
        }).format(new Date()).toLowerCase()
        const completed = userTask.completed || ''
        await api.update('user-task',{
          id: userTask.id,
          completed: completed + `${currentDay},`,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          } 
        })
        this.props.navigation.navigate('Home')
      } catch (error) {
        alert("Error en actualizar")
        console.log(error)
      }
      }, 2000)
  }

  render() {
    const { isStart, isComplete, progress } = this.state;

    const progressStepsStyle = {
      activeStepIconBorderColor: 'darkcyan',
      activeLabelColor: '#686868',
      activeStepNumColor: 'white',
      activeStepIconColor: 'darkcyan',
      completedStepIconColor: '#686868',
      completedProgressBarColor: 'darkcyan',
      completedCheckColor: '#4bb543',
      completedStepIconColor: 'darkcyan',
      disabledStepIconColor: '#B0B0B0',
      progressBarColor: '#B0B0B0',
      labelColor: '#808080',
      activeLabelColor: 'black',
      completedCheckColor: 'white'
    }
    const {task} = this.props.navigation.state.params

    return (
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.avoidView}>
          <View style= {styles.iconWrapper}>
            <Icon
              name={this.handleIcon(task['task-type'])}
              color= {'white'}
              size={28}
              />
          </View>
          <Text style={styles.header}>{task.name}</Text>
          <View style={styles.container}>
            {isComplete ? (<Animation 
              source={require('../../assets/party.json')} autoPlay loop={false}
              //ref={(animation) => this.myAnimation = animation}
              style={{width:'100%', height:'100%', position: 'absolute'}}
              />) : null}
          {isStart ? 
            (<ProgressSteps {...progressStepsStyle}>
            <ProgressStep
              label="First"
              onNext={this.onPaymentStepComplete}
              onPrevious={this.onPrevStep}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              nextBtnStyle = {styles.nextBtnStyle}
              //previousBtnTextStyle={buttonTextStyle}
              //scrollViewProps={this.defaultScrollViewProps}
            >
              <View style={{ alignItems: 'center' }}>
                <Text>Payment step content</Text>
                <Animation 
                source={require('../../assets/data1.json')} autoPlay loop 
                ref={animation => {
                  this.animation = animation;
                }}
                progress={progress}
                onAnimationFinish={this.pauseAnimation}
                speed={this.state.speed} 
                style={{width:120, height:220}}
                />
              </View>
            </ProgressStep>
            <ProgressStep
              label="Second"
              onNext={this.onNextStep}
              onPrevious={this.onPrevStep}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              nextBtnStyle = {styles.nextBtnStyle}
              previousBtnTextStyle={styles.prevBtnTextStyle}
              previousBtnStyle = {styles.prevBtnStyle}
              //scrollViewProps={this.defaultScrollViewProps}
            >
              <View style={{ alignItems: 'center' }}>
                <Text>Shipping address step content</Text>
              </View>
            </ProgressStep>
            <ProgressStep
              label="Third"
              onNext={this.onNextStep}
              onPrevious={this.onPrevStep}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              nextBtnStyle = {styles.nextBtnStyle}
              previousBtnTextStyle={styles.prevBtnTextStyle}
              previousBtnStyle = {styles.prevBtnStyle}
              onSubmit={this.onSubmitSteps}
              nextBtnDisabled={isComplete}
            >
              <View style={{ alignItems: 'center' }}>
                <Text>Another step content</Text>
              </View>
            </ProgressStep>
        </ProgressSteps>)
          :<RoundButton
          labelText="Start"
          color = 'black'
          submitform={this.toggleStart}
          width= {140}
          height= {70}
          textColor= 'white'
          labelTextSize= {22}
          padding = {20}
          />}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    marginTop: 15,
    flex: 1
  },
  avoidView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex:1
   },
   container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    height: 480,
    padding: 10
  },
  header: {
    fontSize: 30,
    color: 'black',
    fontWeight: "300",
    marginBottom: 25,
  },
  subheader: {
    fontSize: 16,
    color: 'black',
    fontWeight: "800",
    marginBottom: 5
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
  nextBtnTextStyle:{
    color: 'white',
    fontWeight: "700",
    fontSize: 16
  },
  nextBtnStyle:{
    alignItems: "center",
    justifyContent: "center",
    //borderWidth: 1,
    borderRadius: 40,
    width: 85,
    height: 60,
    backgroundColor: 'darkcyan',
  },
  prevBtnTextStyle:{
    color: 'black',
    fontWeight: "700",
    fontSize: 16
  },
  prevBtnStyle:{
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderRadius: 40,
    width: 85,
    height: 60,
    //backgroundColor: 'black'
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 50,
    height: 50,
    padding: 5,
    marginBottom: 10,
    backgroundColor: 'darkcyan'
    //borderWidth: 1,
  },
});

export default TaskScreen;