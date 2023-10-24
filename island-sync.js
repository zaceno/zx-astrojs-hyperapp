export default (state = {}) => {
  const stateRef = { state }
  const synced = []
  const syncmw = dispatch => {
    synced.push(dispatch)
    return (action, payload) => {
      const news = Array.isArray(action) ? action[0] : action
      if (
        typeof news !== "function" &&
        stateRef.state !== news &&
        news != null
      ) {
        stateRef.state = news
        synced.forEach(d => d(news))
      }
      dispatch(action, payload)
    }
  }
  return props => ({
    ...props,
    dispatch: d => syncmw(props.dispatch ? props.dispatch(d) : d),
    init: [stateRef.state, !!props.init && (d => d(props.init))],
  })
}
