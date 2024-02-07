import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = "https://ec-course-api.hexschool.io/v2";

createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${site}/admin/signin`, this.user)
        .then((res) => {
          console.log(res);
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `hexVueToken=${token}; expires=${new Date(
            expired
          )}`;
          // // P.S:若取回的expired為10碼請自行*1000
          window.location = "week2-index.html";
        })
        .catch((error) => {
          console.dir(error);
        });
    },
  },
}).mount("#app");
