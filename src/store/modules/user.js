const user = {
  state: {
    userId: '',
    userName: '',
    roles: '',
    login: false,
    loading: false,
    msgCount: '0'
  },
  mutations: {
    UPDATE_LOADING_STATUS (state, loading) {
      state.loading = loading
    },
    UPDATE_LOGIN (state, login) {
      state.login = login
    },
    SET_USER_ID (state, userId) {
      state.userId = userId
    },
    SET_USER_NAME (state, userName) {
      state.userName = userName
    },
    SET_USER_ROLES (state, roles) {
      state.roles = roles
    },
    SET_MSG_COUNT (state, count) {
      state.msgCount = count
    }
  }
}

export default user
