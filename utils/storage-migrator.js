/**
 * 存储数据迁移工具类
 * 用于处理本地存储数据的版本升级
 */
class StorageMigrator {
  // 当前最新的数据结构版本号
  static LATEST_VERSION = 2

  /**
   * 执行数据迁移
   * @returns {Promise<Object>} 迁移后的数据
   */
  static async migrate() {
    try {
      // 获取当前存储的数据和版本
      const storage = await uni.getStorage({ key: 'markers' }).catch(() => ({ data: null }))
      let currentData = storage.data

      // 如果没有数据，返回初始数据结构
      if (!currentData) {
        return this._getInitialData()
      }

      // 获取当前数据版本
      const currentVersion = currentData.version || 1
    //   const currentVersion = 1

      // 如果已经是最新版本，直接返回
      if (currentVersion >= this.LATEST_VERSION) {
        return currentData
      }

      // 按版本号顺序执行迁移
      let migratedData = currentData

      for (let v = currentVersion; v < this.LATEST_VERSION; v++) {
        migratedData = await this[`_migrateToV${v + 1}`](migratedData)
        console.log(`数据已迁移到版本 ${v + 1}`)
      }

      // 保存迁移后的数据
      await uni.setStorage({
        key: 'markers',
        data: migratedData
      })

      return migratedData
    } catch (error) {
      console.error('数据迁移失败:', error)
      throw error
    }
  }

  /**
   * 获取初始数据结构
   * @returns {Object} 初始数据
   */
  static _getInitialData() {
    return {
      version: this.LATEST_VERSION,
      items: [
        {
          id: 1,
          title: '天安门',
          description: '中华人民共和国的象征，世界上最大的城市广场',
          location: {
            latitude: 39.908823,
            longitude: 116.397470
          },
          tags: [],
          createTime: Date.now() - 86400000,
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
          tags: [],
          createTime: Date.now(),
          updateTime: Date.now()
        }
      ]
    }
  }

  /**
   * 迁移到版本2
   * @param {Object} oldData 旧数据
   * @returns {Object} 新数据
   */
  static async _migrateToV2(oldData) {
    const newData = {
      version: 2,
      items: oldData.map(item => ({
        ...item,
        category: item.category || 'marker',
        tags: item.tags || [],
        poi: item.poi || {
            name: item.title,
            address: item.description,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            distance: 0
        },
      }))
    }
    return newData
  }

  // 后续版本迁移方法示例
  // static async _migrateToV3(oldData) {
  //   const newData = {
  //     version: 3,
  //     items: oldData.items.map(item => ({
  //       ...item,
  //       // 新增或修改的字段
  //     }))
  //   }
  //   return newData
  // }
}

export default StorageMigrator 