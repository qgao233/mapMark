<template>
  <view class="popup-content">
    <!-- 标题区域 -->
    <view class="header">
      <view class="title-container">
        <text class="popup-title">{{ title }}</text>
      </view>
      <view class="options-btn" @tap="showPopup">
        <view class="dots">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>
    </view>
    
    <!-- 选项菜单弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-menu">
        <view class="menu-item" @tap="handleView">
          <text class="menu-text">查看</text>
        </view>
        <view class="menu-item" @tap="handleShare">
          <text class="menu-text">分享</text>
        </view>
        <view class="menu-item cancel" @tap="hidePopup">
          <text class="menu-text">取消</text>
        </view>
      </view>
    </uni-popup>
    
    <!-- 可滚动的内容区域 -->
    <scroll-view class="content-scroll" scroll-y :enable-flex="true">
      <view class="content-inner">
        <!-- 标题输�� -->
        <view class="select-container">
          <text class="select-label">标题</text>
          <input
            v-model="markerData.title"
            class="input"
            placeholder="标记标题"
            maxlength="50"
          />
        </view>
        
        <!-- 分类选择 -->
        <view class="select-container">
          <text class="select-label">分类</text>
          <picker 
            :value="categoryIndex" 
            :range="categories" 
            range-key="label"
            @change="onCategoryChange"
            class="picker"
          >
            <view class="picker-value">
              <view class="picker-content">
                <image 
                  v-if="markerData.category" 
                  :src="getCategoryByValue(markerData.category)?.iconPath" 
                  class="picker-icon" 
                  mode="aspectFit"
                />
                <text>{{ markerData.category ? getCategoryLabel(markerData.category) : '请选择分类' }}</text>
              </view>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <!-- 标签选择 -->
        <view class="select-container">
          <text class="select-label">标签</text>
          <view class="tags-container">
            <view 
              v-for="tag in MARKER_TAGS" 
              :key="tag.value"
              :class="['tag-item', markerData.tags.includes(tag.value) && 'tag-selected']"
              @click="toggleTag(tag.value)"
            >
              <image :src="tag.iconPath" class="tag-icon" mode="aspectFit"/>
              <text class="tag-label">{{ tag.label }}</text>
            </view>
          </view>
        </view>
        
        <!-- 详细描述 -->
        <view class="select-container">
          <text class="select-label">详细描述</text>
          <textarea
            v-model="markerData.description"
            class="textarea"
            placeholder="详细描述"
            maxlength="200"
          />
        </view>
        
        <!-- POI 信息 -->
        <view v-if="markerData.poi" class="select-container">
          <text class="select-label">位置信息</text>
          <view class="poi-container">
            <view class="poi-name">
              <text class="label">相对位置名称：</text>
              <view class="name-container">
                <text class="value">{{ markerData.poi.name }}</text>
                <view class="copy-btn" @tap="copyName">
                  <text class="copy-text">复制</text>
                </view>
              </view>
            </view>
            <view class="poi-address">
              <text class="label">相对详细地址：</text>
              <view class="address-container">
                <text class="value">{{ markerData.poi.address }}</text>
                <view class="copy-btn" @tap="copyAddress">
                  <text class="copy-text">复制</text>
                </view>
              </view>
            </view>
            <view class="poi-distance">
              <text class="label">相对距离：</text>
              <text class="value">{{ Math.round(markerData.poi.distance) }}米</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮区域 -->
    <view class="footer">
      <view class="btn-group">
        <text v-if="showDelete" @click="onDelete" class="btn delete-text">删除</text>
        <text @click="onCancel" class="btn cancel-text">取消</text>
        <text 
          @click="onConfirm" 
          :class="['btn', 'confirm-text', (!markerData.title || !markerData.category) && 'disabled']"
        >{{ confirmText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { 
  MARKER_CATEGORIES, 
  MARKER_TAGS,
  getCategoryByValue 
} from '@/utils/constants'
import Tools from '@/utils/Tools'
import store from '@/stores'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      location: null,
      category: '',
      tags: [],
      createTime: 0,
      updateTime: 0
    })
  },
  title: {
    type: String,
    default: '编辑标记'
  },
  confirmText: {
    type: String,
    default: '保存'
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'delete'])

// 内部数据,用于双向绑定
const markerData = ref(Tools.deepClone(props.modelValue))
// 分类选择器相关
const categories = MARKER_CATEGORIES
const categoryIndex = computed(() => {
  return categories.findIndex(c => c.value === markerData.value.category)
})

// 获取分类显示名称
const getCategoryLabel = (value) => {
  const category = getCategoryByValue(value)
  return category ? category.label : '请选择分类'
}

// 分类变更处理
const onCategoryChange = (e) => {
  const index = e.detail.value
  markerData.value.category = categories[index].value
}

// 切换标签
const toggleTag = (tagValue) => {
  const index = markerData.value.tags.indexOf(tagValue)
  if (index === -1) {
    markerData.value.tags.push(tagValue)
  } else {
    markerData.value.tags.splice(index, 1)
  }
}

// 监听外部数据变化
watch(() => props.modelValue, (newVal) => {
  markerData.value = Tools.deepClone(newVal)
}, { deep: true })

// 确认操作
const onConfirm = () => {
  if (!markerData.value.title) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    })
    return
  }
  if (!markerData.value.category) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none'
    })
    return
  }
  emit('update:modelValue', {...markerData.value})
  emit('confirm')
}

// 取消操作
const onCancel = () => {
  emit('cancel')
}

// 删除操作
const onDelete = () => {
  emit('delete')
}

// 复制地址
const copyAddress = () => {
  if (markerData.value?.poi?.address) {
    uni.setClipboardData({
      data: markerData.value.poi.address,
      success: () => {
        uni.showToast({
          title: '地址已复制',
          icon: 'none'
        })
      }
    })
  }
}

// 复制位置名称
const copyName = () => {
  if (markerData.value?.poi?.name) {
    uni.setClipboardData({
      data: markerData.value.poi.name,
      success: () => {
        uni.showToast({
          title: '名称已复制',
          icon: 'none'
        })
      }
    })
  }
}

const popup = ref(null)

const showPopup = () => {
  popup.value.open()
}

const hidePopup = () => {
  popup.value.close()
}

// 处理查看操作
const handleView = () => {
  if (markerData.value?.location) {
    // 更新地图中心点并跳转
    const { latitude, longitude } = markerData.value.location
    store.commit('SET_MAP_CENTER', { latitude, longitude })
    uni.switchTab({
      url: '/pages/index/index'
    })
    hidePopup()
  } else {
    uni.showToast({
      title: '无法获取位置信息',
      icon: 'none'
    })
  }
}

// 处理分享操作（预留）
const handleShare = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
  hidePopup()
}
</script>

<style lang="scss">
.popup-content {
  background-color: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 80vh; // 设置弹窗整体高度

  // #ifdef MP-WEIXIN
  padding: 24px 20px; // 适配底部安全区域
  margin-bottom: -34px; // 不允许动
  // #endif
  
  .header {
    flex-shrink: 0;
    // padding: 24px 20px 0;
    position: relative;
    
    .options-btn {
      position: absolute;
      right: 0;
      top: 0;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .dots {
        display: flex;
        flex-direction: column;
        gap: 3px;
        
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #666;
        }
      }
    }
  }
  
  .content-scroll {
    flex: 1;
    height: 0; // 关键：让 scroll-view 正确计算高度

    .content-inner {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
    }
  }
  
  .footer {
    flex-shrink: 0;
    // padding: 12px 20px 24px;
    border-top: 1px solid #f0f0f0;
    background-color: #ffffff;
  }
  
  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  
    .popup-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
      line-height: 25px;
      padding: 0 12px;
      margin-bottom: 24px;
    }
  
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -12px;
      height: 1px;
      background: #f0f0f0;
      transform: scaleY(0.5);
    }
  }
  
  .input,
  .textarea,
  .poi-container {
    width: 100%;
    border-width: 1px;
    border-color: #e5e5e5;
    border-radius: 8px;
    padding: 12px;
    font-size: 15px;
    background-color: #f8f8f8;
    box-sizing: border-box;
  }
  
  .input {
    height: 44px;
  }
  
  .textarea {
    height: 120px;
  }
  
  .btn-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
    width: 100%;
  
    .btn {
      flex: 1;
      text-align: center;
      padding: 12px;
      margin: 0 6px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
  
      &:first-child {
        margin-left: 0;
      }
  
      &:last-child {
        margin-right: 0;
      }
  
      &.cancel-text {
        color: #666666;
        background-color: #f5f5f5;
      }
  
      &.confirm-text {
        background-color: #007AFF;
        color: #ffffff;
  
        &.disabled {
          background-color: rgba(0, 122, 255, 0.5);
          pointer-events: none;
        }
      }
  
      &.delete-text {
        flex: 0.8;
        background-color: #ff3b30;
        color: #ffffff;
      }
    }
  }
  
  
  /* 新增样式 */
  .select-container {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
  
    .select-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      display: block;
    }

    
  
    .picker {
      background-color: #f8f8f8;
      border-radius: 8px;
      border: 1px solid #e5e5e5;
  
      .picker-value {
        padding: 12px;
        font-size: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
  
        .picker-content {
          display: flex;
          flex-direction: row;
          align-items: center;
  
          .picker-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
        }
  
        .picker-arrow {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .poi-container{
    .poi-name,
    .poi-address,
    .poi-distance {
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
  
      &:last-child {
        margin-bottom: 0;
      }
  
      .label {
        color: #666;
        font-size: 14px;
        margin-right: 4px;
      }
  
      .value {
        color: #333;
        font-size: 14px;
        font-weight: 500;
      }
    }
  
    .poi-address {
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
  
      &:last-child {
        margin-bottom: 0;
      }
  
      .label {
        color: #666;
        font-size: 14px;
        margin-right: 4px;
      }
  
      .address-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
  
        .value {
          flex: 1;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          word-break: break-all;
        }
  
        .copy-btn {
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
          margin-top: -2px;
  
          .copy-text {
            font-size: 12px;
            color: #007AFF;
          }
  
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  
    .poi-name {
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
  
      &:last-child {
        margin-bottom: 0;
      }
  
      .label {
        color: #666;
        font-size: 14px;
        margin-right: 4px;
      }
  
      .name-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
  
        .value {
          flex: 1;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          word-break: break-all;
        }
  
        .copy-btn {
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
          margin-top: -2px;
  
          .copy-text {
            font-size: 12px;
            color: #007AFF;
          }
  
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  .tags-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  
    .tag-item {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      background-color: #f8f8f8;
      border-radius: 16px;
      border: 1px solid #e5e5e5;
  
      &.tag-selected {
        background-color: #E5F1FF;
        border-color: #A8D1FF;
  
        .tag-label {
          color: #007AFF;
        }
      }
  
      .tag-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
  
      .tag-label {
        font-size: 14px;
        color: #333;
      }
    }
  }
  
  /* 修改确认按钮禁用状态 */
  .btn.confirm-text.disabled {
    background-color: rgba(0, 122, 255, 0.5);
    pointer-events: none;
  }

  /* 选项菜单样式 */
  .popup-menu {
    background-color: #ffffff;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    // #ifdef MP-WEIXIN
  margin-bottom: -34px; // 不允许动
  // #endif
    .menu-item {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      
      &:active {
        background-color: #f5f5f5;
      }
      
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: #eee;
        transform: scaleY(0.5);
      }
      
      .menu-text {
        font-size: 16px;
        color: #333;
        
        &.cancel {
          color: #999;
        }
      }
    }
    
    .cancel {
      margin-top: 8px;
      
      .menu-text {
        color: #999;
      }
    }
  }
}
</style> 