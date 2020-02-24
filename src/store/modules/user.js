import { login, logout, getinfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    console.log('返回的token:' + state.token)
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  // es6参数解构写法
  login({ commit }, userInfo) {
    // es6参数解构，取userInfo里的username，password
    const { username, password } = userInfo
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
      // 调用api接口的login方法，login方法返回的是封装好的axios实例
      login({ username: username.trim(), password: password }).then(response => {
        console.log(response)
        if (response.token) {
          // es6解构赋值，获取response中的data,即{token: "admin-token"}
          const { data } = response
          // 设置token
          commit('SET_TOKEN', response.token.id)
          // 保存token到cookie
          setToken(response.token.id)
          // 成功
          resolve()
        } else {
          reject('账号或密码错误！')
        }
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getinfo(state.token).then(response => {
        if (!response.userinfo) {
          // 验证失败，请重新登录。
          reject('Verification failed, please Login again.')
        }
        // es6参数解构，获取用户名，头像
        const { id, username, role, avatar } = response.userinfo
        // 保存状态
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        // 返回成功的数据
        resolve(response.userinfo)
      }).catch(error => {
        console.log(error)
      })
    })
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response
    //     if (!data) {
    //       // 验证失败，请重新登录。
    //       reject('Verification failed, please Login again.')
    //     }
    //     // es6参数解构，获取用户名，头像
    //     const { name, avatar } = data
    //     // 保存状态
    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     // 返回成功的数据
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
      // })
      // .catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

