import { app } from "hyperapp"

export default ({ init, subscriptions, dispatch }) => {
  const stateRef = { state: {} }
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
  app({
    init,
    subscriptions,
    dispatch: d => syncmw(!!dispatch ? dispatch(d) : d),
  })
  return view => ({ view, init: stateRef.state, dispatch: syncmw })
}
