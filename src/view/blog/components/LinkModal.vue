<template>
  <div>
    <Modal v-model="currentMoal" :title="title" @on-cancel="handleCancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="网站名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入网站名称" />
        </FormItem>
        <FormItem label="网站地址" prop="link">
          <Input v-model="formValidate.link" placeholder="请输入网站地址" />
        </FormItem>
        <FormItem label="是否官方" prop="isOffical">
          <RadioGroup v-model="formValidate.isOffical">
            <Radio
              v-for="(item,index) in whether"
              :label="item.label"
              :key="`isOffical${index}`"
            >{{item.text}}</Radio>
          </RadioGroup>
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
import { insertLink, modifyLink } from "@/api/link";
export default {
  name: "link-modal",
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
    currentMoal: {
      get() {
        return this.modal;
      },
      set() {},
    },
    title() {
      return this.operation === "0" ? "新增链接" : "修改链接";
    },
  },
  data() {
    return {
      formValidate: {
        name: "",
        link: "",
        isOffical: 0,
        status: 0,
      },
      whether: [
        { label: 1, text: "是" },
        { label: 0, text: "否" },
      ],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "网站名称不能为空",
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
            insertLink(this.formValidate).then((res) => {
              if (res.code === 200) {
                this.$Message.success("新增成功");
                this.success();
              } else {
                this.$Message.error(res.msg || "新增失败");
              }
            });
          } else {
            modifyLink(this.formValidate).then((res) => {
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