import { h, text } from "hyperapp"

const process = children => {
  if (Array.isArray(children)) return children.map(process).flat()
  if (typeof children === "string" || typeof children === "number")
    return text(children)
  return children
}

const jsx = (tag, { children, ...props }, key) => {
  children = process(children)
  props = { ...props, key }
  return typeof tag === "function"
    ? tag(props, children)
    : h(tag, props, children)
}

const Fragment = (_, children) => children

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment }
