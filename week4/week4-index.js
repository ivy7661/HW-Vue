import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";
import ProductModal from "./ProductModal.js";
import DelProductmodal from "./DelProductmodal.js";
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
    // 這兩行拿掉移去內層使用
    // this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    // this.delModalProduct = new bootstrap.Modal(this.$refs.delProductModal);

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
          // this.modalProduct.hide();
          this.$refs.pModal.closeModal();

          // this.tempProduct = {};
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 從這個方法，跳到 ref="pModal"，再去呼叫子元件的openModal()
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        // this.modalProduct.show();
        this.$refs.pModal.openModal();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        this.tempProduct.imagesUrl = [];
        this.isNew = false;
        // this.modalProduct.show();
        this.$refs.pModal.openModal();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        // this.delModalProduct.show();
        this.$refs.delModal.openDelModal();
      }
    },

    delProduct() {
      const url = `${this.site}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          // this.delModalProduct.hide();
          this.$refs.delModal.closeDelModal();
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
    DelProductmodal,
  },
}).mount("#app");
