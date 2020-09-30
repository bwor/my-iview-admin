<template>
  <div v-loading="true">
    <Upload
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-progress="handleProgress"
      :before-upload="handleBeforeUpload"
      :on-error="handleError"
      :data="extra"
      :action="action"
      style="display: inline-block"
    >
      <Button :loading="loading" icon="ios-cloud-upload-outline">上传文件</Button>
    </Upload>
    <span>{{imgName}}</span>
  </div>
</template>
<script>
import { getUploadToken } from "@/api/common.js";
import config from "@/config";
export default {
  data() {
    return {
      action: config.uploadAction,
      imgName: this.value,
      extra: {
        token: "",
      },
      loading: false,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    value: {
      handler(val) {
        this.imgName = val;
      },
    },
  },
  computed: {
    uploadList() {
      return this.$refs.upload ? this.$refs.upload.fileList : [];
    },
  },
  mounted() {
    this._getUploadToken();
  },
  methods: {
    _getUploadToken() {
      getUploadToken().then((res) => {
        if (res.code === 200) {
          this.extra.upload_token = res.data.token;
          this.extra.token = res.data.token;
        }
      });
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      this.loading = false;
      if (res.hash || res.key) {
        this.imgName = `${config.cdn}/${res.hash || res.key}`;
        this.$emit("input", this.imgName);
      }
      console.log(file);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。",
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超过 2M。",
      });
    },
    handleBeforeUpload() {
      if (this.loading) {
        this.$message.warning("文件正在上传中...,请勿重复上传");
        return;
      }
      this.loading = true;
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 5 张图片。",
        });
      }
      return check;
    },
    handleError(error, file, fileList) {
      this.loading = false;
      this.$message.error("上传失败");
    },
    handleProgress(event, file, fileList) {
      console.log(event, file, fileList);
    },
  },
};
</script>