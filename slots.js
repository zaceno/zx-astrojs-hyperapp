import { h } from "hyperapp"

const kebabToCamel = str =>
  str.trim().replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase())

const slotVNode = (html, name, hydrate) =>
  h(hydrate ? "astro-slot" : "astro-static-slot", { name, innerHTML: html })

// takes slotted content from astro and returns [defaultSlot, {namedSlots}]
// as hyperapp components that can be passed to the real component
export default (slots, hydrate) => {
  if (!slots) return [undefined, {}]
  let nodes = {}
  for (let _name in slots) {
    let name = kebabToCamel(_name)
    nodes[name] = slotVNode(slots[_name], name, hydrate)
  }
  const { default: dfault, ...namedSlots } = nodes
  return [dfault, namedSlots]
}
