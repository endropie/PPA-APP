import axios from 'axios'

export default async ({ app, Vue }) => {
  Vue.prototype.$axios = axios

  // axios.defaults.baseURL = 'http://laravel.ppa'
  // axios.defaults.baseURL = 'localhost:8000'
  const CONFIG = app.store.state.admin.CONFIG
  const AUTH = app.store.getters['admin/AUTH']
  if (CONFIG) {
    axios.defaults.baseURL = CONFIG.general.baseURL
  }

  if (AUTH.hasOwnProperty('access') && AUTH.isTokenValid()) {
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH.access.token}`
  }

  axios.set = (method, url, data) => {
    if (method.toUpperCase() === 'POST') return axios.post(url, data)

    if (method.toUpperCase() === 'PUT') return axios({method: method, url: url, data: data})

    if (method.toUpperCase() === 'PATCH') return axios({method: method, url: url, data: data})
  }
  axios.setHeader = (values = []) => {
    values.forEach(function (data) {
      axios.defaults.headers.common[data.key] = data.value
    }
    )
  }

  axios.validToken = (callback) => {
    axios.post('/api/v1/auth/valid-token', {})
      .then((response) => callback(response))
      .catch(() => callback())
  }
}
