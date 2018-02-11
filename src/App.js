import variables from './css/variables.css';
import css from './css/style.css';
import Vue from './../node_modules/vue/dist/vue.js';
import Router from './../node_modules/vue-router/dist/vue-router.js';

//компоненты

import menu from './vue-comp/menu.vue';
import sales from './vue-comp/sales.vue';

Vue.use(Router);

const router = new Router({
    routes: [

        {
            path: '/',
            component: sales
        }

    ],

    mode: 'history'

});

let app = new Vue({

    router,

    components: {
        'sales': sales
    },

    data: {

    },

}).$mount('#app');
