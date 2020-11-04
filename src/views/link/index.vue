<template>
  <div class="app-container">
    <el-button type="primary" size="medium" icon="el-icon-plus" @click="showAddLink">添加友链</el-button>
    <el-table :data="linkList" style="width: 100%">
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="avatar" label="Avatar" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            @click="showAvatar(scope.row.avatar)"
          >预览</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column prop="url" label="Url"></el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit({...scope.row})">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete({...scope.row})">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Link" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="linkForm" :rules="rules">
        <el-form-item label="Name" prop="name">
          <el-input v-model="linkForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Avatar" prop="avatar">
          <el-input v-model="linkForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="linkForm.description"></el-input>
        </el-form-item>
        <el-form-item label="Url" prop="url">
          <el-input v-model="linkForm.url"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="text" @click="cancelAction">取消</el-button>
        <el-button @click="successAction(linkForm)">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Avatar" width="40%" :visible.sync="dialogAvatar">
      <img :src="currentAvatar" style="max-width:100%;min-width:100%" :alt="currentAvatar" />
    </el-dialog>
  </div>
</template>

<script>
import { linklist, dellink, addlink, editlink } from "@/api/link";
export default {
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogAvatar: false,
      addOrEdit: "add",
      currentAvatar: null,
      linkForm: {
        id: null,
        name: "",
        avatar: "",
        description: "",
        url: "",
      },
      linkList: [],
      rules: {
        name: [
          { required: true, message: "请填写友链名称！", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        avatar: [
          { required: true, message: "请填写友链头像！", trigger: "blur" },
          {
            min: 10,
            max: 150,
            message: "长度在 10 到 150 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请填写友链描述！", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
        url: [
          { required: true, message: "请填写友链地址！", trigger: "blur" },
          {
            min: 10,
            max: 50,
            message: "长度在 10 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getAllLink();
  },
  methods: {
    showAvatar(avatar) {
      this.dialogAvatar = true;
      this.currentAvatar = avatar;
    },
    getAllLink() {
      linklist().then((res) => {
        this.linkList = res.rows;
      });
    },
    showAddLink() {
      this.dialogFormVisible = true;
      this.linkForm = {
        id: null,
        name: "",
        avatar: "",
        description: "",
        url: "",
      };
    },
    handleEdit(link) {
      this.addOrEdit = "edit";
      this.linkForm = link;
      this.dialogFormVisible = true;
    },
    handleDelete(link) {
      this.$confirm("确认删除: ' " + link.name + " ' 友链吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dellink(link.id)
            .then((res) => {
              this.$message({
                message: "删除友链成功！",
                type: "success",
              });
              this.getAllLink();
            })
            .catch((err) => {
              this.$notify.error({
                title: "错误",
                message: "删除友链失败！",
              });
              this.getAllLink();
            });
        })
        .catch((err) => {
          this.$message({
            message: "已取消删除~",
            type: "warning",
          });
        });
    },
    cancelAction() {
      this.dialogFormVisible = false;
    },
    successAction(linkForm) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.addOrEdit == "add") {
            this.$refs["form"].validate((valid) => {
              this.$confirm("确认添加吗？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  addlink(this.linkForm)
                    .then((res) => {
                      this.$message({
                        message: "添加友链成功！",
                        type: "success",
                      });
                      this.getAllLink();
                      this.dialogFormVisible = false;
                    })
                    .catch((err) => {
                      this.$notify.error({
                        title: "错误",
                        message: "添加友链失败！",
                      });
                      this.getAllLink();
                      this.dialogFormVisible = false;
                    });
                })
                .catch((err) => {});
            });
          } else {
            this.$confirm("确认修改吗？", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                editlink(this.linkForm)
                  .then((res) => {
                    this.$message({
                      message: "修改友链成功！",
                      type: "success",
                    });
                    this.getAllLink();
                    this.dialogFormVisible = false;
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "错误",
                      message: "修改友链失败！",
                    });
                    this.getAllLink();
                    this.dialogFormVisible = false;
                  });
              })
              .catch((err) => {});
          }
        } else {
          this.$message({
            message: "请输入完整的友链信息！",
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
