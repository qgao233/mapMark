import { createStore } from 'vuex'
import StorageMigrator from '@/utils/storage-migrator'

export default createStore({
  state: {
    markers: {
      items: [],
      loading: false,
      error: null,
      lastId: 0
    },
    map: {
      center: {
        latitude: 39.909,
        longitude: 116.397
      },
      zoom: 15,
      selectedMarkerId: null
    },
    ui: {
      isCreatingMarker: false,
      isEditingMarker: false,
      searchKeyword: '',
      filterTags: [],
      sortBy: 'createTime',
      sortOrder: 'desc'
    }
  },
  
  mutations: {
    SET_MARKERS(state, markers) {
      state.markers.items = markers
      if (markers.length > 0) {
        const maxId = Math.max(...markers.map(m => parseInt(m.id)))
        state.markers.lastId = maxId
      } else {
        state.markers.lastId = 0
      }
    },
    ADD_MARKER(state, marker) {
      state.markers.items.push(marker)
    },
    SET_MAP_CENTER(state, location) {
      state.map.center = location
    },
    SET_MAP_ZOOM(state, zoom) {
      state.map.zoom = zoom
    },
    SET_SELECTED_MARKER(state, markerId) {
      state.map.selectedMarkerId = markerId
    },
    SET_UI_STATE(state, { key, value }) {
      state.ui[key] = value
    },
    UPDATE_MARKER(state, updatedMarker) {
      const index = state.markers.items.findIndex(m => m.id === updatedMarker.id)
      if (index !== -1) {
        state.markers.items.splice(index, 1, updatedMarker)
      }
    },
    DELETE_MARKER(state, markerId) {
      state.markers.items = state.markers.items.filter(m => m.id !== markerId)
    },
    SET_LAST_ID(state, id) {
      state.markers.lastId = id
    }
  },
  
  actions: {
    async initializeMarkers({ commit }) {
      try {
        // 执行数据迁移
        const migratedData = await StorageMigrator.migrate()
        
        // 设置最大 ID
        if (migratedData.items.length > 0) {
          const maxId = Math.max(...migratedData.items.map(m => parseInt(m.id)))
          commit('SET_LAST_ID', maxId)
        }
        
        commit('SET_MARKERS', migratedData.items)
      } catch (error) {
        console.error('初始化标记失败:', error)
        commit('SET_MARKERS', [])
        commit('SET_LAST_ID', 0)
      }
    },
    
    async createMarker({ commit, state }, markerData) {
      try {
        const newId = Math.min(state.markers.lastId + 1, 9000000000)
        
        const marker = {
          id: newId,
          ...markerData
        }
        
        commit('ADD_MARKER', marker)
        commit('SET_LAST_ID', newId)
        
        // 保存时包含版本号
        await syncToStorage(state.markers)
        
        return marker
      } catch (error) {
        console.error('创建标记失败:', error)
        throw error
      }
    },
    
    async updateMarker({ commit, state }, updatedMarker) {
      try {
        const markers = state.markers.items.map(marker => 
          marker.id === updatedMarker.id ? updatedMarker : marker
        )
        commit('SET_MARKERS', markers)
        // 保存到本地存储
        // 保存时包含版本号
        await syncToStorage(state.markers)
        return true
      } catch (error) {
        console.error('更新标记失败:', error)
        throw error
      }
    },
    
    async deleteMarker({ commit, state }, markerId) {
      try {
        const markers = state.markers.items.filter(marker => marker.id !== markerId)
        commit('SET_MARKERS', markers)
        // 保存到本地存储
        // 保存时包含版本号
        await syncToStorage(state.markers)
        return true
      } catch (error) {
        console.error('删除标记失败:', error)
        throw error
      }
    }
  },
  
  getters: {
    selectedMarker: (state) => {
      return state.markers.items.find(marker => marker.id === state.map.selectedMarkerId)
    },
    isTitleExists: (state) => (title, excludeId = null) => {
      return state.markers.items.some(marker => 
        marker.title === title && marker.id !== excludeId
      )
    }
  }
})

// 修改同步到存储的辅助函数
async function syncToStorage(data) {
  try {
    await uni.setStorage({
      key: 'markers',
      data: {
        version: StorageMigrator.LATEST_VERSION,
        items: data.items
      }
    })
  } catch (error) {
    console.error('同步到存储失败:', error)
    throw error
  }
} 