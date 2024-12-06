<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useStore } from 'vuex'

const store = useStore()

onLaunch(() => {
	console.log('App Launch')
	// 初始化标记点数据
	store.dispatch('initializeMarkers')
})
</script>

<style>
	/*每个页面公共css */
</style>
