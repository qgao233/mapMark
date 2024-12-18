import { createStore } from 'vuex'

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
        const storage = await uni.getStorage({ key: 'markers' })
        let markers = storage.data || []
        
        // 如果没有标记点，添加两个初始标记点
        if (markers.length === 0) {
          markers = [
            {
              id: 1,
              title: '天安门',
              description: '中华人民共和国的象征，世界上最大的城市广场',
              location: {
                latitude: 39.908823,
                longitude: 116.397470
              },
              createTime: Date.now() - 86400000, // 24小时前
              updateTime: Date.now() - 86400000
            },
            {
              id: 2,
              title: '故宫博物院',
              description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最完整的木质结构古建筑之一',
              location: {
                latitude: 39.916345,
                longitude: 116.397026
              },
              createTime: Date.now(),
              updateTime: Date.now()
            }
          ]
          
          // 保存到本地存储
          await uni.setStorage({
            key: 'markers',
            data: markers
          })
        }
        
        // 设置最大 ID
        if (markers.length > 0) {
          const maxId = Math.max(...markers.map(m => parseInt(m.id)))
          commit('SET_LAST_ID', maxId)
        }
        
        commit('SET_MARKERS', markers)
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
        await syncToStorage(state.markers.items)
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
        await uni.setStorageSync('markers', markers)
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
        await uni.setStorageSync('markers', markers)
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

// 辅助函数：同步到本地存储
async function syncToStorage(markers) {
  try {
    await uni.setStorage({
      key: 'markers',
      data: markers
    })
  } catch (error) {
    console.error('同步到存储失败:', error)
    throw error
  }
} 