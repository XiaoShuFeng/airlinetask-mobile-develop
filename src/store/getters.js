const getters = {
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  login: state => state.user.login,
  loading: state => state.user.loading,
  listPosition: state => state.app.listPosition,
  msgCount: state => state.user.msgCount
}

export default getters
