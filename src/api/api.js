import Kitsu from 'kitsu'  

const production = 'https://effeta-api.herokuapp.com/api/v1';
const api = new Kitsu({
  baseURL: production
})

export default api;