import { app } from "hyperapp"

export default element => async (component, props, _, meta) => {
  if (meta.client === "only") {
    element.innerHTML = "<div></div>"
  }
  app({ ...component(props), node: element.firstChild })
}
