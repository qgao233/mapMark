"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  setup() {
    const store = common_vendor.useStore();
    const createPopup = common_vendor.ref(null);
    const editPopup = common_vendor.ref(null);
    const deleteConfirmPopup = common_vendor.ref(null);
    const isCreatingMode = common_vendor.ref(false);
    const mapState = common_vendor.computed(() => store.state.map);
    const newMarker = common_vendor.ref({
      title: "",
      description: "",
      location: null
    });
    const editingMarker = common_vendor.ref({
      id: "",
      title: "",
      description: "",
      location: null
    });
    const displayMarkers = common_vendor.computed(() => {
      return store.state.markers.items.map((marker) => ({
        id: marker.id,
        latitude: marker.location.latitude,
        longitude: marker.location.longitude,
        title: marker.title,
        iconPath: "/static/images/marker.png",
        width: 32,
        height: 32,
        callout: {
          content: marker.title,
          color: "#000000",
          fontSize: 14,
          borderRadius: 4,
          padding: 8,
          display: "ALWAYS",
          bgColor: "#ffffff"
        }
      }));
    });
    common_vendor.ref(false);
    common_vendor.ref(true);
    const isSearchPopupOpen = common_vendor.ref(false);
    const isSearchBoxHidden = common_vendor.ref(false);
    const startCreating = () => {
      isCreatingMode.value = true;
    };
    const cancelCreating = () => {
      isCreatingMode.value = false;
    };
    const onMapTap = (e) => {
      if (!isCreatingMode.value)
        return;
      newMarker.value = {
        title: "",
        description: "",
        location: {
          latitude: e.detail.latitude,
          longitude: e.detail.longitude
        }
      };
      isCreatingMode.value = false;
      createPopup.value.open();
    };
    const onMarkerTap = (e) => {
      if (isCreatingMode.value)
        return;
      console.log(233);
      const markerId = e.detail.markerId;
      const marker = store.state.markers.items.find((m) => m.id == markerId);
      console.log(e, store.state.markers.items);
      if (!marker)
        return;
      editingMarker.value = { ...marker };
      editPopup.value.open();
    };
    const cancelCreate = () => {
      createPopup.value.close();
      newMarker.value = {
        title: "",
        description: "",
        location: null
      };
    };
    const confirmCreate = async () => {
      if (!newMarker.value.title) {
        common_vendor.index.showToast({
          title: "请输入标题",
          icon: "none"
        });
        return;
      }
      try {
        await store.dispatch("createMarker", {
          ...newMarker.value,
          createTime: Date.now(),
          updateTime: Date.now()
        });
        createPopup.value.close();
        newMarker.value = {
          title: "",
          description: "",
          location: null
        };
        common_vendor.index.showToast({
          title: "创建成功",
          icon: "success"
        });
      } catch (error) {
        console.error("创建标记失败:", error);
        common_vendor.index.showToast({
          title: "创建失败",
          icon: "error"
        });
      }
    };
    const onTitleInput = (e) => {
      newMarker.value.title = e.detail.value.trim();
    };
    const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          isHighAccuracy: true,
          success: (res) => {
            console.log("当前位置:", res);
            resolve({
              latitude: res.latitude,
              longitude: res.longitude
            });
          },
          fail: (err) => {
            console.error("获取位置失败:", err);
            resolve({
              latitude: 39.909,
              longitude: 116.397
            });
          }
        });
      });
    };
    const moveToCurrentLocation = async () => {
      try {
        common_vendor.index.showLoading({
          title: "定位中...",
          mask: true
        });
        const location = await getCurrentLocation();
        store.commit("SET_MAP_CENTER", location);
        common_vendor.index.hideLoading();
      } catch (error) {
        console.error("定位失败:", error);
        common_vendor.index.showToast({
          title: "定位失败",
          icon: "error"
        });
      }
    };
    const cancelEdit = () => {
      editPopup.value.close();
      editingMarker.value = {
        id: "",
        title: "",
        description: "",
        location: null
      };
    };
    const confirmEdit = async () => {
      if (!editingMarker.value.title) {
        common_vendor.index.showToast({
          title: "请输入标题",
          icon: "none"
        });
        return;
      }
      try {
        await store.dispatch("updateMarker", {
          ...editingMarker.value,
          updateTime: Date.now()
        });
        editPopup.value.close();
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
      } catch (error) {
        console.error("更新标记失败:", error);
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "error"
        });
      }
    };
    const deleteMarker = () => {
      deleteConfirmPopup.value.open();
    };
    const confirmDelete = async () => {
      try {
        await store.dispatch("deleteMarker", editingMarker.value.id);
        deleteConfirmPopup.value.close();
        editPopup.value.close();
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
      } catch (error) {
        console.error("删除标记失败:", error);
        common_vendor.index.showToast({
          title: "删除失败",
          icon: "error"
        });
      }
    };
    const cancelDelete = () => {
      deleteConfirmPopup.value.close();
    };
    const openLocationChooser = async () => {
      try {
        const location = await common_vendor.index.chooseLocation();
        console.log("选择的位置:", location);
        store.commit("SET_MAP_CENTER", {
          latitude: location.latitude,
          longitude: location.longitude
        });
        if (isCreatingMode.value) {
          newMarker.value = {
            title: location.name || "",
            description: location.address || "",
            location: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          };
          createPopup.value.open();
          isCreatingMode.value = false;
        }
      } catch (error) {
        console.log("取消选择位置或发生错误:", error);
      }
    };
    common_vendor.onMounted(() => {
      moveToCurrentLocation();
    });
    common_vendor.onBeforeUnmount(() => {
    });
    return {
      createPopup,
      isCreatingMode,
      mapState,
      newMarker,
      displayMarkers,
      startCreating,
      cancelCreating,
      onMapTap,
      onMarkerTap,
      cancelCreate,
      confirmCreate,
      onTitleInput,
      moveToCurrentLocation,
      editPopup,
      deleteConfirmPopup,
      editingMarker,
      cancelEdit,
      confirmEdit,
      deleteMarker,
      confirmDelete,
      cancelDelete,
      openLocationChooser,
      isSearchPopupOpen,
      isSearchBoxHidden
    };
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_uni_popup2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_popup + _easycom_uni_popup_dialog)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$setup.isSearchBoxHidden
  }, !$setup.isSearchBoxHidden ? {
    b: common_assets._imports_0,
    c: $setup.isSearchPopupOpen ? 1 : "",
    d: common_vendor.o((...args) => $setup.openLocationChooser && $setup.openLocationChooser(...args))
  } : {}, {
    e: $setup.mapState.center.latitude,
    f: $setup.mapState.center.longitude,
    g: $setup.displayMarkers,
    h: $setup.mapState.zoom,
    i: common_vendor.o((...args) => $setup.onMarkerTap && $setup.onMarkerTap(...args)),
    j: common_vendor.o((...args) => $setup.onMarkerTap && $setup.onMarkerTap(...args)),
    k: common_vendor.o((...args) => $setup.onMapTap && $setup.onMapTap(...args)),
    l: common_assets._imports_1,
    m: common_vendor.o((...args) => $setup.moveToCurrentLocation && $setup.moveToCurrentLocation(...args)),
    n: $setup.isCreatingMode
  }, $setup.isCreatingMode ? {
    o: common_vendor.o((...args) => $setup.cancelCreating && $setup.cancelCreating(...args))
  } : {}, {
    p: !$setup.isCreatingMode
  }, !$setup.isCreatingMode ? {
    q: common_assets._imports_2,
    r: common_vendor.o((...args) => $setup.startCreating && $setup.startCreating(...args))
  } : {}, {
    s: common_vendor.o([($event) => $setup.newMarker.title = $event.detail.value, (...args) => $setup.onTitleInput && $setup.onTitleInput(...args)]),
    t: $setup.newMarker.title,
    v: $setup.newMarker.description,
    w: common_vendor.o(($event) => $setup.newMarker.description = $event.detail.value),
    x: common_vendor.o((...args) => $setup.cancelCreate && $setup.cancelCreate(...args)),
    y: common_vendor.o((...args) => $setup.confirmCreate && $setup.confirmCreate(...args)),
    z: common_vendor.n(!$setup.newMarker.title && "disabled"),
    A: common_vendor.sr("createPopup", "87cbf5cc-0"),
    B: common_vendor.p({
      type: "bottom"
    }),
    C: $setup.editingMarker.title,
    D: common_vendor.o(($event) => $setup.editingMarker.title = $event.detail.value),
    E: $setup.editingMarker.description,
    F: common_vendor.o(($event) => $setup.editingMarker.description = $event.detail.value),
    G: common_vendor.o((...args) => $setup.deleteMarker && $setup.deleteMarker(...args)),
    H: common_vendor.o((...args) => $setup.cancelEdit && $setup.cancelEdit(...args)),
    I: common_vendor.o((...args) => $setup.confirmEdit && $setup.confirmEdit(...args)),
    J: common_vendor.n(!$setup.editingMarker.title && "disabled"),
    K: common_vendor.sr("editPopup", "87cbf5cc-1"),
    L: common_vendor.p({
      type: "bottom"
    }),
    M: common_vendor.o($setup.confirmDelete),
    N: common_vendor.o($setup.cancelDelete),
    O: common_vendor.p({
      type: "warning",
      title: "删除标记",
      content: "确定要删除这个标记吗？此操作不可撤销。",
      duration: 2e3,
      ["before-close"]: true
    }),
    P: common_vendor.sr("deleteConfirmPopup", "87cbf5cc-2"),
    Q: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
