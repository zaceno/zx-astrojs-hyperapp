import { app } from "hyperapp"
import slotProcessor from "./slots.js"
export default element => async (component, props, slots, meta) => {
  if (meta.client === "only") {
    element.innerHTML = "<div></div>"
  }
  const [content, namedSlots] = slotProcessor(slots)
  const stop = app({
    ...component({ ...namedSlots, ...props }, content),
    node: element.firstChild,
  })
  // element.addEventListener(
  //   "astro:unmount",
  //   () => {
  //     console.log("REG ON PARENT")
  //   },
  //   { once: true },
  // )
  // element.firstChild.addEventListener(
  //   "astro:unmount",
  //   () => {
  //     console.log("unmount")
  //     stop()
  //   },
  //   {
  //     once: true,
  //   },
  // )
}
