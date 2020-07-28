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
      <el-table-column label="UserName" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">
            <router-link :to="'/user/user_edit/'+scope.row.id">{{ scope.row.username }}</router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Avatar" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar !== null" :src="scope.row.avatar" width="50" height="50" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="createdAt" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ createdDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="updatedAt" align="center">
        <template slot-scope="scope">
          <span style="white-space:nowrap">{{ updateDate(scope.row.updatedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.row.id,scope.row.avatar)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { userList, deluser } from "@/api/user";
import { format } from "@/utils/format";
import { delQiniuImg } from "@/api/qiniu";

export default {
  data() {
    return {
      list: null,
      listLoading: true
    };
  },
  computed: {
    createdDate(x) {
      return x => format(x);
    },
    updateDate(x) {
      return x => format(x);
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    del(id, avatar) {
      this.$confirm("是否删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (avatar) {
            delQiniuImg(avatar.slice(33))
              .then(res => {
                console.log("删除头像成功");
              })
              .catch(err => {
                console.log("删除头像错误");
              });
          }

          deluser(id)
            .then(res => {
              this.$message({
                message: res,
                type: "success"
              });
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: "删除用户失败！"
              });
            });
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getUserList() {
      this.listLoading = true;
      userList().then(response => {
        this.list = response.list;
        this.listLoading = false;
      });
    },
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
    }
  }
};
</script>
