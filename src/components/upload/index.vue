<template>
  <div>
    <el-upload
      :http-request="handleUpload"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBefore"
      class="upload-demo"
      list-type="picture-card"
      action
      :limit="1"
      :file-list="imgList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import { getQiniuToken, delQiniuImg } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

export default {
  components: {},
  props: {
    imgList: {
      type: Array,
      default: function() {
        return [
          // {
          //   name: "",
          //   url:
          //     "https://img.cdn.lsyblog.com/007X8olVly1g7hxjawgyfj306o06ojra.jpg"
          // }
        ];
      }
    }
  },
  data() {
    return {
      //   imgList: [],
      img: null
    };
  },
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
      return new Promise(function(resolve, reject) {
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
          }
        });
      });
    },
    handleBefore(file) {
      if (file.name.length > 15) {
        return false;
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload({ file }) {
      console.log(file);
      this.imgList.shift();
      this.qiniuUpload(file.name, file)
        .then(res => {
          this.imgList.push({ name: "", url: res });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除七牛云图片
    async qiniuDel(filename) {
      return new Promise(function(resolve, reject) {
        delQiniuImg(filename.slice(33))
          .then(res => {
            resolve("删除七牛云图片成功");
          })
          .catch(err => {
            reject("删除七牛云图片错误");
          });
      });
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      if (file.name.length <= 15) {
        this.qiniuDel(this.imgList[0].url)
          .then(res => {
            this.imgList.shift();
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "文件名不能大于十五个字符!",
          type: "error"
        });
      }
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      this.$message({
        message: "只能上传一张封面图",
        type: "error"
      });
    }
  }
};
</script>

<style scoped>
</style>