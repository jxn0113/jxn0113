<template>
  <div class="login">
    <!-- <svg-icon icon-class="arrow"></svg-icon> -->
    <el-form ref="form" :model="form" label-width="80px" :rules="loginRules">
      <el-form-item label="用户名称" prop="name">
        <el-input
          name="username"
          type="text"
          v-model="form.name"
          autoComplete="on"
          placeholder="请输入用户名"
        >
          <span slot="prefix">
            <svg-icon icon-class="user"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="form.password"
          autoComplete="on"
          placeholder="请输入密码"
        >
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <!-- <pdfAll :file-id="fileId"></pdfAll> -->
    <button @click="open">pdf</button>
  </div>
</template>
<script>
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length < 3) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "right",
      form: {
        name: "",
        password: "",
        filedID: "1",
      },
      pwdType: "password",
      loginRules: {
        name: [{ trigger: "blur", validator: validateUsername }],
        password: [{ trigger: "blur", validator: validatePass }],
      },
    };
  },
  mounted() {
    this.$axios.post("/admin/login", {
      username: "111",
      password: "11111",
    });
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid, err) => {
        if (valid) {
            localStorage.setItem("userName",'jxn')
            this.$router.push({ path: "/" });
        //   this.$store
        //     .dispatch("Login", this.loginForm)
        //     .then(() => {
        //       this.loading = false;
        //       setCookie("username", this.loginForm.username, 15);
        //       setCookie("password", this.loginForm.password, 15);
        //       this.$router.push({ path: "/" });
        //     })
        //     .catch(() => {
        //       this.loading = false;
        //     });
        } else {
          console.log("参数验证不合法！",err);
          return false;
        }
      });
    },
    open() {
      window.open(
        "https://dev-srm-supplier-relationship-management.oss-cn-shenzhen.aliyuncs.com/dev/2022-06-09_2.pdf"
      );
    },
    handleLogin() {},
  },
};
</script>

<style scoped>
.login {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 200px auto;
}
</style>