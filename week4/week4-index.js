import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";
import ProductModal from "./ProductModal.js";
createApp({
  data() {
    return {
      site: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "js23",
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pages: {},
      modalProduct: null,
      delModalProduct: null,
      isNew: false,
    };
  },
  mounted() {
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    this.delModalProduct = new bootstrap.Modal(this.$refs.delProductModal);

    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.site}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    },
    //參數預設值：沒帶入參數時，預設值是1
    getData(page = 1) {
      const url = `${this.site}/api/${this.apiPath}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          console.log(response);
          this.products = response.data.products;
          this.pages = response.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    updateProduct() {
      let url = `${this.site}/api/${this.apiPath}/admin/product`;
      let http = "post";

      if (!this.isNew) {
        url = `${this.site}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }

      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          this.getData();
          this.modalProduct.hide();
          // this.tempProduct = {};
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.modalProduct.show();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        this.tempProduct.imagesUrl = [];
        this.isNew = false;
        this.modalProduct.show();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        this.delModalProduct.show();
      }
    },

    delProduct() {
      const url = `${this.site}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          this.delModalProduct.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  // 區域註冊
  components: {
    pagination,
    ProductModal,
  },
}).mount("#app");
