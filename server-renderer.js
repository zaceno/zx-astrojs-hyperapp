import { JSDOM } from "jsdom"
import { app } from "hyperapp"
import slotProcessor from "./slots.js"
const dom = new JSDOM("")

global.document = dom.window.document //undom()
function check(component, props, children) {
  if (typeof component !== "function") return false
  const test = component(props, children)
  return (
    typeof test === "object" &&
    test.constructor === Object &&
    typeof test.view === "function"
  )
}

const renderToStaticMarkup = async (componentFn, props, slots, meta) =>
  new Promise(resolve => {
    const parent = document.createElement("div")
    const node = document.createElement("div")
    parent.appendChild(node)
    const [defaultSlot, namedSlots] = slotProcessor(slots, !!meta.hydrate)
    const stop = app({
      ...componentFn({ ...namedSlots, ...props }, defaultSlot),
      subscriptions: _ => [],
      node,
    })
    setTimeout(() => {
      stop() //prevents any eventual callbacks from calling back
      resolve({ html: parent.firstChild.outerHTML })
    }, 0)
  })

export default { check, renderToStaticMarkup }
