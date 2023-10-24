import undom from "undom"
import { app } from "hyperapp"
global.document = undom()

const enc = s => ("" + s).replace(/[&'"<>]/g, a => `&#${a.codePointAt(0)};`)
const attr = a => ` ${a.name}="${enc(a.value)}"`
const serialize = el =>
  el.nodeType == 3
    ? enc(el.nodeValue)
    : "<" +
      el.nodeName.toLowerCase() +
      el.attributes.map(attr).join("") +
      ">" +
      el.childNodes.map(serialize).join("") +
      "</" +
      el.nodeName.toLowerCase() +
      ">"

function check(component, props, children) {
  if (typeof component !== "function") return false
  const test = component(props, children)
  return (
    typeof test === "object" &&
    test.constructor === Object &&
    typeof test.view === "function"
  )
}

const renderToStaticMarkup = async (componentFn, props) =>
  new Promise(resolve => {
    const parent = document.createElement("div")
    const node = document.createElement("div")
    parent.appendChild(node)
    const stop = app({ ...componentFn(props), subscriptions: _ => [], node })
    setTimeout(() => {
      stop() //prevents any eventual callbacks from calling back
      resolve({ html: serialize(parent.firstChild) })
    }, 0)
  })

export default { check, renderToStaticMarkup }
