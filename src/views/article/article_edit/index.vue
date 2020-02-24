<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="id" hidden>
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="内容">
        <!-- tinymce -->
        <!-- <tinymceeditor id="tinymce" v-model="form.content" :init="init" /> -->
        <tinymce1 ref="con" />
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-model="form.date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="封面图">
        <!-- 图片上传 -->
        <el-upload
          :http-request="handleUpload"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          class="upload-demo"
          list-type="picture-card"
          action
          :file-list="form.oldimg"
          :limit="1"
        >
          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="jindu" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit()">点击修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入封装好的tinymce
import tinymce1 from "../../tinymce/tinymce.vue";
// 引入api
import { findarticle, editarticle } from "@/api/article";
import { qiniutoken, delqiniuimg } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

export default {
  components: { tinymce1 },
  data() {
    return {
      form: {
        id: "",
        title: "",
        type: "",
        content: "",
        date: "",
        img: [],
        oldimg: []
      },
      newimg: null,
      rules: {
        date: [{ required: true, message: "请填写日期时间" }]
      },
      token: "",
      jindu: 0
    };
  },
  mouted() {},
  created() {
    findarticle(this.$route.params.id)
      .then(res => {
        this.form.id = res.list.rows[0].id;
        this.form.title = res.list.rows[0].title;
        this.form.type = res.list.rows[0].type;
        this.$refs["con"].content = res.list.rows[0].content;
        // this.form.content = res.list.rows[0].content
        this.form.date = res.list.rows[0].date;
        this.form.date = this.dateFormat(this.form.date);
        // this.form.img = res.list.rows[0].img;
        if (res.list.rows[0].img) {
          console.log(res.list.rows[0].img);
          console.log("121111111111111");
          this.form.oldimg.push({
            name: res.list.rows[0].img,
            url: res.list.rows[0].img
          });
          console.log("===========");
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // 格式化时间
    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload(res) {
      console.log(res.file);
      this.newimg = res.file;
    },
    // 文件列表移除文件时的钩子
    handleRemove() {
      this.newimg = null;
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      this.$message({
        message: "只能上传一张封面图",
        type: "error"
      });
    },
    // 获取七牛云上传凭证
    getqiniutoken() {
      console.log("开始获取七牛云上传凭证");
      return new Promise(function(resolve, reject) {
        qiniutoken()
          .then(res => {
            console.log("获取七牛云上传凭证成功！");
            resolve(res.uploadToken);
          })
          .catch(err => {
            console.log("获取七牛云上传凭证响应失败！");
            reject(err);
          });
      });
    },
    // 上传七牛云图片
    async upqiniuimg() {
      var datetime = new Date();
      var key = datetime.getTime() + this.newimg.name;
      var uptoken = this.token;
      var putExtra = {
        fname: "",
        params: {},
        mimeType: ["image/png", "image/jpeg", "image/gif"]
      };
      var config = {
        useCdnDomain: true
      };
      var observable = qiniu.upload(
        this.newimg,
        key,
        uptoken,
        putExtra,
        config
      );
      console.log("开始上传图片");
      var ooo = this; // 获取vm实例this
      var res = await new Promise(function(resolve, reject) {
        var subscription = observable.subscribe({
          next(res) {
            // 接收上传进度信息
            var percent = res.total.percent;
            ooo.jindu = percent.toFixed();
            ooo.jindu = Number(ooo.jindu);
            console.log("上传进度：" + ooo.jindu);
          },
          error(err) {
            // 上传错误后触发
            console.log("上传错误");
            reject(err);
          },
          complete(res) {
            // 接收上传完成后的后端返回信息
            console.log("上传完成！");
            ooo.form.img = "http://img.cdn.zhengbeining.com/" + res.key;
            resolve(res);
          }
        });
      });
    },
    // 删除七牛云图片
    delqiniuimg(data) {
      console.log("开始删除七牛云图片");
      console.log(data);
      return new Promise(function(resolve, reject) {
        delqiniuimg(data)
          .then(res => {
            if (res.code === 20000) {
              console.log("删除七牛云图片成功！");
              resolve(res.data);
            } else {
              console.log("删除七牛云图片失败");
              resolve(res.data);
            }
          })
          .catch(err => {
            console.log("删除七牛云图片响应失败");
            console.log(err);
          });
      });
    },
    // 修改文章
    async editarticle(data) {
      console.log("开始修改文章");
      console.log(this.$refs.form.model);
      var res = await editarticle(data);
      console.log(res);
      console.log("修改文章完成！");
      this.$message({
        message: res,
        type: "success"
      });
    },
    onSubmit() {
      // 验证表单数据
      this.form.content = this.$refs.con.content;
      // this.form.content = this.$refs['con'].content
      this.$refs["form"].validate(async valid => {
        if (valid) {
          console.log("表单验证通过！");
          if (this.form.oldimg.length == 0 && this.newimg == null) {
            console.log("111111111");
            this.form.img = null;
            this.editarticle(this.form);
          }
          if (this.form.oldimg.length == 1 && this.newimg == null) {
            // 如果只删除七牛云图片，除了修改数据库还要把七牛云图片删了
            console.log(
              "如果只删除七牛云图片，除了修改数据库还要把七牛云图片删了"
            );
            this.delqiniuimg(this.form.oldimg[0].name)
              .then(() => {
                this.form.img = null;
                this.editarticle(this.form);
              })
              .catch(err => {
                console.log(err);
              });
          }
          // 原本有封面图的先删除旧封面图再上传新封面图，再修改数据库
          if (this.form.oldimg.length == 1 && this.newimg != null) {
            console.log("22222222222222");
            await this.delqiniuimg(this.form.oldimg[0].name);
            var gettoken = await this.getqiniutoken();
            this.token = gettoken;
            await this.upqiniuimg();
            await this.editarticle(this.form);
          }
          if (this.form.oldimg.length == 0 && this.newimg != null) {
            // 原本没有封面图的不用删直接上传新封面图，再修改数据库
            console.log(this.newimg);

            console.log("原本没有封面图的不用删直接上传新封面图，再修改数据库");
            var gettoken = await this.getqiniutoken();
            this.token = gettoken;
            await this.upqiniuimg();
            await this.editarticle(this.form);
          }
        } else {
          alert("请填写完整！");
          return false;
        }
      });
    }
  }
};
</script>

