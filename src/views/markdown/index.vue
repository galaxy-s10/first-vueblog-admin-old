<template>
  <div>
      <mavon-editor ref="md" v-model="content"> </mavon-editor>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  components: { mavonEditor },
  data() {
    return {
        content:''
    };
  }
};
</script>



<style scoped>
</style>
