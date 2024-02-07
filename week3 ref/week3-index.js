import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      // isNew 用於表示當前 Modal 是新增或編輯 Modal，以便做後續串接 API 時的判斷
      // tempProduct 預期開啟 Modal 時會代入的資料，在 Modal 顯示單一產品內容
      site: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "js23",
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      // 用空字串""也可以
      // 這兩個是待會要拿來裝 modal 的
      modalProduct: null,
      delModalProduct: null,
      isNew: false,
    };
  },
  mounted() {
    // 建立一個給 新增、編輯 使用的Modal
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    // 建立給刪除使用的Modal
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
    getData() {
      const url = `${this.site}/api/${this.apiPath}/admin/products`;
      axios
        .get(url)
        .then((response) => {
          console.log(response);
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
      //本方法綁在Modal下方確認按鈕上

      // 預設url是新增產品
      // 注意路徑的product沒有s
      let url = `${this.site}/api/${this.apiPath}/admin/product`;
      let http = "post";

      // 注：因為先前已經點過 新增或編輯 按鈕，當時isNew就已經被重新賦值了，所以這邊可以拿來判斷現在開的modal到底是 新增還是編輯
      // 這邊進行判斷如果不是新產品，url賦值為編輯產品的
      if (!this.isNew) {
        url = `${this.site}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      // 確定完要用哪支api後就可以發請求了
      // 注：這邊http用的是物件取變數的方式
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
    // 到 openModal 設定 status, item 兩個參數
    // status 用於判斷當前點擊的是 新增 / 編輯 / 刪除 按鈕
    // item 代表的是當前點擊的產品資料
    // 利用 if 判斷，若 status 為 ‘new’，表示點擊到新增按鈕，所以清空當前的 tempProduct 內容，並將 isNew 的值改為 true，最後再開啟 productModal
    // 把產品(item)也丟進來
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.modalProduct.show();
      } else if (status === "edit") {
        // tempProduct 內容是會變動的，這邊用淺拷貝複製一份過來
        this.tempProduct = { ...item };
        // 這樣能確保無論它是否有資料，都能做新增圖片的行為
        this.tempProduct.imagesUrl = [];
        this.isNew = false;
        this.modalProduct.show();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        this.delModalProduct.show();
      }
    },
    // 刪除 API 需要取得對應產品 id 才能刪除，因為我們先前在 openModal 函式已經寫好，開啟刪除 Modal 時，就將當前產品資料傳入 tempProduct，所以這裡就可以直接使用 this.tempProduct.id 取得該產品 id，完成刪除產品功能
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
  // TA：因為新增與編輯 Modal 的介面相同，所以可以共用一個 Modal，只要利用 tempProduct 與 isNew 的資料狀態來動態調整 Modal 顯示內容即可
  // TA：由於新增跟編輯是共用一個 Modal，在串接 API 時我們也可以共用一個函式，只要利用先前設定的 isNew 變數來判斷使用者開啟的是哪個 Modal，就可以串接對應的 API
}).mount("#app");
