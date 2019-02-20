const app = {
  state: {
    listPosition: {}
  },
  mutations: {
    UPDATE_POSITION (state, listPosition) {
      state.listPosition = listPosition
    }
  }
}

export default app
