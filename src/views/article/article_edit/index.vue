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
        <!-- <tinymce1 ref="con" /> -->
        <markdown ref="con" />
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
          :file-list="oldimg"
          :limit="1"
        >
          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
          <i class="el-icon-plus"></i>
        </el-upload>
        {{this.newimg}}
        <!-- {{this.oldimg[0].url}} -->
        <el-progress :text-inside="true" :stroke-width="18" :percentage="jindu" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit()">点击修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
// 引入封装好的tinymce
import tinymce1 from "../../tinymce/tinymce.vue";
import markdown from "../../markdown";
// 引入api
import { findarticle, editarticle } from "@/api/article";
import { qiniutoken, delqiniuimg } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";

export default {
  components: { tinymce1, markdown },
  data() {
    return {
      form: {
        id: "",
        title: "",
        type: "",
        content: "",
        date: "",
        img: null
      },
      oldimg: [],
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
          this.oldimg.push({
            name: res.list.rows[0].img,
            url: res.list.rows[0].img
          });
          console.log(this.oldimg[0].url);
          this.newimg = res.list.rows[0].img;
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
      let formData = new FormData();
      formData.append("avatar", res.file);
      console.log(res.file);
      this.newimg = formData;
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
          if (this.$store.state.user.role != "admin") {
            this.$message({
              message: "您没权限修改哦~",
              type: "warning"
            });
          } else {
            if (this.oldimg.length == 0) {
              // if (this.oldimg.length == 0 && this.newimg != null) {
              if (this.newimg != null) {
                // 原本没有封面图的不用删直接上传新封面图，再修改数据库
                console.log(this.newimg);
                console.log;
                console.log(
                  "原本没有封面图的不用删直接上传新封面图，再修改数据库"
                );
                const config = {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                };
                var file = await axios.post("/api/upload", this.newimg, config);
                var filename = file.data.file.filename;
                this.form.img = "/api/" + filename;
                await this.editarticle(this.form);
              } else {
                console.log("111111111");
                this.form.img = null;
                this.editarticle(this.form);
              }
            } else {
              console.log("sssssssssssssss");
              console.log(this.oldimg[0].name);
              console.log(this.newimg);
              if (this.newimg == null) {
                // 如果只删除七牛云图片，除了修改数据库还要把七牛云图片删了
                console.log(
                  "如果只删除七牛云图片，除了修改数据库还要把七牛云图片删了"
                );
                this.form.img = null;
                this.editarticle(this.form);
              }
              if (this.oldimg[0].name != this.newimg) {
                // 原本有封面图的先删除旧封面图再上传新封面图，再修改数据库
                console.log("22222222222222");
                const config = {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                };
                var file = await axios.post("/api/upload", this.newimg, config);
                var filename = file.data.file.filename;
                this.form.img = "/api/" + filename;
                await this.editarticle(this.form);
              } else {
                console.log("sdfsdgd");
                console.log(this.oldimg[0].name);
                this.form.img = this.oldimg[0].name;
                this.editarticle(this.form);
              }
            }
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

