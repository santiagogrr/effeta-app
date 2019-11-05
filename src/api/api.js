import Kitsu from 'kitsu'  
import {AsyncStorage} from 'react-native';

const production = 'https://effeta-api.herokuapp.com/api/v1';
const api = new Kitsu({
  baseURL: production,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${AsyncStorage.getItem('userToken')}`,
  },
})

export default api;