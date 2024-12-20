/**
 * 全局常量配置文件
 */

// 标记点类型配置
export const MARKER_CATEGORIES = [
  {
    label: '景点',
    value: 'scenic',
    iconPath: '/static/images/markers/scenic.png'
  },
  {
    label: '美食',
    value: 'food',
    iconPath: '/static/images/markers/food.png'
  },
  {
    label: '购物',
    value: 'shopping',
    iconPath: '/static/images/markers/shopping.png'
  },
  {
    label: '住宿',
    value: 'hotel',
    iconPath: '/static/images/markers/hotel.png'
  },
  {
    label: '交通',
    value: 'transport',
    iconPath: '/static/images/markers/transport.png'
  },
  {
    label: '娱乐',
    value: 'entertainment',
    iconPath: '/static/images/markers/entertainment.png'
  },
  {
    label: '其他',
    value: 'marker',
    iconPath: '/static/images/markers/marker.png'
  }
]

// 标记点标签配置
export const MARKER_TAGS = [
  {
    label: '必去',
    value: 'must-visit',
    iconPath: '/static/images/tags/must-visit.png'
  },
  {
    label: '推荐',
    value: 'recommended',
    iconPath: '/static/images/tags/recommended.png'
  },
  {
    label: '小众',
    value: 'niche',
    iconPath: '/static/images/tags/niche.png'
  },
  {
    label: '打卡',
    value: 'check-in',
    iconPath: '/static/images/tags/check-in.png'
  },
  {
    label: '拍照',
    value: 'photo',
    iconPath: '/static/images/tags/photo.png'
  },
  {
    label: '亲子',
    value: 'family',
    iconPath: '/static/images/tags/family.png'
  },
  {
    label: '情侣',
    value: 'couple',
    iconPath: '/static/images/tags/couple.png'
  },
  {
    label: '免费',
    value: 'free',
    iconPath: '/static/images/tags/free.png'
  },
  {
    label: '性价比',
    value: 'value',
    iconPath: '/static/images/tags/value.png'
  },
  {
    label: '网红',
    value: 'popular',
    iconPath: '/static/images/tags/popular.png'
  }
]

// 根据值获取类型配置
export const getCategoryByValue = (value) => {
  return MARKER_CATEGORIES.find(category => category.value === value)
}

// 根据值获取标签配置
export const getTagByValue = (value) => {
  return MARKER_TAGS.find(tag => tag.value === value)
}

// 获取所有类型的值数组
export const getCategoryValues = () => {
  return MARKER_CATEGORIES.map(category => category.value)
}

// 获取所有标签的值数组
export const getTagValues = () => {
  return MARKER_TAGS.map(tag => tag.value)
}

/**
 * 验证类型值是��有效
 * @param {string} value 类型值
 * @returns {boolean} 是否有效
 */
export const isValidCategory = (value) => {
  return MARKER_CATEGORIES.some(category => category.value === value)
}

/**
 * 验证标签值是否有效
 * @param {string} value 标签值
 * @returns {boolean} 是否有效
 */
export const isValidTag = (value) => {
  return MARKER_TAGS.some(tag => tag.value === value)
}

/**
 * 验证标签数组是否有效
 * @param {string[]} tags 标签值数组
 * @returns {boolean} 是否全部有效
 */
export const areValidTags = (tags) => {
  return Array.isArray(tags) && tags.every(isValidTag)
}

export default {
  MARKER_CATEGORIES,
  MARKER_TAGS,
  getCategoryByValue,
  getTagByValue,
  getCategoryValues,
  getTagValues,
  isValidCategory,
  isValidTag,
  areValidTags
} 