<template>
	<view :class="{'remark':show}" :style="{'--theme-color': themeColor}" @click="close" @touchmove.stop.prevent="returnHandle">
		<view class="picker-box" :class="{show: show}" :style="{bottom: bottom }">
			<view class="operate-box" @touchmove.stop.prevent="returnHandle" @tap.stop="returnHandle">
				<view @click="touchSelect(0)" class="time-item" :style="{color:touchIndex?'#303030':themeColor}">
					<view class="label">{{ startText }}</view>
					<view class="date">{{ resultDate[0] }}</view>
				</view>
				<view>至</view>
				<view @click="touchSelect(1)" class="time-item" :style="{color:touchIndex?themeColor:'#303030'}">
					<view class="label">{{ endText }}</view>
					<view class="date">{{ resultDate[1] }}</view>
				</view>
			</view>
			<picker-view 
				:value="pickerValue" 
				@change="pickerChange" 
				class="picker-view" 
				:immediate-change="true"
				indicator-class="select-line"
				:indicator-style="indicatorStyle"
				mask-style="background: transparent"
				@tap.stop="returnHandle"
			>
				<picker-view-column class="column-left">
					<view class="picker-item" :class="index == pickerValue[0] ? 'picker-select' : ''" v-for="(item, index) in years" :key="index">
						{{ item }}年
					</view>
				</picker-view-column>
				<picker-view-column class="column-center">
					<view class="picker-item" :class="index == pickerValue[1] ? 'picker-select' : ''" v-for="(item, index) in months" :key="index">
						{{ item }}月
					</view>
				</picker-view-column>
				<picker-view-column class="column-right" v-if="days.length > 0">
					<view class="picker-item" :class="index == pickerValue[2] ? 'picker-select' : ''" v-for="(item, index) in days" :key="index">
						{{ item }}日
					</view>
				</picker-view-column>
			</picker-view>
			<view class="button-group">
				<view class="item cancel" @click.stop="close">取消</view>
				<view class="item confirm" @click.stop="pickerConfirm">确认</view>
			</view>
		</view>
	</view>
</template>
<script>
	const date = new Date();
	const years = [];
	const currentYear = date.getFullYear();
	const months = [];
	const currentMonth = date.getMonth() + 1;
	const currentDay = date.getDate();

	export default {
		name: 'dateRangePicker',
		props: {
			bottom: {
				type: String,
				default: '0rpx'
			},
			show: {
				type: Boolean,
				default: false
			},
			defaultDate: {
				type: Array,
				default: () => []
			},
			minYear: {
				type: Number,
				default: 1990,
			},
			themeColor: {
				type: String,
				default: '#43b983'
			},
			startText: {
				type: String,
				default: '开始时间'
			},
			endText: {
				type: String,
				default: '结束时间'
			}
		},
		data() {
			for (let i = this.minYear; i <= currentYear; i++) {
				years.push(i);
			}
			for (let i = 1; i <= 12; i++) {
				months.push(this.padStart(i));
			}
			return {
				indicatorStyle: `height: ${uni.upx2px(84)}px`,
				touchIndex: 0,
				year: currentYear,
				month: currentMonth,
				day: currentDay,
				years,
				months,
				days: [],
				pickerValue: [],
				resultDate: []
			};
		},
		mounted() {
			this.setDate()
		},
		methods: {
			returnHandle() {},
			setDate() {
				if (this.defaultDate.length > 0) {
					const date = this.defaultDate[0]
					this.resultDate = this.defaultDate
					this.setPicker(date)
				} else {
					const month = this.month.toString().padStart(2, 0)
					const day = this.day.toString().padStart(2, 0)
					const nowTime = `${this.year}-${month}-${day}`
					this.resultDate = [nowTime, nowTime]
					this.setPicker(nowTime)
				}
			},
			setPicker(date) {
				const splitVal = date.split('-')
				const year = this.years.indexOf(Number(splitVal[0]))
				const month = Number(splitVal[1]) - 1
				const day = Number(splitVal[2]) - 1
				this.pickerChange({
					detail: {
						value: [year, month, day]
					}
				})
			},
			touchSelect(val) {
				const date = this.resultDate[val]
				this.touchIndex = val
				this.setPicker(date)
			},
			getDateTime(date) {
				const year = this.years[date[0]]
				const month = this.months[Number(date[1])] || this.padStart(currentMonth)
				const day = this.days[Number(date[2])] || this.padStart(currentDay)
				
				this.resultDate[this.touchIndex] = `${year}-${month}-${day}`
			},
			pickerChange(e) {
				const currents = e.detail.value

				// 月份处理，限制到当前月份
				if (this.years[currents[0]] === currentYear) {
					const allmonths = JSON.parse(JSON.stringify(months))
					const m = allmonths.splice(0, currentMonth)
					this.months = m
					if(currents[1] > currentMonth - 1) {
						currents[1] = currentMonth - 1
					}
				} else {
					this.months = months
				}

				// 日期天数处理
				let days = []
				if (currents[1] + 1 === 2) {
					if (
						((currents[0] + this.minYear) % 4 === 0 &&
							(currents[0] + this.minYear) % 100 !== 0) ||
						(currents[0] + this.minYear) % 400 === 0
					) {
						for (let i = 1; i < 30; i++) {
							days.push(this.padStart(i))
						}
					} else {
						for (let i = 1; i < 29; i++) {
							days.push(this.padStart(i))
						}
					}
				} else if ([4, 6, 9, 11].some((item) => currents[1] + 1 === item)) {
					for (let i = 1; i < 31; i++) {
						days.push(this.padStart(i))
					}
				} else if ([1, 3, 5, 7, 8, 10, 12].some((item) => currents[1] + 1 === item)) {
					for (let i = 1; i < 32; i++) {
						days.push(this.padStart(i))
					}
				}
				// 限制到当前日期
				if (this.years[currents[0]] === currentYear && this.months[currents[1]]*1 === currentMonth) {
					days = days.splice(0, currentDay)
					if(currents[2] > currentDay - 1) {
						currents[2] = currentDay - 1
					}
				}
				this.days = days
				this.pickerValue = currents
				this.getDateTime(currents)
			},
			close() {
				this.$emit('close', false)
			},
			pickerConfirm() {
				const { resultDate } = this
				let startTime = new Date(resultDate[0]).getTime()
				let endTime = new Date(resultDate[1]).getTime()
				let nowTime = endTime
				if (startTime <= endTime && endTime <= nowTime) {
					this.$emit('confirm', resultDate)
					this.close()
					return
				}
				if (startTime > endTime) {
					uni.showToast({
						title: '开始时间应小于结束时间',
						icon: 'none',
						duration: 3500
					})
				}
				if (endTime > nowTime) {
					uni.showToast({
						title: '请正确选择时间范围',
						icon: 'none'
					})
				}
				
			},
			padStart(val) {
				return val.toString().padStart(2, 0)
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep.column-left,
	::v-deep.column-center,
	::v-deep.column-right {
		.select-line {
			background: #F9FAFC;
			z-index: -1;
			&::before, &::after {
				border: none ;
			}
		}
	}
	
	::v-deep.column-left .select-line {
		border-radius: 42rpx 0 0 42rpx;
	}
	
	::v-deep.column-right .select-line {
		border-radius: 0 42rpx 42rpx 0;
	}
	
	.remark {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.picker-box {
		position: fixed;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		z-index: 998;
		border-radius: 24rpx 24rpx 0 0;
		overflow: hidden;
		padding-bottom: calc(40rpx + constant(safe-area-inset-bottom)/2) !important;
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom)/2) !important;
		&.show {
			transform: translateY(0);
		}

		.operate-box {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 34rpx 30rpx 20rpx;
			background-color: #FFFFFF;
			text-align: center;
			border-bottom: 2rpx solid #f6f6f6;
			.label {
				font-size: 26rpx;
			}
			.date {
				font-size: 32rpx;
			}
		}
		
		.picker-view {
			width: 100%;
			height: 420rpx;
			background-color: #FFFFFF;

			.picker-item {
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				transition: all 0.2s ease;
				height: 84rpx;
				line-height: 84rpx;
				font-size: 32rpx;
				color: rgba(94, 104, 128, 0.6);
				&.picker-select {
					color: var(--theme-color);
					font-size: 38rpx;
					transition: all 0.2s ease;
				}
			}
		}
		
		.button-group {
			display: flex;
			justify-content: space-around;
			margin-top: 30rpx;
			.item {
				width: 280rpx;
				height: 84rpx;
				text-align: center;
				line-height: 84rpx;
				border-radius: 42rpx;
				&.cancel {
					background: #f8f8f8;
					color: #333;
				}
				&.confirm {
					background: var(--theme-color);
					color: #fff;
				}
			}
		}
	}

</style>