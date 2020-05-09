<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :tree-props="{children: 'children'}">
    >
      <el-table-column align="center" label="文章编号" width="95">
        <template slot-scope="scope">{{ scope.row.article_id }}</template>
      </el-table-column>
      <el-table-column label="文章标题" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ scope.row.Article.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言人" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ scope.row.from_user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言内容" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被回复人" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ scope.row.to_user?scope.row.to_user.username:'无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="留言时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ dateFormat(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { all, delmessage } from "@/api/comment";

export default {
  data() {
    return {
      list: null,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 格式化日期时间
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
    // 留言列表
    fetchData() {
      this.listLoading = true;
      all().then(response => {
        this.list = response;
        this.listLoading = false;
      });
    },
    // 删除留言
    del(id) {
      this.$confirm("是否永久删除该留言", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delmessage(id)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: res.data,
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data,
                  type: "error"
                });
              }
              this.fetchData();
            })
            .catch(err => {
              console.log("删除留言响应失败");
              console.log(err);
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

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
