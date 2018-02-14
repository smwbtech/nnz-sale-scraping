import variables from './css/variables.css';
import normalize from './css/normalize.css';
import css from './css/style.css';
import Vue from './../node_modules/vue/dist/vue.js';
import Router from './../node_modules/vue-router/dist/vue-router.js';
import auth from './js/auth.js';
import axios from './../node_modules/axios/dist/axios.js';

//компоненты

import sideMenu from './vue-comp/side-menu.vue';
import sales from './vue-comp/sales.vue';
import login from './vue-comp/login.vue';
import schema from './vue-comp/schema.vue';

Vue.use(Router);

const router = new Router({
    routes: [

        {
            path: '/login',
            component: login
        },

        {
            path: '/',
            component: sales,
            meta: {
                requiredAuth: true
            }
        },

        {
            path: '/schema',
            component: schema,
            meta: {
                requiredAuth: true
            }
        }



    ],

    mode: 'history'

});

//Проверка авторизации
router.beforeEach((to, from, next) => {
    if (to.meta.requiredAuth) {
        console.log(1);
        auth.checkUser()
        .then( (res) => {
            console.log(res);
            if (!res) {
                app.authorized = false;
                next({
                       path: '/login',
                });
            }
            else {
                app.authorized = true;
                next();
            }
        })
        .catch( err => {
            console.log(err);
            app.authorized = false;
            next({
               path: '/login',
            });
        });
  }
    else {
        next();
    }
});


let app = new Vue({

    router,

    components: {
        'side-menu': sideMenu,
        'sales': sales,
        'login': login,
        'schema': schema
    },

    data: {
        authorized: false
    },

}).$mount('#app');
