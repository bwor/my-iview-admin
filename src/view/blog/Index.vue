<template>
  <div>
    <Card>
      <Button type="primary" class="mb_10" @click.stop="handleAdd">新增</Button>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{row}" slot="tag">
          <span>{{row.tag&&row.tag[0]&&row.tag[0].name}}</span>
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
        </template>
      </Table>
    </Card>
  </div>
</template>
<script>
import { getBlogList, modifyBlog } from "@/api/blog";
export default {
  name: "blog_list",
  data() {
    return {
      columns: [
        {
          title: "标题",
          key: "title",
          minWidth: 50,
        },
        {
          title: "分类",
          slot: "tag",
          minWidth: 150,
        },
        {
          title: "是否启用",
          slot: "status",
          minWidth: 10,
          align: "center",
        },
        {
          title: "日期",
          key: "release_time",
          minWidth: 50,
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
    };
  },
  mounted() {
    this._getBlogList();
  },
  activated() {
    this._getBlogList();
  },
  methods: {
    _getBlogList() {
      getBlogList().then((res) => {
        if (res.code === 200) {
          this.data = res.data.list;
        }
      });
    },
    handleAdd() {
      this.$router.push({ name: "blog_content", params: { content: "" } });
    },
    handleChange(row) {
      console.log(row);
      modifyBlog(row).then((res) => {
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
      this.$router.push({ name: "blog_content", params: { content: row } });
    },
  },
};
</script>
<style lang="less" scoped>
.mb_10 {
  margin-bottom: 10px;
}
</style>