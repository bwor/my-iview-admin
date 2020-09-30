<template>
  <div>
    <Modal v-model="currentMoal" title="社交" @on-cancel="handleCancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Icon名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入你的标签名称" />
        </FormItem>
        <FormItem label="是否启用" prop="url">
          <i-switch v-model="formValidate.status" :true-value="1" :false-value="0"></i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit">确定</Button>
        <Button @click="handleCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { insertTag, modifyTag } from "@/api/tag";
export default {
  name: "tag-modal",
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
    operation: {
      type: String,
      default: "0",
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    currentMoal() {
      return this.modal;
    },
  },
  data() {
    return {
      formValidate: {
        name: "",
        status: "",
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "标签名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["formValidate"].validate((valid) => {
        if (valid) {
          if ("0" === this.operation) {
            insertTag(this.formValidate).then((res) => {
              if (res.code === 200) {
                this.$Message.success("新增成功");
                this.success();
              } else {
                this.$Message.error(res.msg || "新增失败");
              }
            });
          } else {
            modifyTag(this.formValidate).then((res) => {
              if (res.code === 200) {
                this.$Message.success("修改成功");
                this.success();
              } else {
                this.$Message.error(res.msg || "修改失败");
              }
            });
          }
        }
      });
    },
    success() {
      this.handleReset();
      this.$emit("onSuccess");
    },
    handleCancel() {
      this.handleReset();
      this.$emit("onClose");
    },
    handleReset() {
      this.$refs["formValidate"].resetFields();
    },
  },

  watch: {
    form: {
      handler(newVal) {
        if (newVal.name) {
          this.formValidate = newVal;
        }
      },
    },
  },
};
</script>
<style lang='' scoped>
</style>