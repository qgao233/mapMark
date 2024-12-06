### markers

标记点用于在地图上显示标记的位置

| 属性 | 说明 | 类型 | 必填 | 备注 | 平台差异说明 |
| --- | --- | --- | --- | --- | --- |
| id | 标记点id | Number | 是 | marker点击事件回调会返回此id。建议为每个marker设置上Number类型id，保证更新marker时有更好的性能。最大限制9位数 |  |
| latitude | 纬度 | Number | 是 | 浮点数，范围 -90 ~ 90 |  |
| longitude | 经度 | Number | 是 | 浮点数，范围 -180 ~ 180 |  |
| title | 标注点名 | String | 否 | 点击时显示，callout存在时将被忽略 | App-nvue 2.1.5+、微信小程序、H5、支付宝小程序、百度小程序、京东小程序 |
| iconPath | 显示的图标 | String | 是 | 项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径 |  |
| rotate | 旋转角度 | Number | 否 | 顺时针旋转的角度，范围 0 ~ 360，默认为 0 | App-nvue 2.1.5+、微信小程序、支付宝小程序、百度小程序、京东小程序 |
| alpha | 标注的透明度 | Number | 否 | 默认1，无透明，范围 0 ~ 1 | App-nvue 2.1.5+、微信小程序、支付宝小程序、百度小程序、京东小程序 |
| width | 标注图标宽度 | Number | 否 | 默认为图片实际宽度 | App-nvue 2.1.5+、微信小程序、H5、支付宝小程序、百度小程序、京东小程序 |
| height | 标注图标高度 | Number | 否 | 默认为图片实际高度 | App-nvue 2.1.5+、微信小程序、H5、支付宝小程序、百度小程序、京东小程序 |
| callout | 自定义标记点上方的气泡窗口 | Object | 否 | 支持的属性见下表，可识别换行符。 | App-nvue 2.1.5+、H5、微信小程序、支付宝小程序、百度小程序、京东小程序 |
| label | 为标记点旁边增加标签 | Object | 否 | 支持的属性见下表，可识别换行符。 | App-nvue 2.1.5+、微信小程序、H5、App、百度小程序、支付宝小程序 |
| anchor | 经纬度在标注图标的锚点，默认底边中点 | Object | 否 | {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点 | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| clusterId | 自定义点聚合簇效果时使用 | Number | 否 |  | App-nvue 3.1.0+、微信小程序 |
| customCallout | 自定义气泡窗口 | Object | 否 |  | App-nvue 2.1.5+、微信小程序、支付宝小程序 |
| aria-label | 无障碍访问，（属性）元素的额外描述 | String | 否 |  | App-nvue 3.1.0+、微信小程序 |
| joinCluster | 是否参与点聚合 | Boolean | 否 | 如果指定点聚合 此选项值必须设置为true,才会生效 | App-nvue 3.1.0+、微信小程序 |

**marker 上的气泡 callout**

| 属性 | 说明 | 类型 | 平台差异说明 |
| --- | --- | --- | --- |
| content | 文本 | String | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序、支付宝小程序 |
| color | 文本颜色 | String | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| fontSize | 文字大小 | Number | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| borderRadius | callout边框圆角 | Number | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| borderWidth | 边框宽度 | Number | 微信小程序、京东小程序、百度小程序 |
| borderColor | 边框颜色 | String | 微信小程序、京东小程序、百度小程序 |
| bgColor | 背景色 | String | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| padding | 文本边缘留白 | Number | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| display | 'BYCLICK':点击显示; 'ALWAYS':常显 | String | App-nvue 2.1.5+、微信小程序、H5、百度小程序、京东小程序 |
| textAlign | 文本对齐方式。有效值: left, right, center | String | App-nvue 2.1.5+、微信小程序、百度小程序、京东小程序 |
| anchorX | 横向偏移量，向右为正数 | Number | 微信小程序2.11.0 |
| anchorY | 纵向偏移量，向下为正数 | Number | 微信小程序2.11.0 |

**marker 上的标签 label**

| 属性 | 说明 | 类型 | 平台差异说明 |
| --- | --- | --- | --- |
| content | 文本 | String |  |
| color | 文本颜色 | String | App-nvue 2.1.5+、微信小程序、H5、百度小程序、支付宝小程序 |
| fontSize | 文字大小 | Number | App-nvue 2.1.5+、微信小程序、H5、百度小程序、支付宝小程序 |
| x | label的坐标，原点是 marker 对应的经纬度 | Number | H5、百度小程序 |
| y | label的坐标，原点是 marker 对应的经纬度 | Number | H5、百度小程序 |
| anchorX | label的坐标，原点是 marker 对应的经纬度 | Number | App-nvue 2.1.5+、微信小程序 |
| anchorY | label的坐标，原点是 marker 对应的经纬度 | Number | App-nvue 2.1.5+、微信小程序 |
| borderWidth | 边框宽度 | Number | H5、微信小程序、百度小程序 |
| borderColor | 边框颜色 | String | H5、微信小程序、百度小程序 |
| borderRadius | 边框圆角 | Number | App-nvue 2.1.5+、H5、微信小程序、百度小程序、支付宝小程序 |
| bgColor | 背景色 | String | App-nvue 2.1.5+、H5、微信小程序、百度小程序、支付宝小程序 |
| padding | 文本边缘留白 | Number | App-nvue 2.1.5+、H5、微信小程序、百度小程序、支付宝小程序 |
| textAlign | 文本对齐方式。有效值: left, right, center | String | App-nvue 2.1.5+、微信小程序、百度小程序 |
| aria-label | 无障碍访问，（属性）元素的额外描述 | String | App-nvue 3.1.0+、微信小程序 |