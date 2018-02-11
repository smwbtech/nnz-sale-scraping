import variables from './css/variables.css';
import normalize from './css/normalize.css';
import css from './css/style.css';
import Vue from './../node_modules/vue/dist/vue.js';
import Router from './../node_modules/vue-router/dist/vue-router.js';
import auth from './js/auth.js';

//компоненты

import sideMenu from './vue-comp/side-menu.vue';
import sales from './vue-comp/sales.vue';
import login from './vue-comp/login.vue';

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

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // этот путь требует авторизации, проверяем залогинен ли
//     // пользователь, и если нет, перенаправляем на страницу логина
//     if (!auth.loggedIn()) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // всегда так или иначе нужно вызвать next()!
//   }
// })

let app = new Vue({

    router,

    components: {
        'side-menu': sideMenu,
        'sales': sales,
        'login': login
    },

    data: {
        authorized: false
    },

}).$mount('#app');
