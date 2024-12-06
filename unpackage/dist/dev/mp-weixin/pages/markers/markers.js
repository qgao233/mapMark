"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const deleteButtonWidth = 80;
const _sfc_main = {
  __name: "markers",
  setup(__props) {
    const store = common_vendor.useStore();
    const deleteConfirmPopup = common_vendor.ref(null);
    const markerToDelete = common_vendor.ref(null);
    const searchKeyword = common_vendor.ref("");
    const sortText = common_vendor.computed(() => {
      return `创建时间 ${store.state.ui.sortOrder === "desc" ? "新→旧" : "旧→新"}`;
    });
    const displayMarkers = common_vendor.computed(() => {
      let markers = [...store.state.markers.items];
      if (searchKeyword.value) {
        markers = markers.filter(
          (marker) => marker.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) || marker.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
      }
      markers.sort((a, b) => {
        const order = store.state.ui.sortOrder === "desc" ? -1 : 1;
        return (a.createTime - b.createTime) * order;
      });
      return markers;
    });
    const onSearch = (e) => {
      searchKeyword.value = e.detail.value.trim();
    };
    const toggleSortOrder = () => {
      const newOrder = store.state.ui.sortOrder === "desc" ? "asc" : "desc";
      store.commit("SET_UI_STATE", {
        key: "sortOrder",
        value: newOrder
      });
    };
    const showMarkerDetail = (marker) => {
      store.commit("SET_SELECTED_MARKER", marker.id);
      common_vendor.index.navigateTo({
        url: `/pages/marker/detail?id=${marker.id}`
      });
    };
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };
    const loadMore = () => {
    };
    const touchStartX = common_vendor.ref(0);
    const touchStartY = common_vendor.ref(0);
    const currentMarkerId = common_vendor.ref(null);
    const touchStart = (e) => {
      const touch = e.touches[0];
      touchStartX.value = touch.clientX;
      touchStartY.value = touch.clientY;
      currentMarkerId.value = e.currentTarget.dataset.markerId;
    };
    const touchMove = (e) => {
      if (!currentMarkerId.value)
        return;
      const touch = e.touches[0];
      const moveX = touch.clientX - touchStartX.value;
      const moveY = touch.clientY - touchStartY.value;
      if (Math.abs(moveY) > Math.abs(moveX))
        return;
      const marker = displayMarkers.value.find((m) => m.id === currentMarkerId.value);
      if (!marker)
        return;
      let offset = moveX;
      if (offset < -deleteButtonWidth) {
        offset = -deleteButtonWidth;
      } else if (offset > 0) {
        offset = 0;
      }
      marker.offset = offset;
    };
    const touchEnd = (e) => {
      if (!currentMarkerId.value)
        return;
      const marker = displayMarkers.value.find((m) => m.id === currentMarkerId.value);
      if (!marker)
        return;
      if (marker.offset < -deleteButtonWidth / 2) {
        marker.offset = -deleteButtonWidth;
      } else {
        marker.offset = 0;
      }
      currentMarkerId.value = null;
    };
    const deleteMarker = (marker) => {
      markerToDelete.value = marker;
      deleteConfirmPopup.value.open();
    };
    const confirmDelete = async () => {
      try {
        if (isManageMode.value) {
          for (const id of selectedMarkers.value) {
            await store.dispatch("deleteMarker", id);
          }
          selectedMarkers.value = [];
        } else {
          await store.dispatch("deleteMarker", markerToDelete.value.id);
        }
        deleteConfirmPopup.value.close();
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
      markerToDelete.value = null;
    };
    const isManageMode = common_vendor.ref(false);
    const selectedMarkers = common_vendor.ref([]);
    const isAllSelected = common_vendor.computed(() => {
      return displayMarkers.value.length > 0 && selectedMarkers.value.length === displayMarkers.value.length;
    });
    const toggleManageMode = () => {
      isManageMode.value = !isManageMode.value;
      selectedMarkers.value = [];
    };
    const toggleSelect = (marker) => {
      const index = selectedMarkers.value.indexOf(marker.id);
      if (index === -1) {
        selectedMarkers.value.push(marker.id);
      } else {
        selectedMarkers.value.splice(index, 1);
      }
    };
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedMarkers.value = [];
      } else {
        selectedMarkers.value = displayMarkers.value.map((m) => m.id);
      }
    };
    const batchDelete = () => {
      if (!selectedMarkers.value.length)
        return;
      deleteConfirmPopup.value.open();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, onSearch]),
        c: searchKeyword.value,
        d: common_vendor.t(sortText.value),
        e: common_vendor.unref(store).state.ui.sortOrder === "asc" ? 1 : "",
        f: common_vendor.o(toggleSortOrder),
        g: common_vendor.t(displayMarkers.value.length),
        h: common_vendor.t(isManageMode.value ? "完成" : "管理"),
        i: common_vendor.o(toggleManageMode),
        j: common_vendor.f(displayMarkers.value, (marker, index, i0) => {
          var _a, _b;
          return common_vendor.e(isManageMode.value ? {
            a: selectedMarkers.value.includes(marker.id) ? 1 : "",
            b: common_vendor.o(($event) => toggleSelect(marker), marker.id)
          } : {}, {
            c: common_vendor.t(index + 1),
            d: common_vendor.t(marker.title),
            e: common_vendor.t(marker.description),
            f: common_vendor.t(formatTime(marker.createTime)),
            g: (_a = marker.tags) == null ? void 0 : _a.length
          }, ((_b = marker.tags) == null ? void 0 : _b.length) ? {
            h: common_vendor.f(marker.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            })
          } : {}, {
            i: `translateX(${marker.offset || 0}px)`,
            j: common_vendor.o(($event) => isManageMode.value ? toggleSelect(marker) : showMarkerDetail(marker), marker.id)
          }, !isManageMode.value ? {
            k: common_vendor.o(($event) => deleteMarker(marker), marker.id)
          } : {}, {
            l: marker.id,
            m: marker.id,
            n: common_vendor.o(($event) => !isManageMode.value && touchStart($event), marker.id),
            o: common_vendor.o(($event) => !isManageMode.value && touchMove($event), marker.id),
            p: common_vendor.o(($event) => !isManageMode.value && touchEnd(), marker.id)
          });
        }),
        k: isManageMode.value,
        l: !isManageMode.value,
        m: !displayMarkers.value.length
      }, !displayMarkers.value.length ? {} : {}, {
        n: common_vendor.o(loadMore),
        o: isManageMode.value
      }, isManageMode.value ? common_vendor.e({
        p: isAllSelected.value ? 1 : "",
        q: common_vendor.o(toggleSelectAll),
        r: selectedMarkers.value.length
      }, selectedMarkers.value.length ? {
        s: common_vendor.t(selectedMarkers.value.length)
      } : {}, {
        t: !selectedMarkers.value.length ? 1 : "",
        v: common_vendor.o(batchDelete)
      }) : {}, {
        w: common_vendor.o(confirmDelete),
        x: common_vendor.o(cancelDelete),
        y: common_vendor.p({
          type: "warning",
          title: isManageMode.value ? "批量删除" : "删除标记",
          content: isManageMode.value ? `确定要删除选中的 ${selectedMarkers.value.length} 个标记吗？` : "确定要删除这个标记吗？",
          duration: 2e3,
          ["before-close"]: true
        }),
        z: common_vendor.sr(deleteConfirmPopup, "32ea3d92-0", {
          "k": "deleteConfirmPopup"
        }),
        A: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
