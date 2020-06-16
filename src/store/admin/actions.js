
export const assignAccurate = ({ commit }, data) => {
  console.warn('action', data)
  commit('setAccurate', data)
}
