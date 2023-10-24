import { createFilter } from "vite"
import { transformSync } from "@babel/core"

const babelPluginJSX = [
  "@babel/plugin-transform-react-jsx",
  {
    runtime: "automatic",
    importSource: "hyperapp-jsx-pragma",
  },
]

const vitePluginConfig = () => ({
  optimizeDeps: { include: ["hyperapp-jsx-pragma/jsx-runtime"] },
})

const vitePluginTransform = (options = {}) => {
  const filter = createFilter(
    options.include || [/\.jsx/],
    options.exclude || ["**/node_modules/*"],
  )

  return (code, id) => {
    if (!filter(id)) return
    return transformSync(code, { plugins: [babelPluginJSX] })
  }
}

const vitePlugin = options => ({
  name: "vite:hyperapp-jsx",
  enforce: "pre",
  config: vitePluginConfig,
  transform: vitePluginTransform(options),
})

export default options => ({
  name: "hyperapp",
  hooks: {
    "astro:config:setup": ({ addRenderer, updateConfig }) => {
      updateConfig({ vite: { plugins: [vitePlugin(options)] } })
      addRenderer({
        name: "hyperapp",
        clientEntrypoint: "@zxlabs/astrojs-hyperapp/client-renderer.js",
        serverEntrypoint: "@zxlabs/astrojs-hyperapp/server-renderer.js",
      })
    },
  },
})
