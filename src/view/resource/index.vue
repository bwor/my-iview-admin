<template>
  <div>
    <Card>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="action">
          <Icon type="md-trash" @click="handleDelete(row)"></Icon>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import { getResources } from "@/api/qiniu";
import { byteFormat } from "@/libs/util";
import config from "@/config";
export default {
  name: "",
  props: [""],
  data() {
    return {
      columns: [
        {
          title: "文件名",
          key: "key",
          render: (h, { row }) => {
            const url = `http://${config.cdn}/${row.key}`;
            if (row.mimeType.indexOf("image") !== -1) {
              return <img class="pic" src={url} />;
            } else {
              return (
                <a href={url} target="_blank">
                  {row.key}
                </a>
              );
            }
          },
        },
        {
          title: "文件类型",
          key: "mimeType",
        },
        {
          title: "文件大小",
          key: "fsize",
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
        },
      ],
      data: [],
      options: {
        limit: 10,
        prefix: "",
      },
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this._getResources();
  },

  methods: {
    _getResources() {
      getResources(this.options).then((res) => {
        if (res.code === 200) {
          const { list } = res.data;
          if (list && list.length > 0) {
            list.forEach((item) => {
              item.fsize = byteFormat(item.fsize);
            });
            this.data = list;
          } else {
            this.data = [];
          }
        }
      });
    },
    handleDelete() {},
  },

  watch: {},
};
</script>
<style lang='less'>
.pic {
  width: 200px;
  height: 100px;
  object-fit: cover;
}
</style>