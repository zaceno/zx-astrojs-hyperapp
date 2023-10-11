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

const check = () => true

const renderToStaticMarkup = async (componentFn, props) =>
  new Promise(resolve => {
    const parent = document.createElement("div")
    const node = document.createElement("div")
    parent.appendChild(node)
    //TODO
    // prevent running app from effects that aren't defined
    // might be problem with fetch, setTimeout, setInterval
    // as those do exist in node. We just want initial
    // actions to happen
    app({ ...componentFn(props), node })
    setTimeout(() => {
      resolve({ html: serialize(parent.firstChild) })
    }, 0)
  })

export default { check, renderToStaticMarkup }
