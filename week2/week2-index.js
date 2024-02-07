import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      site: "https://ec-course-api.hexschool.io/v2",
      api_path: "js23",
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    checkLogin() {
      const url = `${this.site}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    },
    getProducts() {
      const url = `${this.site}/api/${this.api_path}/admin/products`;
      axios
        .get(url)
        .then((response) => {
          // console.log(response.data);
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    productInfo(item) {
      this.tempProduct = item;
    },
  },
  mounted() {
    // 取出先前存在cookie內的token，參數內的名稱要跟剛才在login.js設的相同(hexVueToken)
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // console.log(token);
    // 進行全域性 token 預設
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
}).mount("#app");
