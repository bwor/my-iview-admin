<template>
  <Card>
    <i-form :model="formItem" :label-width="80">
      <Form-item label="标题">
        <i-input v-model="formItem.title" placeholder="请输入标题"></i-input>
      </Form-item>
      <Form-item label="标签">
        <i-select v-model="formItem.tag_id" placeholder="请选择">
          <i-option
            v-for="(tag, index) in tags"
            :value="tag._id"
            :key="`tag${index}`"
            >{{ tag.name }}</i-option
          >
        </i-select>
      </Form-item>
      <Form-item label="是否启用">
        <i-switch v-model="formItem.status" :true-value="1" :false-value="0" />
      </Form-item>
      <Form-item label="缩略图">
        <bwor-upload
          v-model="formItem.pic"
          @success="handleUploadSuccess"
        ></bwor-upload>
      </Form-item>
      <Form-item label="描述">
        <i-input
          v-model="formItem.desc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入..."
        ></i-input>
      </Form-item>
      <Form-item label="文章内容">
        <bwor-editor
          ref="editor"
          v-model="formItem.content"
          :cache="false"
        ></bwor-editor>
      </Form-item>
      <Form-item>
        <i-button @click="handleSubmit" type="primary">提交</i-button>
        <i-button @click="handleCancel" style="margin-left: 8px">取消</i-button>
      </Form-item>
    </i-form>
  </Card>
</template>
<script>
import { getTags } from "@/api/tag";
import { insertBlog, modifyBlog } from "@/api/blog";
import Upload from "@/components/upload/index.vue";
import Editor from "@/components/editor";
export default {
  name: "blog_content",
  data() {
    return {
      formItem: {
        title: "",
        tag_id: "",
        status: 1,
        pic: "",
        desc: "",
        content: "",
      },
      isAdd: true,
      tags: [], // tags,后面会放入vuex中
    };
  },
  components: { "bwor-upload": Upload, "bwor-editor": Editor },
  mounted() {
    this.init();
    this._getTags();
  },
  methods: {
    init() {
      let params = this.$route.params;
      const { content } = params;
      if (content) {
        // 编辑
        this.isAdd = false;
        this.formItem = content;
        if (this.formItem.content) {
          this.$refs.editor.setHtml(this.formItem.content);
        }
      } else {
        // 新增
        this.isAdd = true;
      }
    },
    _getTags() {
      getTags().then((res) => {
        if (res.code === 200) {
          const { tags } = res.data;
          if (tags.length > 0) {
            this.tags = tags.filter((tag) => tag.status !== 0);
          }
        }
      });
    },
    handleUploadSuccess(data) {
      this.formItem.pic = data.imgName || "";
    },
    handleSubmit() {
      if (this.isAdd) {
        this._insertBlog();
      } else {
        this._modifyBlog();
      }
    },
    _insertBlog() {
      insertBlog(this.formItem).then((res) => {
        if (res.code === 200) {
          this.$Message.success("新增成功");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    _modifyBlog() {
      modifyBlog(this.formItem).then((res) => {
        if (res.code === 200) {
          this.$Message.success("修改成功");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    handleCancel() {
      this.$router.back();
    },
  },
};
</script>
