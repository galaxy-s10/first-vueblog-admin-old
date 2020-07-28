<template>
  <div class="app-container">
    <el-form ref="user" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="id" hidden>
        <el-input v-model="user.id" />
      </el-form-item>
      <el-form-item label="Name" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="Avatar">
        <!-- <img :src="user.avatar" alt width="100" /> -->
        <upload-com ref="uploadCom" :imgList="imgList"></upload-com>
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input v-model="user.title" />
      </el-form-item>
      <el-form-item label="Role">
        <el-radio v-model="user.role" :disabled="currentRole=='user'?true:false" label="user">用户</el-radio>
        <el-radio v-model="user.role" label="admin">管理员</el-radio>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" show-password v-model="user.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="addUser()">点击添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from "@/api/user";
import uploadCom from "@/components/upload/index";
export default {
  components: { uploadCom },
  computed: {
    currentRole() {
      return this.$store.state.user.role;
    }
  },
  data() {
    return {
      imgList: [],
      user: {
        id: null,
        username: null,
        password: null,
        avatar: null,
        title: null,
        role: "admin"
      },
      rules: {
        username: [
          { required: true, message: "请输入UserName", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "UserName长度要求在 3 到 10 个字符！",
            trigger: "blur"
          }
        ],
        title: [
          {
            min: 3,
            max: 20,
            message: "Title长度要求在 3 到 20 个字符或者不输入！",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入Password", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "Password长度要求在 6 到 12 个字符！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    addUser() {
      this.$refs.user.validate(res => {
        if (res) {
          this.$confirm("确定添加用户？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.$refs.uploadCom.imgList.length != 0) {
              this.user.avatar = this.$refs.uploadCom.imgList[0].url;
            } else {
              this.user.avatar = null;
            }

            add(this.user)
              .then(res => {
                this.$message({
                  type: "success",
                  message: "添加用户成功!"
                });
                this.$router.push({ name: "User" });
              })
              .catch(err => {
                this.$notify.error({
                  title: "错误",
                  message: "添加用户失败！"
                });
              });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
