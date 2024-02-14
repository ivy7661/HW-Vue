<template>
  <h2>登入頁面</h2>
  <div class="container">
        <div class="row justify-content-center">
          <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
          <div class="col-8">
            <form class="form-signin" @submit.prevent="login">
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  v-model="user.username"
                  id="floatingInput"
                  placeholder="name@example.com"
                  required
                  autofocus
                />
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating">
                <input
                  type="password"
                  class="form-control"
                  v-model="user.password"
                  id="floatingPassword"
                  placeholder="Password"
                  required
                />
                <label for="floatingPassword">Password</label>
              </div>
              <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
                登入
              </button>
            </form>
          </div>
        </div>
        <p class="mt-5 mb-3 text-muted">&copy; 2023~∞ - 六角學院</p>
      </div>
</template>

<script>
import axios from 'axios'
const { VITE_API_URL } = import.meta.env

export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      axios
        .post(`${VITE_API_URL}/admin/signin`, this.user)
        .then((res) => {
          console.log(res)
          const { token, expired } = res.data
          document.cookie = `hexVueToken=${token}; expires=${new Date(
            expired
          )}`
          // 轉址
          this.$router.push('/admin/products')
        })
        .catch((error) => {
          console.dir(error)
        })
    }
  }
}
</script>
