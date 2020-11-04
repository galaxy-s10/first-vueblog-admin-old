<template>
  <div>
    <mavon-editor ref="md" v-model="content" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import { getQiniuToken, delQiniuImg } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

import "mavon-editor/dist/css/index.css";
export default {
  components: { mavonEditor },
  // props:{
  //   content:""
  // },
  data() {
    return {
      qiniuToken: null,
      content: "",
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.user.role,
    }),
  },
  created() {},
  mounted() {},
  methods: {
    // 获取七牛云上传凭证
    async getQiniuToken() {
      const res = await getQiniuToken();
      console.log(res);
      this.qiniuToken = res.uploadToken;
    },
    // 上传七牛云图片
    async qiniuUpload(filename, file) {
      const datetime = new Date();
      const key = datetime.getTime() + file.name;
      const uploadToken = await getQiniuToken();
      const uptoken = uploadToken;
      const putExtra = {};
      const config = { useCdnDomain: true };
      const observable = qiniu.upload(file, key, uptoken, putExtra, config);
      return new Promise(function (resolve, reject) {
        const subscription = observable.subscribe({
          // next: 接收上传进度信息的回调函数
          next(res) {
            const percent = res.total.percent; // 当前上传进度
            // console.log(percent);
          },
          // error: 上传错误后触发
          error(err) {
            console.log("上传七牛云图片错误");
            reject(err);
          },
          // complete: 接收上传完成后的后端返回信息
          complete(ress) {
            console.log("上传七牛云图片成功");
            resolve("https://img.cdn.zhengbeining.com/" + ress.key);
          },
        });
      });
    },
    // 删除七牛云图片
    async qiniuDel(filename) {
      return new Promise(function (resolve, reject) {
        delQiniuImg(filename.slice(33))
          .then((res) => {
            resolve("删除七牛云图片成功");
          })
          .catch((err) => {
            reject("删除七牛云图片错误");
          });
      });
    },
    async imgAdd(filename, file) {
      // if (this.role != "admin") {
      //   this.$refs.md.$img2Url(filename, null);
      //   this.$message({
      //     message: "您没权限上传图片哦~",
      //     type: "warning",
      //   });
      // } else {
      // if (filename && file) {
      this.qiniuUpload(filename, file)
        .then((res) => {
          this.$refs.md.$img2Url(filename, res);
        })
        .catch((err) => {
          console.log("dfg");
          console.log(err);
        });
      // } else {
      //   const reg = /(?<=(https:\/\/img.cdn.zhengbeining.com\/)).+?(jpg|png|jpeg)/g;
      //   console.log(filename.match(reg));
      //   var item = filename.match(reg);
      //   console.log(item[0], filename);
      //   this.$refs.md.$img2Url(item[0], filename);
      // }
      // }
    },
    imgDel(filename) {
      if (typeof filename[0] != "number") {
        this.qiniuDel(filename[0])
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>



<style scoped>
</style>
