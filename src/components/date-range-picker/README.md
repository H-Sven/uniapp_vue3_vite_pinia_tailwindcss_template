#时间范围选择器
#### 参数文档

| 参数 | 说明 | 类型 | 默认值 | 其他 |
| :---- | :---- | :---- | :---- | :---- |
| show | 显示选择器 | Boolean | false | - |
| defaultDate | 默认日期 | String | - | 不传则默认今天 |
| minYear | 最小年份 | Number | 1990 | - |
| themeColor | 主题色 | String | #43b983 | - |
| startText | 开始时间文字 | String | 开始时间 | - |
| endText | 结束时间文字 | String | 结束时间 | - |

#### case
```vue
<template>
	<view style="padding: 30rpx;">
		<view style="margin-top: 30rpx" @click="show=true">
			显示日期选择器
		</view>
		<view style="margin-top: 30rpx">
			所选日期 {{ date.join(',') }}
		</view>
		<dateRangePicker
			:show="show"
			:minYear="2022"
			@close="show=false"
			@confirm="confirm"
		>
		</dateRangePicker>
	</view>
</template>

<script>
	import dateRangePicker from '@/components/date-range-picker/date-range-picker.vue'
	export default {
		components: {dateRangePicker},
		data() {
			return {
				show: false,
				date: []
			}
		},
		methods: {
			confirm(v) {
				console.log(v);
				this.date = v
			}
		}
	}
</script>

```
