<template>
  <div class="login">
    <div class="bg"></div>
    <div class="content">
      <div class="logo"></div>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginRules"
        class="form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title">登录</div>
        <el-form-item prop="account">
          <el-input
            v-model.trim="loginForm.account"
            class="input"
            placeholder="请输入账户"
            auto-complete="on"
            tabindex="1"
            type="text"
            @keyup.enter.native="handleLogin(formRef)"
          />
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            v-model.trim="loginForm.pwd"
            class="input"
            placeholder="请输入密码"
            auto-complete="on"
            type="password"
            @keyup.enter.native="handleLogin(formRef)"
          />
        </el-form-item>
        <el-button
          class="loginbtn"
          :loading="loading"
          type="primary"
          style="width: 100%"
          @click="handleLogin(formRef)"
        >
          登录
        </el-button>
      </el-form>
    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn/" target="_blank" class="text-color">
        <span>ICP证:</span>
        <span>皖ICP备2024034561号</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { setToken } from "@/utils/auth"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
const formRef = ref<FormInstance>()
const router = useRouter()
const loginForm = ref({
  account: "",
  pwd: ""
})
const loading = ref(false)
const loginRules = ref<FormRules>({
  account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
})
const userlist = [
  { account: "adminUser3364", pwd: "password" },
  { account: "wudeyuan", pwd: "wudeyuan" }
]
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { account, pwd } = loginForm.value
      const find = userlist.find(
        (item) => item.account === account && item.pwd === pwd
      )
      if (find) {
        setToken("登录成功")
        router.push({
          name: "home"
        })
        return
      }
      ElMessage.error("用户名或者密码错误")
    }
  })
}
</script>
<style scoped>
:deep(.el-input__wrapper) {
  padding: 1px;
}
:deep(.el-input__inner) {
  height: 47px;
  padding: 0 10px;
  font-size: 18px;
  font-weight: bold;
}
:deep(.el-form-item__content) {
  margin-bottom: 6px;
}
:deep(.el-form-item__error) {
  padding-top: 5px;
}
:deep(.el-input__inner::-webkit-input-placeholder) {
  font-size: 12px;
  font-weight: normal;
}
:deep(.el-input__inner:-moz-placeholder) {
  font-size: 12px;
  font-weight: normal;
}
:deep(.el-input__inner:-ms-input-placeholder) {
  font-size: 12px;
  font-weight: normal;
}
</style>
<style scoped lang="less">
.login {
  width: 100%;
  background: #f3f5f6;
  height: 100vh;
  .bg {
    height: 56vh;
    background: #000 url(../../assets/bj.png) no-repeat 50%;
    background-size: cover;
  }
  .content {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .logo {
    margin: 0 auto;
    width: 230px;
    height: 60px;
    margin-bottom: 80px;
    // background: url(../../assets/common/logo.png) center no-repeat;
    background-size: cover;
  }
  .title {
    text-align: center;
    padding-bottom: 30px;
    font-size: 24px;
  }
  .form {
    width: 500px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    border-radius: 10px;
    border: 2px solid #fff;
    padding: 30px 70px;
  }
  .loginbtn {
    height: 47px;
    font-size: 18px;
  }
}
.footer {
  width: 100%;
  position: fixed;
  bottom: 5px;
  left: 0;
  text-align: center;
  font-size: 12px;
  .text-color {
    color: #bbb;
    &:hover {
      color: #222;
    }
  }
}
</style>
