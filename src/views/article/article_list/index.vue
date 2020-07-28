<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="{column,row}">{{ row.id }}</template>
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/article/article_edit/'+row.id">{{ row.title }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="{row}">{{ row.type }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="封面图" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img" alt width="50" height="50" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ dateFormat(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="delArticle(scope.row.id,scope.row.content,scope.row.img)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { articleList, delArticle } from "@/api/article";
import { delQiniuImg } from "@/api/qiniu";

export default {
  data() {
    return {
      qiniuToken: null,
      list: null,
      listLoading: true
    };
  },
  created() {
    this.getArticleList();
  },
  methods: {
    // 删除七牛云图片
    async delQiniuImg(filename) {
      return new Promise(function(resolve, reject) {
        delQiniuImg(filename.slice(33))
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject("删除七牛云图片错误");
          });
      });
    },
    getArticleList() {
      this.listLoading = true;
      articleList()
        .then(res => {
          this.list = res.list.rows;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 格式化日期时间
    dateFormat(time) {
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
    delArticle: function(id, mdContent, img) {
      this.$confirm("是否永久删除该文章", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const reg = /https:\/\/img.cdn.zhengbeining.com\/.+?(jpg|png|jpeg)/g;
          const qiniuImgs = mdContent.match(reg);
          if (qiniuImgs) {
            qiniuImgs.forEach(item => {
              this.delQiniuImg(item).then(res => {
                console.log(res);
              });
            });
          }
          if (img) {
            this.delQiniuImg(img).then(res => {
              console.log(res);
            });
          }
          delArticle(id)
            .then(res => {
              this.$message({
                message: res,
                type: "success"
              });
              this.getArticleList();
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: "删除文章失败！"
              });
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
};
</script>
