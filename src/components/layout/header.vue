<template>
  <div class="header">
    <div class="logo-box">
      <a href="/" @click="goHome">
        <img class="logo-icon" src="@/assets/logo.png" alt="" />
        <span class="logo-text">本地excel导出</span>
      </a>
    </div>
    <div class="menu">
      <div
        v-for="(item, index) in homeRouter"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <div
          v-if="item.meta && !item.meta.hidden"
          class="menu-item"
          :class="{ active: activeTopRouterName === item.meta.name }"
        >
          <span v-if="item.meta && !item.meta.hidden">{{
            item.meta.name
          }}</span>
        </div>
      </div>
    </div>
    <div class="user-info">
			<el-dropdown trigger="click">
				<span class="el-dropdown-link">
					<img class="avatar" src="@/assets/head-portrait.gif" alt="" />
					<span class="user-name">用户</span>
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item><span @click="logout">退出登录</span></el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useRouter,useRoute } from "vue-router"
import { homeRouter } from "@/router"
import { ArrowDown} from "@element-plus/icons-vue"
import { removeToken } from "@/utils/auth"
const router = useRouter()
const route = useRoute()
const activeTopRouterName = computed(() => route.meta?.name)
const clickMenu = (row: any) => {
  if (row.path) {
    router.push(row.path)
  }
}
const goHome = (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  location.href = location.origin + "/"
}
const logout = ()=>{
  removeToken()
  router.replace("/login")
}
</script>
<style scoped lang="less">
.header {
  background: @HeaderBgColor;
  padding-right: 10px;
  display: flex;
  height: 0.5rem;
  height: 56px; //为了兼容内容区的原高度计算逻辑，这里还是固定高度
  align-items: center;
  justify-content: flex-start;
  .logo-box {
    display: flex;
    flex-direction: rows;
    align-items: center;
    justify-content: center;
    width: 200px;
    .logo-icon {
      height: 28px;
      width: 28px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .logo-text {
      vertical-align: sub;
      color: #fff;
      font-weight: 700;
      font-size: 18px;
    }
  }
  .menu {
    flex: 1;
    flex: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    & > div {
      height: 100%;
    }
    .menu-item {
      font-size: 14px;
      font-family: Helvetica;
      font-weight: normal;
      display: inline-block;
      padding: 0 16px;
      height: 100%;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
        background: @ThemeColor;
        color: @HeaderActiveColor;
      }
    }
    .active {
      background: @ThemeColor;
      color: @HeaderActiveColor;
    }
  }
  .user-info {
		cursor: pointer;
		:deep(.el-dropdown) {
			// color: #c6cbd4;
			color: @HeaderFontColor;
			&:hover {
				color: @HeaderActiveColor;
			}
			.user-name {
				display: inline-block;
				line-height: 56px;
			}
			.el-dropdown-link:focus {
				outline: none;
			}
		}
		.avatar {
			width: 33px;
			height: 33px;
			border-radius: 50%;
			margin-right: 10px;
			vertical-align: middle;
		}
	}
}
</style>
