<template>
  <div>
    <Card>
      <Button type="primary" class="mb_10" @click.stop="handleAdd">新增</Button>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{row}" slot="isOffical">
          <span>{{row.isOffical | label}}</span>
        </template>
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
    <link-modal
      :modal="modal"
      :operation="operation"
      :form="form"
      @onSuccess="onSuccess"
      @onClose="onClose"
    ></link-modal>
  </div>
</template>
<script>
import { getLinks, deleteLink } from "@/api/link";
import LinkModal from "./components/LinkModal";
export default {
  name: "blog_links",
  components: { LinkModal },
  data() {
    return {
      modal: false,
      form: {},
      columns: [
        {
          title: "网站名称",
          key: "name",
          minWidth: 50,
        },
        {
          title: "网站地址",
          key: "link",
          minWidth: 150,
        },
        {
          title: "是否官方",
          slot: "isOffical",
          minWidth: 10,
          align: "center",
        },
        {
          title: "是否启用",
          slot: "status",
          minWidth: 10,
          align: "center",
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
    this._getLinks();
  },
  filters: {
    label: (val) => {
      console.log(val);
      return val === 1 ? "是" : "否";
    },
  },
  methods: {
    _getLinks() {
      getLinks().then((res) => {
        if (res.code === 200) {
          this.data = res.data.links;
        }
      });
    },
    // 新增
    showModal() {
      this.modal = true;
    },
    onSuccess() {
      this.onClose();
      this._getLinks();
    },
    onClose() {
      this.modal = false;
    },
    handleAdd() {
      console.log("add");
      this.operation = "0";
      this.showModal();
    },
    handleChange(row) {
      console.log(row);
      modifyTag(row).then((res) => {
        if (res.code === 200) {
          this.$Message.success("修改成功");
          this._getLinks();
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
      const content = `您确定要删除${row.name}链接吗?`;
      this.$Modal.confirm({
        title: "删除数据",
        content,
        onOk: () => {
          deleteLink(row).then((res) => {
            if (res.code === 200) {
              this.$Message.success("删除成功");
              this._getLinks();
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