<template>
  <div>
    <Card>
      <Button type="primary" class="mb_10" @click.stop="showModal">新增</Button>
      <Table border :columns="columns" :data="data"></Table>
    </Card>
    <Modal v-model="modal" title="社交">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Icon名称" prop="pic">
          <Input v-model="formValidate.pic" placeholder="请输入你的icon名称" />
        </FormItem>
        <FormItem label="url" prop="url">
          <Input v-model="formValidate.url" placeholder="请输入社交网站的url" />
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
import {
  getSocial,
  insertSocial,
  modifySocial,
  deleteSocial,
} from "@/api/social";
export default {
  name: "social-page",
  data() {
    return {
      modal: false,
      columns: [
        {
          title: "icon",
          key: "pic",
        },
        {
          title: "社交链接",
          key: "url",
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "md-create",
                },
                style: {
                  marginRight: "5px",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.handleModify(params);
                  },
                },
              }),
              h("Icon", {
                props: {
                  type: "md-trash",
                },
                style: {
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.handleDelete(params);
                  },
                },
              }),
            ]);
          },
        },
      ],
      data: [],
      operation: "0", // 0:新增 1:修改
      formValidate: {
        pic: "",
        url: "",
      },
      ruleValidate: {
        pic: [
          {
            required: true,
            message: "icon名称不能为空",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "社交路径不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this._getSocial();
  },
  methods: {
    _getSocial() {
      getSocial().then((res) => {
        if (res.code === 200) {
          this.data = res.data.social;
        }
      });
    },
    // 新增
    showModal() {
      this.modal = true;
    },
    hidemodal() {
      this.modal = false;
    },
    handleAdd() {
      this.operation = "0";
      this.showModal();
    },
    handleModify({ row }) {
      this.operation = "1";
      this.formValidate = { ...row };
      this.showModal();
    },
    handleDelete({ row }) {
      const content = `您确定要删除icon为:${row.pic},链接为:${row.url}的数据吗?`;
      this.$Modal.confirm({
        title: "删除数据",
        content,
        onOk: () => {
          deleteSocial(row).then((res) => {
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this.success();
            } else {
              this.$Message.error(res.msg || "删除失败");
            }
          });
        },
      });
    },
    handleSubmit() {
      this.$refs["formValidate"].validate((valid) => {
        if (valid) {
          if ("0" === this.operation) {
            insertSocial(this.formValidate).then((res) => {
              if (res.code === 200) {
                this.$Message.success("新增成功");
                this.success();
              } else {
                this.$Message.error(res.msg || "新增失败");
              }
            });
          } else {
            modifySocial(this.formValidate).then((res) => {
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
    handleCancel() {
      this.hidemodal();
      this.handleReset();
    },
    success() {
      this.handleReset();
      this.hidemodal();
      this._getSocial();
    },
    handleReset() {
      this.$refs["formValidate"].resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.mb_10 {
  margin-bottom: 10px;
}
</style>