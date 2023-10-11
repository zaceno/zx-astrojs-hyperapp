export default () => ({
  name: "hyperapp",
  hooks: {
    "astro:config:setup": ({ addRenderer, updateConfig }) => {
      updateConfig({
        vite: {
          esbuild: {
            jsxFactory: "_jsx",
            jsxInject: 'import _jsx from "hyperapp-jsx-pragma"',
          },
        },
      })
      addRenderer({
        name: "hyperapp",
        clientEntrypoint: "@zxlabs/astrojs-hyperapp/client-renderer.js",
        serverEntrypoint: "@zxlabs/astrojs-hyperapp/server-renderer.js",
      })
    },
  },
})
