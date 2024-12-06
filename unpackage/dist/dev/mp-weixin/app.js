"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/markers/markers.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const store = common_vendor.useStore();
    common_vendor.onLaunch(() => {
      console.log("App Launch");
      store.dispatch("initializeMarkers");
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(stores_index.store);
  return {
    app,
    store: stores_index.store
    // 导出 store 给 uni-app 使用
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
