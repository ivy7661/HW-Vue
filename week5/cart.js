import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";
const apiUrl = "https://ec-course-api.hexschool.io/v2";
const apiPath = "js23";

const userModal = {
  props: ["tempProduct", "addToCart"],
  data() {
    return {
      productModal: null,
      qty: 1,
    };
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
  methods: {
    open() {
      this.productModal.show();
    },
    close() {
      this.productModal.hide();
    },
  },
  watch: {
    // 每次加完購物車後，其他商品下拉選單的值變回預設1
    tempProduct() {
      this.qty = 1;
    },
  },
  template: `#userProductModal`,
};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      status: {
        addCartLoading: "",
        cartQtyLoading: "",
      },
      carts: {},
    };
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        console.log(res);
        this.products = res.data.products;
      });
    },
    openModal(product) {
      this.tempProduct = product;
      this.$refs.userModal.open();
    },
    // product_id,qty 是文件要求要帶入的
    //參數預設值
    addToCart(product_id, qty = 1) {
      const order = {
        product_id,
        qty,
      };
      // console.log(order);
      // loading
      this.status.addCartLoading = product_id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: order })
        .then((res) => {
          console.log(res);
          this.status.addCartLoading = "";
          this.getCart(); //加完購物車下方也要連動
          this.$refs.userModal.close();
        });
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        console.log(res);
        this.carts = res.data.data;
        // console.log(this.carts);
      });
    },
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product_id,
        qty,
      };
      // console.log(order);
      // loading
      this.status.cartQtyLoading = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: order })
        .then((res) => {
          console.log(res);
          this.status.cartQtyLoading = "";
          this.getCart(); //加完購物車下方也要連動
          // this.$refs.userModal.close();
        });
    },
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      // 建議寫好後先把axios部分註解起來，再點按鈕測試，因為觸發ajax後資料會有更動，如果送錯會很麻煩
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res) => {
        console.log(res);
        this.status.cartQtyLoading = "";
        this.getCart(); //加完購物車下方也要連動
        // this.$refs.userModal.close();
      });
    },
  },
  components: {
    userModal,
  },
});

app.mount("#app");
