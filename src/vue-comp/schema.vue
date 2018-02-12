<template lang="html">

    <div class="schema">

        <aside class="schema-menu">
            <input type="text" name="" id="">
        </aside>

        <div class="schema-create">

            <div class="schema-create-block">

                <h2>Создание шаблона</h2>
                <input type="text" name="" id="" placeholder="Название шаблона" v-model="title">
                <input type="text" name="" id="" placeholder="Артикул товара" v-model="article">
                <select name="" id="" v-model="source">
                    <option  v-for="item in resources" :value="item">{{item}}</option>
                </select>
                <input type="submit" value="Сгенерировать" @click.prevent="generateSchemaHanler">
                <div class="schema-create-features">
                    <ul class="schema-create-features-nnz">
                        <li v-for="(feature, index) in nnzFeatures" :key="index +'nnz'">{{feature}}</li>
                    </ul>
                    <ul class="schema-create-features-site">
                        <li v-for="(feature,index) in siteFeatures" :key="index +'nnz'">{{feature}}</li>
                    </ul>
                </div>

            </div>

        </div>



    </div>

</template>

<script>

import axios from './../../node_modules/axios/dist/axios.js';
import {Swappable} from '@shopify/draggable';

export default {

    data() {
        return {
            title: '',
            article: '',
            resources: [
                'ipc2u.ru'
            ],
            source: 'ipc2u.ru',
            nnzFeatures: [],
            siteFeatures: []

        }
    },

    created() {

    },

    mounted() {
        const swappableNnz = new Swappable(document.querySelectorAll('.schema-create-features-nnz'), {
          draggable: 'li',
        });
        const swappableSite = new Swappable(document.querySelectorAll('.schema-create-features-site'), {
          draggable: 'li',
        });

        swappableNnz.on('swappable:start', () => console.log('swappable:start'))
        swappableNnz.on('swappable:swapped', () => console.log('swappable:swapped'));
        swappableNnz.on('swappable:stop', () => console.log('swappable:stop'));

        swappableSite.on('swappable:start', () => console.log('swappable:start'))
        swappableSite.on('swappable:swapped', () => console.log('swappable:swapped'));
        swappableSite.on('swappable:stop', () => console.log('swappable:stop'));
    },

    methods: {

        //Получаем данные для создания шаблона
        generateSchemaHanler() {
            axios.get(`/getschema?source=${this.source}&id=${this.article}`)
            .then( (res) => {
                console.log(res);
                this.nnzFeatures = res.data.nnzFeatures;
                this.siteFeatures = res.data.siteFeatures;
            })
            .catch( (err) => console.log(err));
        }

    }

}
</script>

<style lang="css">

    @import './../css/variables.css';

    .schema {
        display: flex;
        width: calc(var(--column) * 19);
        min-height: 100vh;
        background-color: var(--light-grey);
    }

    .schema-menu {
        width: calc(var(--column) * 4);
        background-color: #ccc;
    }

    .schema-create {
        width: calc(var(--column) * 15);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .schema-create-block {
        background-color: #fff;
        border-radius: 15px;
        width: 80%;
        padding: 20px;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,.1);
    }

    .schema-create-block > * {
        display: block;
        margin: 20px auto;
    }

    .schema-create-features {
        width: 100%;
        display: flex;
    }

    .schema-create-features-nnz,
    .schema-create-features-site {
        width: 50%;
        padding: 10px;
        list-style: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-flow: column;
    }

    .schema-create-features-nnz li,
    .schema-create-features-site li {
        display: block;
        padding: 10px;
        margin: 20px 0px;
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,.1);
        box-shadow: 1px 1px 4px rgba(0,0,0,.1);
        width: 80%;
        text-align: center;
    }

</style>
