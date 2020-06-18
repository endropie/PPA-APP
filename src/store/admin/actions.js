
export const assignAccurate = ({ commit }, data) => {
  commit('setAccurate', JSON.parse(JSON.stringify(data)))
}

export const setItemConfig = ({ state, commit }, data) => {
  commit('setConfig', JSON.parse(JSON.stringify(data)))
}
