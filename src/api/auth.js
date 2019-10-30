import axios from 'axios';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';


const production = 'https://effeta-api.herokuapp.com/api/v1';

export default axios.create({
  baseURL: production,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${AsyncStorage.getItem('access_token')}`,
  },
});