<template lang="html">

  <section class="login">

      <form action="" class="login-form" @submit.prevent="loginHandler">
          <input class="login-form__input"type="text" name="login" id="" placeholder="Логин" v-model="login" required>
          <input class="login-form__input"type="password" name="password" id="" placeholder="Пароль" v-model="password" required>
          <input class="login-form__submit"type="submit" value="Войти">
          <p v-show="flashMsg.length > 0">{{flashMsg}}</p>

      </form>

  </section>

</template>

<script>
import axios from './../../node_modules/axios/dist/axios.js';

export default {

    data() {
        return {
            login: '',
            password: '',
            flashMsg: ''
        }
    },

    methods: {

        //Логин
        loginHandler() {

            let userData = {
                login: this.login,
                password: this.password
            };

            axios.post('/login', userData)
            .then( (res) => {
                console.log(res);
                if(res.data.status) {
                    localStorage.setItem('_token', res.data.message);
                    this.$router.replace('/');
                }
                else {
                    this.flashMessage = res.data.message;
                }
            })
            .catch( (err) => console.log(err));
        }

    }


}
</script>



<style lang="css">

    @import './../css/variables.css';

    .login {
        width: 100%;
        min-height: 100vh;
        background-image: url('./../img/background.jpg');
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-form {
        width: calc(var(--column) * 12);
        padding: 20px;
        border-radius: 15px;
        background-color: rgba(255,255,255, .65);
        -webkit-box-shadow: 5px 5px 10px rgba(0,0,0,.1);
        box-shadow: 5px 5px 10px rgba(0,0,0,.1);
    }

    .login-form__input,
    .login-form__submit {
        display: block;
        margin: 40px auto;
        width: 60%;
        text-align: center;
        border: none;
        background-color: rgba(0,0,0,0);
    }

    .login-form__input {
        border-bottom: 2px solid var(--marine);
    }

    .login-form__submit {
        width: 40%;
        border-radius: 15px;
        padding: 10px 0px;
        background-color: var(--marine);
        color: #fff;
    }

</style>
