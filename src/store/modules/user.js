import { login, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  role: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  login({ commit }, userInfo) {
    // es6参数解构，取userInfo里的username，password
    const { username, password } = userInfo
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
      // 调用api接口的login方法，login方法返回的是封装好的axios实例
      login({ username: username.trim(), password: password }).then(response => {
        if (response.token != null) {
          // 设置token
          commit('SET_TOKEN', response.token)
          // 保存token到cookie
          setToken(response.token)
          // 成功
          resolve()
        } else {
          console.log('账号或密码错误！')
          reject('账号或密码错误！')
        }
      }).catch(error => {
        reject('账号或密码错误！')
        console.log(error)
      })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { username, avatar, role } = response.userinfo
        if (response.code == 0) {
          // 验证失败，请重新登录。
          reject('验证失败，请重新登录。')
        } else {
          // 保存状态
          commit('SET_ROLE', role)
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          // 返回成功的数据
          resolve(response.userinfo)
        }
      }).catch(error => {
        console.log(error)
        reject('登录失效，请重新登录!')
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
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

