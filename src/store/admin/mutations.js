import { colors, LocalStorage } from 'quasar'
import axios from 'axios'

export const setNow = (state) => {
  state.NOW = new Date()
}

export const setPageDrawer = (state, val) => {
  state.PAGE.drawer = val
}

export const setPageShow = (state, val) => {
  state.PAGE.show = val
}

export const setPageMeta = (state, meta) => {
  state.PAGEMETA = {
    title: '',
    hash: '',
    icon: '',
    iframeTabs: false,
    backRoute: '/admin',
    tabs: [],
    ...meta
  }
  // console.error('update->PAGEMETA', state.PAGEMETA, meta)
}

export const setLogin = (state, val) => {
  state.AUTH = val.auth
  state.USER = val.user
  LocalStorage.set('store:auth', JSON.stringify(state.AUTH))
  LocalStorage.set('store:user', JSON.stringify(state.USER))
}

export const setLocked = (state) => {
  state.AUTH = Object.assign({})
  LocalStorage.set('store:auth', state.AUTH)
}

export const setLogoff = (state) => {
  state.AUTH = Object.assign({})
  state.USER = Object.assign({})
  LocalStorage.set('store:auth', state.AUTH)
  LocalStorage.set('store:user', state.USER)
  // LocalStorage.remove('store:auth')
}

export const setSetting = (state, values) => {
  state.SETTING = Object.assign(state.SETTING, values)
  LocalStorage.set('store:setting', JSON.stringify(state.SETTING))
}

export const setConfig = (state, values) => {
  state.CONFIG = Object.assign(state.CONFIG, values)
  LocalStorage.set('store:setting', JSON.stringify(state.CONFIG))
}

export const setBaseURL = (state, value) => {
  state.CONFIG.general.baseURL = value
  axios.defaults.baseURL = value
  LocalStorage.set('store:setting', JSON.stringify(state.CONFIG))

  return value
}

export const setTheme = (state, name) => {
  const newColor = state.THEMES[name]
  state.LAYOUT.color = Object.assign(state.LAYOUT.color, newColor)
  const object = state.LAYOUT.color
  for (const i in object) {
    if (object.hasOwnProperty(i)) {
      const c = colors.getBrand(object[i]) || object[i]
      state.LAYOUT.color[i] = c
      colors.setBrand(i, c)
    }
  }
  // Save to storage
  LocalStorage.set('store:layout', JSON.stringify(state.LAYOUT))
}

export const setMode = (state, mode) => {
  if (typeof mode === 'boolean') {
    state.LAYOUT.isDark = mode
  } else {
    state.LAYOUT.isDark = !state.LAYOUT.isDark
  }
  // Save to storage
  LocalStorage.set('store:layout', JSON.stringify(state.LAYOUT))
}
