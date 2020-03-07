<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce ref="con" />
      </el-form-item>
      <el-form-item label="时间" prop="shijian">
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-model="form.shijian"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      {{ form.filedata }}
      <el-form-item label="封面图">
        <!-- 图片上传 -->
        <el-upload
          :http-request="handleUpload"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          class="upload-demo"
          action
          list-type="picture"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="jindu" />
      </el-form-item>
      <el-button type="success" @click="onSubmit()">发表文章</el-button>
    </el-form>
  </div>
</template>

<script>
// 引入api
import { addarticle } from "@/api/article";
import { qiniutoken } from "@/api/qiniu";
// 引入七牛云
import * as qiniu from "qiniu-js";
// 引入封装好的tinymce
import tinymce from "../../tinymce/tinymce.vue";

export default {
  components: { tinymce },
  data() {
    return {
      token: "",
      jindu: 0,
      form: {
        title: "",
        type: "",
        content: "",
        shijian: "",
        filedata: ""
      },
      rules: {
        title: [{ required: true, message: "请填写标题！" }],
        type: [{ required: true, message: "请填写分类!" }],
        shijian: [{ required: true, message: "请填写日期时间！" }]
      }
    };
  },
  mouted() {},
  methods: {
    // 覆盖默认的上传行为，可以自定义上传的实现
    handleUpload(res) {
      this.form.filedata = res.file;
      console.log(res.file);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, filelist) {
      this.form.filedata = null;
    },
    // 文件超出个数限制时的钩子
    handleExceed(file, filelist) {
      this.$message({
        message: "只能上传一张封面图",
        type: "error"
      });
    },
    onSubmit() {
      // 验证表单数据
      this.form.content = this.$refs["con"].content;
      console.log(this.$refs.con.content);
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log("表单验证通过！");
          if (this.form.filedata === "" || this.form.filedata === "无") {
            console.log("没有封面图");
            this.form.filedata = "无";
            console.log(this.form);
            addarticle(this.form)
              .then(res => {
                console.log(res);
                this.$message({
                  message: res,
                  type: "success"
                });
              })
              .catch(error => {
                console.log("发布文章错误");
                console.log(error);
              });
          } else {
            console.log("有封面图");
            this.form.filedata = this.form.filedata;
            // 获取七牛云上传凭证
            qiniutoken()
              .then(res => {
                console.log("获取七牛云上传凭证成功！");
                this.token = res.uploadToken;
              })
              .then(() => {
                var datetime = new Date();
                var key = datetime.getTime() + this.form.filedata.name;
                var uptoken = this.token;
                var putExtra = {
                  fname: "",
                  params: {},
                  mimeType: ["image/png", "image/jpeg", "image/gif"]
                };
                var config = {
                  useCdnDomain: true
                };
                var ooo = this; // 获取vm实例this
                var observable = qiniu.upload(
                  this.form.filedata,
                  key,
                  uptoken,
                  putExtra,
                  config
                );
                var subscription = observable.subscribe({
                  next(res) {
                    // next: 接收上传进度信息
                    var percent = res.total.percent; // 当前上传进度
                    ooo.jindu = percent.toFixed();
                    ooo.jindu = Number(ooo.jindu);
                  },
                  error(err) {
                    // 上传错误后触发
                    console.log("上传错误");
                    console.log(err);
                    //  上传错误！发表文章
                    console.log("上传错误！发表文章");
                    addarticle(ooo.form)
                      .then(res => {
                        ooo.$message({
                          message: res,
                          type: "success"
                        });
                      })
                      .catch(error => {
                        console.log("发布文章错误");
                        console.log(error);
                      });
                  },
                  complete(ress) {
                    // 接收上传完成后的后端返回信息
                    console.log("上传封面图成功！");
                    ooo.form.filedata = key;
                    // 发表文章
                    console.log(ooo.form);
                    addarticle(ooo.form)
                      .then(res => {
                        console.log("发布文章成功！");
                        ooo.$message({
                          message: res,
                          type: "success"
                        });
                      })
                      .catch(error => {
                        console.log("发布文章失败！");
                        console.log(error);
                      });
                  }
                });
              })
              .catch(err => {
                console.log("获取七牛云上传凭证失败！");
                console.log(err);
              });
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

