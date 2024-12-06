# 项目设计文档

## 1. 项目概述
本文档用于记录项目的整体设计、架构和重要决策。随着项目的发展，本文档将不断更新以反映最新的设计状态。

### 1.1 核心功能
- 地图标记系统：允许用户在地图上进行位置标记和备注
- 标记点预览：在地图上显示标记点和简要信息
- 标记点管理：提供标记点的列表视图和详细信息管理

## 2. 目录结构
```
root/
├── readme.md # 项目设计文档
├── pages/ # 页面文件夹
│ ├── index/ # 主页（地图页面）
│ └── markers/ # 标记点列表页面
├── components/ # 组件文件夹
│ ├── map/ # 地图相关组件
│ └── markers/ # 标记点相关组件
├── stores/ # 状态管理
└── utils/ # 工具函数
```


## 3. 技术栈
- UniApp
- Vue3 + TypeScript
- Vuex 状态管理
- 高德地图 SDK
- 微信小程序

### 3.1 微信小程序配置

在uniapp项目中的manifest.json的"mp-weixin"下配置requiredPrivateInfos，注意跟permission平级

## 4. 核心功能模块设计

### 4.1 地图标记功能
#### 4.1.1 用户交互流程
1. 用户点击地图任意位置
2. 弹出标记创建框
3. 用户输入标记信息（标题、描述等）
4. 保存标记信息
5. 地图上显示标记点
6. 点击已有标记点可进行编辑或删除操作

#### 4.1.2 交互设计
- PC端:
  - 点击地图进入"创建模式"
  - 再次点击确定标记位置并打开创建框
  - ESC键退出创建模式
- 移动端:
  - 点击"添加"按钮进入创建模式
  - 点击地图确定标记位置并打开创建框
  - 点击取消按钮退出创建模式

#### 4.1.2 标记点数据结构
```
typescript
interface Marker {
id: string; // 唯一标识
title: string; // 标记标题
description: string; // 详细描述
location: {
latitude: number; // 纬度
longitude: number; // 经度
};
createTime: number; // 创建时间
updateTime: number; // 更新时间
tags?: string[]; // 可选标签
}
```

#### 4.1.3 地图展示功能
- 标记点聚合：当标记点密集时进行聚合显示
- 标记点气泡：点击标记点显示简要信息
- 缩放级别适配：不同缩放级别显示不同大小的标记点

### 4.2 状态管理设计（Vuex）
#### 4.2.1 Store 结构
```typescript
interface RootState {
  markers: {
    items: Marker[];
    loading: boolean;
    error: string | null;
  };
  map: {
    center: Location;
    zoom: number;
    selectedMarkerId: string | null;
  };
  ui: {
    isCreatingMarker: boolean;
    isEditingMarker: boolean;
    searchKeyword: string;
    filterTags: string[];
    sortBy: 'createTime' | 'updateTime';
    sortOrder: 'asc' | 'desc';
  };
}
```

#### 4.2.2 Mutations
- `SET_MARKERS`: 设置标记点列表
- `ADD_MARKER`: 添加新标记点
- `UPDATE_MARKER`: 更新标记点
- `DELETE_MARKER`: 删除标记点
- `SET_MAP_CENTER`: 设置地图中心点
- `SET_MAP_ZOOM`: 设置地图缩放级别
- `SET_SELECTED_MARKER`: 设置选中的标记点
- `SET_UI_STATE`: 设置 UI 状态

#### 4.2.3 Actions
- `initializeMarkers`: 初始化标记点数据
- `createMarker`: 创建新标记点
- `updateMarker`: 更新标记点信息
- `deleteMarker`: 删除标记点
- `syncMarkers`: 同步标记点数据到本地存储
- `searchMarkers`: 搜索标记点
- `filterMarkers`: 筛选标记点
- `sortMarkers`: 排序标记点

#### 4.2.4 Getters
- `sortedMarkers`: 获取排序后的标记点
- `filteredMarkers`: 获取筛选后的标记点
- `searchedMarkers`: 获取搜索后的标记点
- `selectedMarker`: 获取当前选中的标记点
- `markersByLocation`: 按位置分组的标记点

### 4.3 标记点列表功能
- 列表视图：展示所有标记点
- 搜索功能：支持标题搜索
- 筛选功能：按时间、标签筛选
- 排序功能：按创建时间、更新时间排序

## 5. 数据存储设计
### 5.1 本地存储
使用 uni.storage 存储标记点数据

```typescript
interface StorageStructure {
markers: Marker[]; // 标记点数据
lastSyncTime: number; // 最后同步时间
settings: { // 用户设置
defaultMapCenter: Location; // 默认地图中心
defaultZoom: number; // 默认缩放级别
};
}
```

### 5.2 云端存储（后期规划）
- 数据同步机制
- 多设备数据互通
- 离线支持

## 6. 性能优化考虑
- 标记点数据分页加载
- 地图标记点懒加载
- 列表页虚拟滚动

## 7. 错误处理和监控
### 7.1 错误类型
- 地图加载失败
- 定位权限问题
- 数据存储异常
- 网络请求超时

### 7.2 监控指标
- 地图加载时间
- 标记点创建成功率
- 用户交互行为统计

## 8. 后续迭代计划
- [ ] 标记点分享功能
- [ ] 标记点图片附件
- [ ] 协同编辑功能
- [ ] 路线规划功能
- [ ] 离线地图支持

## 9. 变更日志
### 2024-03-21
- 初始化项目设计文档
- 添加地图标记核心功能设计
- 更新状态管理方案为 Vuex

#### 4.1.1 用户交互流程
1. 用户点击地图任意位置
2. 弹出标记创建框
3. 用户输入标记信息（标题、描述等）
4. 保存标记信息
5. 地图上显示标记点
6. 点击已有标记点可进行编辑或删除操作

#### 4.1.2 标记点管理功能
- 编辑功能：
  - 点击已有标记点打开编辑弹窗
  - 可修改标记点的标题和描述
  - 编辑完成后自动更新地图显示
- 删除功能：
  - 在编辑弹窗中提供删除选项
  - 删除操作需二次确认
  - 删除后自动从地图移除
- 交互反馈：
  - 所有操作都有加载状态提示
  - 操作成功/失败都有对应提示
  - 重要操作（如删除）需要确认