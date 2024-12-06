<template>
  <view class="markers-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <image class="search-icon" src="/static/images/search.png"></image>
        <input 
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索标记点"
          @input="onSearch"
        />
      </view>
    </view>

    <!-- 筛选排序栏 -->
    <view class="filter-bar">
      <view class="left-section">
        <view 
          class="sort-btn"
          @tap="toggleSortOrder"
        >
          {{ sortText }}
          <text class="icon" :class="{ 'icon-reverse': store.state.ui.sortOrder === 'asc' }">▼</text>
        </view>
        <text class="total-count">共 {{ displayMarkers.length }} 个标记</text>
      </view>
      <text class="manage-btn" @tap="toggleManageMode">{{ isManageMode ? '完成' : '管理' }}</text>
    </view>

    <!-- 标记点列表 -->
    <scroll-view 
      scroll-y 
      class="markers-list"
      @scrolltolower="loadMore"
      :enable-flex="true"
    >
      <view 
        v-for="(marker, index) in displayMarkers" 
        :key="marker.id" 
        class="marker-wrapper"
        :data-marker-id="marker.id"
        @touchstart="!isManageMode && touchStart($event)"
        @touchmove="!isManageMode && touchMove($event)"
        @touchend="!isManageMode && touchEnd($event)"
      >
        <view 
          class="marker-item"
          :style="{ transform: `translateX(${marker.offset || 0}px)` }"
          @tap="isManageMode ? toggleSelect(marker) : showMarkerDetail(marker)"
        >
          <!-- 选择框移到内容左侧 -->
          <view class="item-left">
            <view 
              v-if="isManageMode"
              class="checkbox"
              @tap.stop="toggleSelect(marker)"
            >
              <text class="checkbox-inner" :class="{ 'checked': selectedMarkers.includes(marker.id) }">✓</text>
            </view>
            <text class="marker-index">{{ index + 1 }}</text>
          </view>

          <view class="marker-content">
            <view class="marker-title">{{ marker.title }}</view>
            <view class="marker-desc">{{ marker.description }}</view>
            <view class="marker-meta">
              <text class="marker-time">{{ formatTime(marker.createTime) }}</text>
              <view class="marker-tags" v-if="marker.tags?.length">
                <text 
                  v-for="tag in marker.tags" 
                  :key="tag"
                  class="tag"
                >{{ tag }}</text>
              </view>
            </view>
          </view>
        </view>
        <view 
          v-if="!isManageMode"
          class="delete-btn"
          @tap="deleteMarker(marker)"
        >删除</view>
      </view>

      <!-- 空状态 -->
      <view v-if="!displayMarkers.length" class="empty-state">
        <text>暂无标记点</text>
      </view>
    </scroll-view>

    <!-- 批量操作栏 -->
    <view class="batch-action-bar" v-if="isManageMode">
      <view class="select-all" @tap="toggleSelectAll">
        <view class="checkbox">
          <text class="checkbox-inner" :class="{ 'checked': isAllSelected }">✓</text>
        </view>
        <text>全选</text>
      </view>
      <view 
        class="batch-delete"
        :class="{ 'disabled': !selectedMarkers.length }"
        @tap="batchDelete"
      >
        删除<text v-if="selectedMarkers.length">({{ selectedMarkers.length }})</text>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <uni-popup ref="deleteConfirmPopup" type="dialog">
      <uni-popup-dialog
        type="warning"
        :title="isManageMode ? '批量删除' : '删除标记'"
        :content="isManageMode ? `确定要删除选中的 ${selectedMarkers.length} 个标记吗？` : '确定要删除这个标记吗？'"
        :duration="2000"
        :before-close="true"
        @confirm="confirmDelete"
        @close="cancelDelete"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const deleteConfirmPopup = ref(null)
const markerToDelete = ref(null)

// 搜索关键词
const searchKeyword = ref('')

// 排序文本
const sortText = computed(() => {
  return `创建时间 ${store.state.ui.sortOrder === 'desc' ? '新→旧' : '旧→新'}`
})

// 处理后的标记点列表
const displayMarkers = computed(() => {
  let markers = [...store.state.markers.items]
  
  // 搜索过滤
  if (searchKeyword.value) {
    markers = markers.filter(marker => 
      marker.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      marker.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 排序
  markers.sort((a, b) => {
    const order = store.state.ui.sortOrder === 'desc' ? -1 : 1
    return (a.createTime - b.createTime) * order
  })
  
  return markers
})

// 搜索处理
const onSearch = (e) => {
  searchKeyword.value = e.detail.value.trim()
}

// 切换排序顺序
const toggleSortOrder = () => {
  const newOrder = store.state.ui.sortOrder === 'desc' ? 'asc' : 'desc'
  store.commit('SET_UI_STATE', {
    key: 'sortOrder',
    value: newOrder
  })
}

// 显示标记详情
const showMarkerDetail = (marker) => {
  store.commit('SET_SELECTED_MARKER', marker.id)
  uni.navigateTo({
    url: `/pages/marker/detail?id=${marker.id}`
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 加载更多（预留分页功能）
const loadMore = () => {
  // TODO: 实现分页加载
}

// 触摸相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const currentMarkerId = ref(null)
const deleteButtonWidth = 80 // 删除按钮宽度

// 触摸开始
const touchStart = (e) => {
  const touch = e.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  currentMarkerId.value = e.currentTarget.dataset.markerId
}

// 触摸移动
const touchMove = (e) => {
  if (!currentMarkerId.value) return
  
  const touch = e.touches[0]
  const moveX = touch.clientX - touchStartX.value
  const moveY = touch.clientY - touchStartY.value
  
  // 如果垂直滑动距离大于水平滑动距离，则不处理
  if (Math.abs(moveY) > Math.abs(moveX)) return
  
  const marker = displayMarkers.value.find(m => m.id === currentMarkerId.value)
  if (!marker) return
  
  let offset = moveX
  // 限制滑动范围
  if (offset < -deleteButtonWidth) {
    offset = -deleteButtonWidth
  } else if (offset > 0) {
    offset = 0
  }
  
  // 更新偏移量
  marker.offset = offset
}

// 触摸结束
const touchEnd = (e) => {
  if (!currentMarkerId.value) return
  
  const marker = displayMarkers.value.find(m => m.id === currentMarkerId.value)
  if (!marker) return
  
  // 根据偏移量决定是否显示删除按钮
  if (marker.offset < -deleteButtonWidth / 2) {
    marker.offset = -deleteButtonWidth
  } else {
    marker.offset = 0
  }
  
  currentMarkerId.value = null
}

// 删除标记
const deleteMarker = (marker) => {
  markerToDelete.value = marker
  deleteConfirmPopup.value.open()
}

// 确认删除
const confirmDelete = async () => {
  try {
    if (isManageMode.value) {
      // 批量删除
      for (const id of selectedMarkers.value) {
        await store.dispatch('deleteMarker', id)
      }
      selectedMarkers.value = []
    } else {
      // 单个删除
      await store.dispatch('deleteMarker', markerToDelete.value.id)
    }
    
    deleteConfirmPopup.value.close()
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('删除标记失败:', error)
    uni.showToast({
      title: '删除失败',
      icon: 'error'
    })
  }
}

// 取消删除
const cancelDelete = () => {
  deleteConfirmPopup.value.close()
  markerToDelete.value = null
}

// 添加管理模式相关状态
const isManageMode = ref(false)
const selectedMarkers = ref([])

// 计算是否全选
const isAllSelected = computed(() => {
  return displayMarkers.value.length > 0 && 
         selectedMarkers.value.length === displayMarkers.value.length
})

// 切换管理模式
const toggleManageMode = () => {
  isManageMode.value = !isManageMode.value
  selectedMarkers.value = [] // 退出管理模式时清空选择
}

// 切换选择状态
const toggleSelect = (marker) => {
  const index = selectedMarkers.value.indexOf(marker.id)
  if (index === -1) {
    selectedMarkers.value.push(marker.id)
  } else {
    selectedMarkers.value.splice(index, 1)
  }
}

// 切换全选状态
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedMarkers.value = []
  } else {
    selectedMarkers.value = displayMarkers.value.map(m => m.id)
  }
}

// 批量删除
const batchDelete = () => {
  if (!selectedMarkers.value.length) return
  deleteConfirmPopup.value.open()
}
</script>

<style lang="scss">
.markers-container {
  height: 100vh;
  background: #f8f8f8;
  // padding-bottom: env(safe-area-inset-bottom);
}

.search-bar {
  padding: 44px 100px 12px 16px;//不许动
  background: #fff;

  .search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 8px 12px;

    .search-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    .search-input {
      flex: 1;
      font-size: 14px;
    }
  }
}

.filter-bar {
  display: flex;
  padding: 12px 16px;
  background: #fff;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;

  .left-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .sort-btn {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;

      .icon {
        margin-left: 4px;
        font-size: 12px;
        transition: transform 0.3s;

        &.icon-reverse {
          transform: rotate(180deg);
        }
      }
    }

    .total-count {
      font-size: 13px;
      color: #999;
    }
  }

  .manage-btn {
    color: #007AFF;
    font-size: 14px;
    padding: 6px 12px;
  }
}

.markers-list {
  height: calc(100vh - 110px);
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .marker-wrapper {
    margin-bottom: 12px;
    position: relative;
    // overflow: hidden;
    border-radius: 12px;
    width: 92%;
    max-width: 680px;
    background: #ff3b30;


    .marker-item {
      display: flex;
      background: #fff;
      border-radius: 11px;
      transition: transform 0.2s ease;
      position: relative;
      z-index: 2;

      .item-left {
        display: flex;
        align-items: center;
        padding: 16px 0 16px 16px;

        .checkbox {
          width: 20px;
          height: 20px;
          border: 1.5px solid #ddd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;

          .checkbox-inner {
            color: #fff;
            font-size: 12px;
            opacity: 0;

            &.checked {
              opacity: 1;
              background-color: #007AFF;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        .marker-index {
          font-size: 14px;
          color: #999;
          width: 24px;
          text-align: center;
        }
      }

      .marker-content {
        flex: 1;
        padding: 16px 16px 16px 8px;

        .marker-title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .marker-desc {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .marker-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .marker-time {
            font-size: 12px;
            color: #999;
          }

          .marker-tags {
            display: flex;
            gap: 6px;

            .tag {
              background: #f5f5f5;
              color: #666;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .delete-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 100%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      z-index: 1;

    }
  }
}

.batch-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;

    .checkbox {
      width: 20px;
      height: 20px;
      border: 1.5px solid #ddd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .checkbox-inner {
        color: #fff;
        font-size: 12px;
        opacity: 0;

        &.checked {
          opacity: 1;
          background-color: #007AFF;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .batch-delete {
    background-color: #ff3b30;
    color: #fff;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;

    &.disabled {
      opacity: 0.5;
    }
  }
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style> 