<template>
  <div class="app-container">
    <el-form status-icon :model="tag" ref="tagform" :rules="rules" style="margin-top:20px">
      <el-form-item label="标签列表:">
        <div class="tag" v-loading="loading">
          <div style="width:90%;display:inline-block">
            <el-tooltip
              v-for="item in taglist"
              :key="item.id"
              class="item"
              effect="dark"
              :content="'该标签下有'+item.articles.length+'篇文章'"
              placement="top"
            >
              <el-tag
                class="tag-margin"
                closable
                :disable-transitions="false"
                :color="item.color"
                @close="closeTag(item.id)"
              >{{item.name}}</el-tag>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="标签名称:" prop="name">
        <div style="width:60%;display:inline-block">
          <el-input type="text" v-model="tag.name" placeholder="请输入标签名"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="标签颜色:">
        <el-color-picker v-model="tag.color" show-alpha :predefine="predefineColors"></el-color-picker>
      </el-form-item>
      <el-form-item label="标签预览:" class="tag">
        <el-tag :disable-transitions="false" :color="tag.color">{{tag.name}}</el-tag>
      </el-form-item>
      <el-button type="primary" @click="createdtag">立即创建</el-button>
    </el-form>
  </div>
</template>

<script>
import { taglist, addtag, deltag } from "@/api/tag";
export default {
  components: {},
  data() {
    return {
      loading: false,
      taglist: [],
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#9a20ce"
      ],
      tag: {
        id: null,
        name: "",
        color: "rgba(0, 206, 209, 1)"
      },
      rules: {
        name: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getTagList();
  },
  methods: {
    getTagList() {
      taglist().then(res => {
        this.taglist = res.rows;
      });
    },
    createdtag() {
      this.$refs.tagform.validate(res => {
        if (res) {
          addtag(this.tag)
            .then(res => {
              this.$message({
                type: "success",
                message: "创建标签成功！"
              });
              this.getTagList();
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: "创建标签失败！"
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "请输入正确的标签名称！"
          });
        }
      });
    },
    closeTag(tag_id) {
      for (let item of this.taglist) {
        if (item.id == tag_id) {
          if (item.articles.length != 0) {
            this.$confirm(
              "该标签下有" +
                item.articles.length +
                "篇文章，删除后所有文章将不能使用该便签，确定删除吗？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.loading = true;
              deltag(tag_id)
                .then(res => {
                  this.$message({
                    type: "success",
                    message: "删除标签成功!"
                  });
                  this.getTagList();
                  this.loading = false;
                })
                .catch(err => {
                  this.$notify.error({
                    title: "错误",
                    message: "删除标签失败！"
                  });
                  this.getTagList();
                  this.loading = false;
                });
            });
          } else {
            this.$confirm("确定删除：' " + item.name + " ' 标签吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.loading = true;
                deltag(tag_id)
                  .then(res => {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.getTagList();
                    this.loading = false;
                  })
                  .catch(err => {
                    this.$notify.error({
                      title: "错误",
                      message: "删除标签失败！"
                    });
                    this.getTagList();
                    this.loading = false;
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.tag /deep/ .el-tag {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
.tag-margin {
  display: inline-block;
  margin: 10px 30px 20px 0;
}
</style>
