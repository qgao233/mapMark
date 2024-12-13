<template>
  <view class="popup-content">
    <view class="title-container">
      <text class="popup-title">{{ title }}</text>
    </view>
    <input
      v-model="markerData.title"
      class="input"
      placeholder="标记标题1"
      maxlength="50"
    />
    <textarea
      v-model="markerData.description"
      class="textarea"
      placeholder="详细描述"
      maxlength="200"
    />
    <view class="btn-group">
      <text v-if="showDelete" @click="onDelete" class="btn delete-text">删除</text>
      <text @click="onCancel" class="btn cancel-text">取消</text>
      <text 
        @click="onConfirm" 
        :class="['btn', 'confirm-text', !markerData.title && 'disabled']"
      >{{ confirmText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      location: null,
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
const markerData = ref({...props.modelValue})

// 监听外部数据变化
watch(() => props.modelValue, (newVal) => {
  markerData.value = {...newVal}
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
</script>

<style lang="scss">
// 添加全局样式来调整弹窗层级
:deep(.uni-popup.uni-popup-dialog) {
  z-index: 999 !important; // 确保删除确认弹窗在最上层
}

.popup-content {
  background-color: #ffffff;
  padding: 24px 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  // #ifdef MP-WEIXIN
  margin-bottom: -34px;//不许动
  // #endif

  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 24px;
    position: relative;

    .popup-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
      line-height: 25px;
      padding: 0 12px;
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
  .textarea {
    width: 100%;
    border-width: 1px;
    border-color: #e5e5e5;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
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
        }
      }

      &.delete-text {
        flex: 0.8;
        background-color: #ff3b30;
        color: #ffffff;
      }
    }
  }
}
</style> 