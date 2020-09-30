<template>
  <div>
    <Card>
      <Button type="primary" class="mb_10" @click.stop="handleAdd">新增</Button>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="status">
          <i-switch
            v-model="row.status"
            :true-value="1"
            :false-value="0"
            @on-change="handleChange(row)"
          />
        </template>
        <template slot-scope="{ row }" slot="action">
          <Icon type="md-create" @click="handleModify(row)"></Icon>
          <Icon type="md-trash" @click="handleDelete(row)"></Icon>
        </template>
      </Table>
    </Card>
    <tag-modal
      :modal="modal"
      :operation="operation"
      :form="form"
      @onSuccess="onSuccess"
      @onClose="onClose"
    ></tag-modal>
  </div>
</template>
<script>
import { getTags, deleteTag, modifyTag } from "@/api/tag";
import TagModal from "./components/TagModal";
export default {
  name: "blog_tags",
  components: { TagModal },
  data() {
    return {
      modal: false,
      form: {},
      columns: [
        {
          title: "标签名称",
          key: "name",
        },
        {
          title: "是否启用",
          slot: "status",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data: [],
      operation: "0", // 0:新增 1:修改
    };
  },
  mounted() {
    this._getTags();
  },
  methods: {
    _getTags() {
      getTags().then((res) => {
        if (res.code === 200) {
          this.data = res.data.tags;
        }
      });
    },
    // 新增
    showModal() {
      this.modal = true;
    },
    onSuccess() {
      this.onClose();
      this._getTags();
    },
    onClose() {
      this.modal = false;
    },
    handleAdd() {
      this.operation = "0";
      this.showModal();
    },
    handleChange(row) {
      console.log(row);
      modifyTag(row).then((res) => {
        if (res.code === 200) {
          this.$Message.success("修改成功");
          this._getTags();
        } else {
          row.status = row.stauts === 1 ? 0 : 1;
          this.$Message.error(res.msg || "修改失败");
        }
      });
    },
    handleModify(row) {
      this.operation = "1";
      this.form = { ...row };
      this.showModal();
    },
    handleDelete(row) {
      const content = `您确定要删除${row.name}标签吗?`;
      this.$Modal.confirm({
        title: "删除数据",
        content,
        onOk: () => {
          deleteTag(row).then((res) => {
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this._getTags();
            } else {
              this.$Message.error(res.msg || "删除失败");
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mb_10 {
  margin-bottom: 10px;
}
</style>