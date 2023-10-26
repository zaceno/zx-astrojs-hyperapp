import { app } from "hyperapp"
import slotProcessor from "./slots.js"

export default element => async (component, props, slots, meta) => {
  if (meta.client === "only") {
    element.innerHTML = "<div></div>"
  }
  const [content, namedSlots] = slotProcessor(slots, true)
  app({
    ...component({ ...namedSlots, ...props }, content),
    node: element.firstChild,
  })
}
