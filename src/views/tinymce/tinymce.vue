<template>
  <div>
    <tinymceeditor v-model="content" :init="init" />
  </div>
</template>

<script>
// 引入tinymce
import tinymce from "tinymce";
import tinymceeditor from "@tinymce/tinymce-vue";
// 引入tinymce主题
// import 'tinymce/themes/silver/theme'
// 引入tinymce皮肤
// import 'tinymce/skins/ui/oxide/skin.css'
// import 'tinymce/skins/ui/oxide-dark/skin.css'
// 引入public下的tinymce语言包
// import '../../../public/tinymce/zh_CN'
// 引入tinmce插件
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/preview";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/hr";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/codesample";
import "tinymce/plugins/insertdatetime";

export default {
  components: { tinymceeditor },
  data() {
    return {
      content: "",
      init: {
        // 中文包
        language_url: "/tinymce/zh_CN.js",
        language: "zh_CN",
        // 引入外部主题
        theme_url: "/tinymce/themes/silver/theme.min.js",
        // theme: 'silver', // 事实无卵用
        // 引入外部皮肤，取值与皮肤指定文件夹不同，需要具体到js文件。
        skin_url: "/tinymce/skins/ui/oxide",
        // skin: 'oxide', // 事实无卵用
        height: 300,
        content_css: [
          // 可设置编辑区内容展示的css，谨慎使用
          "/tinymce/skins/content/default/content.css"
        ],
        // 指定表情符号路径
        emoticons_database_url: "tinymce/plugins/emoticons/js/emojis.js",
        images_upload_handler: function(blobInfo, succFun, failFun) {
          console.log(blobInfo);
        },
        // 插件配置
        plugins:
          "insertdatetime lists advlist image link preview emoticons hr searchreplace table wordcount codesample",
        // 工具栏配置
        toolbar:
          "undo redo | formatselect | forecolor backcolor | bold italic underline strikethrough blockquote codesample | image link table emoticons hr insertdatetime | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | wordcount | searchreplace| preview",
        // branding（隐藏右下角技术支持）Powered by Tiny
        branding: true
      }
    };
  },
  watch: {
    content: function(newval, oldval) {
      this.content = newval;
    }
  },
  methods: {}
};
</script>


<style scoped>
</style>