<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户: {{ username }}</div>
    <div class="dashboard-text">权限: {{ role }}</div>
    <!-- <div class="dashboard-text">sidebar: {{ sidebar }}</div> -->
    <!-- <div class="dashboard-text">device: {{ device }}</div> -->
    <!-- <div class="dashboard-text">令牌: {{ token }}</div> -->
    <div class="dashboard-text">
      头像:
      <img :src="avatar" width="100" height="100" alt />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["username", "sidebar", "device", "token", "role", "avatar"])
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
