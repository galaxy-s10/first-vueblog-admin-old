<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="id" hidden>
        <el-input v-model="form.id" />
      </el-form-item>
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
            placement="top"
            effect="dark"
          >
            <el-tag
              class="tag-margin"
              :class="{activeTag:showColor(item.id,item.color) != 'white'}"
              :disable-transitions="false"
              :color="showColor(item.id,item.color)"
              @click="tagClick(item)"
            >{{item.name}}</el-tag>
          </el-tooltip>
        </div>
        <div v-else>暂无标签可选</div>
      </el-form-item>
      <el-form-item label="内容">
        <markdown ref="md" v-if="this.form.content !=null" />
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
        <upload-com ref="uploadCom" :imgList="headerImg"></upload-com>
        {{this.newimg}}
        <el-progress :text-inside="true" :stroke-width="18" :percentage="jindu" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit()">点击修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import markdown from "@/components/markdown";
import uploadCom from "@/components/upload/index";
import { findArticle, editArticle } from "@/api/article";
import { taglist } from "@/api/tag";
import { delQiniuImg } from "@/api/qiniu";
import { format } from "@/utils/format.js";

export default {
  components: { markdown, uploadCom },
  data() {
    return {
      tagList: [],
      form: {
        id: "",
        title: "",
        tagList: [],
        type: "",
        content: "",
        date: "",
        img: null
      },
      headerImg: [],
      oldImgList: [],
      newimg: null,
      rules: {
        title: [
          { required: true, message: "请填写标题" },
          {
            min: 3,
            max: 20,
            message: "标题长度要求在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        type: [
          { required: true, message: "请填写分类" },
          {
            min: 2,
            max: 5,
            message: "分类长度要求在 2 到 5 个字符",
            trigger: "blur"
          }
        ],
        date: [
          { required: true, message: "请填写日期时间" },
          {
            min: 3,
            max: 20,
            message: "日期时间长度要求在 3 到 20 个字符",
            trigger: "blur"
          }
        ]
      },
      token: "",
      jindu: 0
    };
  },
  computed: {
    showColor(id, color) {
      return (id, color) => {
        // if (this.form.tagList.length != 0) {
        function exist(arr) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
              return true;
            }
          }
          return false;
        }
        const res = exist(this.form.tagList);
        return res ? color : "white";
        // }
      };
    }
  },
  mounted() {
    findArticle(this.$route.params.id)
      .then(res => {
        this.form.id = res.list.rows[0].id;
        this.form.title = res.list.rows[0].title;
        this.form.type = res.list.rows[0].type;
        this.form.tagList = res.list.rows[0].tags;
        this.form.date = format(res.list.rows[0].date);
        this.form.content = res.list.rows[0].content;
        // 设置mardown编辑器内容
        this.$refs["md"].content = res.list.rows[0].content;
        // 保存文章所有图片
        this.oldImgList = this.regMd(res.list.rows[0].content);
        // 保存封面图
        if (res.list.rows[0].img) {
          this.headerImg.push({ name: "", url: res.list.rows[0].img });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  async created() {
    await taglist().then(res => {
      this.tagList = res.rows;
    });
  },
  methods: {
    tagClick(item) {
      const id = item.id;
      function exist(arr, val) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == val) {
            return i;
          }
        }
        return false;
      }
      const res = exist(this.form.tagList, id);
      if (res === false) {
        this.form.tagList.push(item);
      } else {
        this.form.tagList.splice(res, 1);
      }
    },
    //正则匹配编辑器里的所有图片
    regMd(content) {
      const reg = /https:\/\/img.cdn.zhengbeining.com\/.+?(jpg|png|jpeg)/g;
      const val = content.match(reg);
      return val;
    },
    // 删除七牛云图片
    delQiniuImg(filename) {
      delQiniuImg(filename.slice(33))
        .then(res => {
          console.log("删除七牛云图片成功");
        })
        .catch(err => {
          console.log("删除七牛云图片错误");
        });
    },
    onSubmit() {
      // 验证表单数据
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.$store.state.user.role != "admin") {
            this.$message({
              message: "您没权限修改哦~",
              type: "warning"
            });
          } else {
            // 修改后的内容
            this.form.content = this.$refs.md.content;
            // 修改后的文章图片
            var articleImgs = this.regMd(this.$refs.md.content);
            articleImgs = articleImgs == null ? [] : articleImgs;
            var oldImgList = this.oldImgList;
            oldImgList = oldImgList == null ? [] : oldImgList;
            const delImgs = oldImgList.filter(function(val) {
              return articleImgs.indexOf(val) === -1;
            });
            delImgs.forEach(val => {
              this.delQiniuImg(val);
            });
            // 修改后的封面图
            if (
              this.form.img != null &&
              this.$refs.uploadCom.imgList.length != 0
            ) {
              this.form.img = this.$refs.uploadCom.imgList[0].url;
            }
            if (
              this.form.img != null &&
              this.$refs.uploadCom.imgList.length == 0
            ) {
              this.form.img = null;
            }
            if (
              this.form.img == null &&
              this.$refs.uploadCom.imgList.length != 0
            ) {
              this.form.img = this.$refs.uploadCom.imgList[0].url;
            }
            editArticle(this.form)
              .then(res => {
                this.$message({
                  message: res,
                  type: "success"
                });
                this.$router.push({ name: "Article" });
              })
              .catch(err => {
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

<style scoped>
.activeTag {
  color: white !important;
}
.tag /deep/ .el-tag {
  background-color: white;
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
  /* color:black; */
  display: inline-block;
  margin: 5px 10px;
}
</style>