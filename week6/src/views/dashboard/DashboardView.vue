<template>
  <h2>這是後台</h2>
  <nav>
    <RouterLink to="/admin/products">產品列表</RouterLink> |
    <RouterLink to="/admin/order">訂單列表</RouterLink> |
    <RouterLink to="/">回到前台</RouterLink> |
  </nav>
  <routerView></routerView>
</template>

<script>
// 後台每頁都要驗證，因為子路由都會通過admin，因此可以只在這頁做就好
import axios from 'axios'
const { VITE_API_URL } = import.meta.env
export default {
  data () {
    return {
      site: 'https://ec-course-api.hexschool.io/v2',
      api_path: 'js23',
      products: [],
      tempProduct: {}
    }
  },
  methods: {
    checkLogin () {
      const url = `${VITE_API_URL}/api/user/check`
      axios
        .post(url)
        .then((res) => {
          console.log('驗證成功：', res.data.success)
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.$router.push('/login')
        })
    }
  },
  mounted () {
    // 取出先前存在cookie內的token，參數內的名稱要跟剛才在login.js設的相同(hexVueToken)
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    // console.log(token);
    // 進行全域性 token 預設
    axios.defaults.headers.common.Authorization = token
    this.checkLogin()
  }
}
</script>
