import { h } from "hyperapp"

/*
  Overriding the default prototypes is unfortunately necessary,
  since Hyperapp's vdom doesn't quite know how to handle slotted
  nodes in ssr:ed views.
*/
if (typeof Node !== "undefined") {
  const originalNodeRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    try {
      originalNodeRemoveChild.call(this, child)
    } catch (e) {
      if (this.tagName !== "ASTRO-SLOT") throw e
    }
  }
}

const kebabToCamel = str =>
  str.trim().replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase())

const slotVNode = (html, name) => h("astro-slot", { name, innerHTML: html })

// takes slotted content from astro and returns [defaultSlot, {namedSlots}]
// as hyperapp components that can be passed to the real component
export default slots => {
  if (!slots) return [undefined, {}]
  let nodes = {}
  for (let _name in slots) {
    let name = kebabToCamel(_name)
    nodes[name] = slotVNode(slots[_name], name)
  }
  const { default: dfault, ...namedSlots } = nodes
  return [dfault, namedSlots]
}
