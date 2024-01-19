import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      // isNew 用於表示當前 Modal 是新增或編輯 Modal，以便做後續串接 API 時的判斷
      // tempProduct 預期開啟 Modal 時會代入的資料，在 Modal 顯示單一產品內容
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "js23",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
      }
    );

    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      {
        keyboard: false,
      }
    );

    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
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
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 在 updateProduct 函式中，我們先宣告 API 網址與串接方法兩個變數，並透過 if 判斷 isNew 的值，得知當前開啟的是新增還是編輯 Modal，再動態調整這兩個變數內容
    // 接著再把這兩個變數與 tempProduct 資料代入 axios 做串接，這樣就不用分開寫兩次 axios 串接囉～
    // 串接完成後，我們再利用 hide 方法關閉 Modal，並重新取得所有產品資料，完成產品更新
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = "post";

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }

      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 到 openModal 設定 status, item 兩個參數
    // status 用於判斷當前點擊的是 新增 / 編輯 / 刪除 按鈕
    // item 代表的是當前點擊的產品資料
    // 利用 if 判斷，若 status 為 ‘new’，表示點擊到新增按鈕，所以清空當前的 tempProduct 內容，並將 isNew 的值改為 true，最後再開啟 productModal
    openModal(isNew, item) {
      if (isNew === "new") {
        // 是新的=>空的
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true; // post 或 put
        productModal.show();
      } else if (isNew === "edit") {
        // 若 status 為 ‘edit’，表示點擊到編輯按鈕，所以使用展開運算子 …item 將當前產品資料傳入 tempProduct，再將 isNew 的值改為 false，最後開啟 productModal
        // 要編輯舊的=>複製
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        // 若 status 為 ‘delete’，表示點擊到刪除按鈕，同樣使用展開運算子將產品資料傳入 tempProduct，用意是後續串接刪除 API 時，需要取得該產品的 id，最後開啟 delProductModal
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    // 刪除 API 需要取得對應產品 id 才能刪除，因為我們先前在 openModal 函式已經寫好，開啟刪除 Modal 時，就將當前產品資料傳入 tempProduct，所以這裡就可以直接使用 this.tempProduct.id 取得該產品 id，完成刪除產品功能
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          delProductModal.hide();
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
  // TA：因為新增與編輯 Modal 的介面相同，所以可以共用一個 Modal，只要利用 tempProduct 與 isNew 的資料狀態來動態調整 Modal 顯示內容即可
  // TA：由於新增跟編輯是共用一個 Modal，在串接 API 時我們也可以共用一個函式，只要利用先前設定的 isNew 變數來判斷使用者開啟的是哪個 Modal，就可以串接對應的 API
}).mount("#app");
