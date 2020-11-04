<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="标签">
        <div class="tag" v-if="tagList.length">
          <el-tooltip
            v-for="item in tagList"
            :key="item.id"
            :content="showColor(item.id,item.color) == 'white'?'点击选中':'点击取消'"
            :class="{activeTag:showColor(item.id,item.color) != 'white'}"
            placement="top"
            effect="dark"
          >
            <el-tag
              class="tag-margin"
              :disable-transitions="false"
              :color="showColor(item.id,item.color)"
              @click="tagClick(item.id)"
            >{{item.name}}</el-tag>
          </el-tooltip>
        </div>
        <div v-else>暂无标签可选</div>
      </el-form-item>
      <el-form-item label="内容">
        <markdown ref="md" />
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
        <upload-com ref="uploadCom"></upload-com>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="jindu" />
      </el-form-item>
      <el-button type="success" @click="onSubmit()">发表文章</el-button>
    </el-form>
  </div>
</template>

<script>
// 引入api
import { addArticle } from "@/api/article";
import { taglist } from "@/api/tag";
import uploadCom from "@/components/upload";
import markdown from "@/components/markdown";
export default {
  components: { markdown, uploadCom },
  data() {
    return {
      token: "",
      jindu: 0,
      tagList: [],
      tag_id: 0,
      selectTagList: [],
      form: {
        id: null,
        title: "",
        type: "",
        content: "",
        date: "",
        img: null,
      },
      rules: {
        title: [
          { required: true, message: "请填写标题" },
          {
            min: 3,
            max: 20,
            message: "标题长度要求在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请填写分类" },
          {
            min: 2,
            max: 5,
            message: "分类长度要求在 2 到 5 个字符",
            trigger: "blur",
          },
        ],
        date: [
          { required: true, message: "请填写日期时间" },
          {
            min: 3,
            max: 20,
            message: "日期时间长度要求在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    showColor(id, color) {
      return (id, color) => {
        return this.selectTagList.indexOf(id) == -1 ? "white" : color;
      };
    },
  },
  created() {
    this.getTagList();
  },
  mounted() {},
  methods: {
    tagClick(id) {
      this.tag_id = id;
      if (this.selectTagList.indexOf(id) == -1) {
        this.selectTagList.push(id);
      } else {
        this.selectTagList.splice(this.selectTagList.indexOf(id), 1);
      }
    },
    getTagList() {
      taglist().then((res) => {
        this.tagList = res.rows;
      });
    },
    onSubmit() {
      // 验证表单数据
      this.form.content = this.$refs["md"].content;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.$store.state.user.role != "admin") {
            this.$message({
              message: "您没权限发送哦~",
              type: "warning",
            });
          } else {
            this.form.tagList = this.selectTagList;
            if (this.$refs.uploadCom.imgList.length != 0) {
              this.form.img = this.$refs.uploadCom.imgList[0].url;
            } else {
              this.form.img = null;
            }
            addArticle(this.form)
              .then((res) => {
                this.$message({
                  message: "发表文章成功！",
                  type: "success",
                });
                this.$router.push({ name: "Article" });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          this.$alert("请填写完整！", "提示", {
            confirmButtonText: "确定",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.activeTag {
  color: white !important;
}
.tag /deep/ .el-tag {
  color: black;
}
.tag /deep/ .el-tag:hover {
  cursor: pointer;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
.tag-margin {
  display: inline-block;
  margin: 5px 10px;
}
</style>