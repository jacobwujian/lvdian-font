<template>
  <div class="login-wrap">
    <div class="login-header flex-box">
      <div class="logo flex-box">
        <canvas
          id="canvas"
          class="logo-img"
        />
        <span class="name">{{ title }}</span>
      </div>

      <div class="menus">
        <router-link
          v-for="(item, index) in menus"
          :key="`menu-${index}`"
          class="item"
          :to="item.path"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
    <div class="box">
      <p class="title">
        用户登录
        <span class="sub-titlt">user login</span>
      </p>
      <a-form-model
        :model="formInline"
        class="login-form"
      >
        <a-form-model-item>
          <a-input
            v-model.trim="formInline.username"
            placeholder="请输入用户名"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color:rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input-password
            v-model="formInline.password"
            placeholder="请输入密码"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color:rgba(0,0,0,.25)"
            />
          </a-input-password>
        </a-form-model-item>
        <div class="captcha">
          <a-form-model-item class="code-form-item">
            <a-input
              v-model.trim="formInline.random_code"
              placeholder="请输入验证码"
            >
              <a-icon
                slot="prefix"
                type="edit"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-model-item>
          <!-- <img
            :src="img"
            alt=""
            @click="getcode"
          > -->
          <div id="v_container" />
        </div>
        <div class="forget text-right">
          <div
            class="cur-pointer"
            @click="openForm('Pwdmodel')"
          >
            忘记密码
          </div>
        </div>

        <a-form-model-item class="btns">
          <a-button
            block
            type="primary"
            html-type="submit"
            :disabled="disBut || formInline.user === '' || formInline.password === '' || formInline.random_code === ''"
            @click="handleSubmit"
          >
            登录
          </a-button>
        </a-form-model-item>

        <div class="regist text-right">
          还没账户？
          <span
            class="cur-pointer"
            @click="openForm('ZModal')"
          >用户注册</span>
        </div>
      </a-form-model>
    </div>

    <!-- <div class="login-footer text-center">
      copyright © 2003-2020 国家电网浙江有限公司
    </div> -->
    <a-modal
      v-model="show"
      :title="openItem.title"
      :width="openItem.width"
      :footer="null"
      :destroy-on-close="true"
      :mask-closable="false"
    >
      <component
        :is="openItem.type"
        @close="show = false"
      />
    </a-modal>
  </div>
</template>

<script>
import ZModal from './components/modal'
import Pwdmodel from './components/pwdmodel'
import {accessToken} from '@/utils/constant'
import {GVerify} from '@/utils/GVerify'
import { mapMutations } from 'vuex'
import Base64JS from 'base-64'
import IMG from '../../static/home/logo_01.png'
export default {
  name: 'Login',
  components: {
    ZModal,
    Pwdmodel
  },
  data() {
    return {
      show: false,
      img: '',
      modalList: [
        {
          type: 'ZModal',
          title: '机构注册',
          width: 1100
        },
        {
          type: 'Pwdmodel',
          title: '忘记密码',
          width: 500
        }
      ],
      openType: 'ZModal',
      visible: false,
      pwdModel: false,
      formInline: {
        username: '',
        password: '',
        random_code: ''
      },
      disBut: false,
      time: 0,
      tokenId: '',
      verifyCode: null
    }
  },
  computed: {
    platform() {
      // manage 管理中心 trade 交易中心
      return this.$route.path.indexOf(this.$cPath) === 0 ? '管理中心' : '交易中心'
    },
    title() {
      return `浙江省绿色电力积分${this.platform}`
    },
    menus() {
      return [
       {
          name: this.platform === '管理中心' ? '交易中心' : '管理中心',
          path: this.platform === '管理中心' ? '/login' : `${this.$cPath}/login`
        }
      ]
    },
    openItem() {
      return this.modalList.find(it => it.type == this.openType)
    }
  },
  // created() {
  //   this.getcode()
  // },
  mounted() {
    this.verifyCode = new GVerify('v_container')
    var image = new Image()
    image.src = IMG

    var canvas = document.getElementById('canvas')
    canvas.width = 316
    canvas.height = 240
    var ctx = canvas.getContext('2d')
    image.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      for (var a = 0; a < 120; a++){
        for (var b=0; b<120; b++){
          var arr = ctx.getImageData(a, b, 1, 1)
          if (arr.data[0]>240&&arr.data[1]>240&&arr.data[2]>240){
            arr.data[3] = 0
          }
          ctx.putImageData(arr, a, b)
        }
      }
    }
  },
  methods: {
    ...mapMutations('user', ['SET_USER_INFO']),
    getcode() {
      this.$api.common.getValidCode({}).then(res => {
        if(res){
          this.img = 'data:image/jpeg;base64,' + res.img
          this.tokenId = res.tokenId
        }
      })
    },
    handleSubmit(e) {
      const code = this.verifyCode.validate(this.formInline.random_code)
      if(!code) return this.$message.error('验证码错误')
      this.SET_USER_INFO(null)
      const redirect = this.$route.query.redirect
      this.formInline.password = Base64JS.encode(this.formInline.password.toString())
      this.$api.login.login({...this.formInline, tokenId: this.tokenId}).then(res => {
        if(res.Authorization){
          this.$ls.set(accessToken, res.Authorization)
          if(redirect){
            window.location.href = redirect
          }else{
            if(this.$route.path.indexOf(this.$cPath) == 0){
              this.$router.push(this.$cPath)
            }else{
              this.$router.push('/home')
            }
          }
        }
      })
      .catch(() => {
        this.verifyCode.refresh()
      })
    },
    openForm(type, data) {
      this.openType = type
      this.show = true
    }
  }
}
</script>

<style scoped lang='less'>
.login-wrap {
  width: 100vw;
  height: 100vh;
  background: url(../../static/home/login.jpg) no-repeat center;
  position: relative;

  .login-header {
    height: 4.63vh;
    padding: 5.56vh 3.13vw 0;
    box-sizing: content-box;
    align-items: center;
    justify-content: space-between;
    .logo {
      align-items: center;
      .logo-img {
        width: 5.94vw;
      }
      .name {
        line-height: 4.63vh;
        margin-left: 1.25vw;
        font-size: 1.88vw;
        color: #006D6B;
      }
    }

    .menus {
      .item {
        display: inline-block;
        line-height: 3.06vh;
        padding-left: 1.56vw;
        margin-left: 1.56vw;
        font-size: 1.25vw;
        color: #fff;
        position: relative;
        + .item {
          &::before {
            content: '';
            position: absolute;
            top: 0.65vh;
            left: -0.1vw;
            width: 0.16vw;
            height: 1.76vh;
            background: #fff;
            border-radius: 3px;
          }
        }
      }
    }
  }
  .box{
    float: right;
    width: 400px;
    padding: 34px 30px 24px;
    margin: 10.37vh 13.54vw 0 0;
    background-color: #fff;
    border-radius: 8px;
    .title{
      height: 44px;
      line-height: 44px;
      margin-bottom: 40px;
      font-size: 26px;
      color: #000;
      .sub-titlt {
        font-size: 20px;
        font-weight: 400;
        color: #8E8E93;
      }
    }
  }
  .login-form {
    /deep/.ant-input {
      height: 44px;
    }

    .forget{
      line-height: 20px;
      margin-bottom: 24px;
      font-weight: 400;
    }

    .captcha{
      display: flex;
      justify-content: space-between;
      .code-form-item {
        width: 206px;
      }
      #v_container{
        width: 118px;
        height: 42px;
        /deep/canvas {
          width: 100%;
          height: 100%;
        }
      }
    }

    .btns {
      /deep/.ant-btn {
        height: 46px;
        font-size: 16px;
      }
      /deep/.ant-btn-primary {
        background-color: #2072BA;
        border-color: #2072BA;
        &[disabled] {
          color: rgba(0, 0, 0, 0.25);
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          text-shadow: none;
          box-shadow: none;
        }
      }
    }

    .regist {
      line-height: 20px;
      margin-top: 24px;
      font-weight: 400;
      color: #8E8E93;
    }

    .cur-pointer {
      margin: 0;
      color: #006D6B;
    }
  }

  .login-footer {
    position: fixed;
    bottom: 2.86vh;
    width: 100%;
    line-height: 20px;
    color: #fff;
  }
}
</style>
