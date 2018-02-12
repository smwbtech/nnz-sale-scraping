<template lang="html">

    <div class="schema">

        <aside class="schema-menu">
            <input type="text" name="" id="">
        </aside>

        <div class="schema-create">

            <div class="schema-create-block">

                <h2>Создание шаблона</h2>
                <input class="schema-create-block__title" type="text" name="" id="" placeholder="Название шаблона" v-model="title">
                <input class="schema-create-block__article" type="text" name="" id="" placeholder="Артикул товара" v-model="article">
                <select name="" id="" v-model="source">
                    <option  v-for="item in resources" :value="item">{{item}}</option>
                </select>
                <input type="submit" value="Сгенерировать" @click.prevent="generateSchemaHanler">
                <div class="schema-create-features">
                    <div class="schema-create-features-nnz">


                        <template v-if="nnzFeatures.length > 0">

                            <feature
                            v-for="(item, index) in nnzFeatures"
                            :key="item.id"
                            :iseditable="true"
                            :description="item.description"
                            :featureid="item.id"
                            :edit="item.edit"
                            @delete-feature="deleteFeatureHandler"
                            >
                        </feature>

                        </template>

                    </div>

                    <div class="schema-create-features-site">

                        <template v-if="siteFeatures.length > 0">

                            <feature
                                v-for="(item, index) in siteFeatures"
                                :key="item.id"
                                :iseditable="false"
                                :description="item.description"
                                :featureid="item.id"
                                :edit="item.edit"
                            >
                            </feature>

                        </template>


                    </div>
                </div>

            </div>

        </div>



    </div>

</template>

<script>

import axios from './../../node_modules/axios/dist/axios.js';
import {Swappable} from '@shopify/draggable';

//Компоненты
import feature from './interface/feature-list-item.vue';

export default {

    components: {
        'feature': feature
    },

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
        let testA = [
            {description: 'aaaaa', edit: false, id: '1nnz'},
            {description: 'bbbb', edit: false, id: '2nnz'},
            {description: 'cccc', edit: false, id: '3nnz'},
            {description: 'vvvv', edit: false, id: '4nnz'},
            {description: 'gggg', edit: false, id: '5nnz'},
            {description: 'dddd', edit: false, id: '6nnz'},
            {description: 'ssss', edit: false, id: '7nnz'},
        ];

        let testB = [
            {description: 'aaaaa', edit: false, id: '1site'},
            {description: 'bbbb', edit: false, id: '2site'},
            {description: 'cccc', edit: false, id: '3site'},
            {description: 'vvvv', edit: false, id: '4site'},
            {description: 'gggg', edit: false, id: '5site'},
            {description: 'dddd', edit: false, id: '6site'},
            {description: 'ssss', edit: false, id: '7site'},
        ];

        this.nnzFeatures = testA;
        this.siteFeatures = testB;
    },

    //Swappable блоки
    mounted() {
        const swappableNnz = new Swappable(document.querySelectorAll('.schema-create-features-nnz'), {
          draggable: '.feature-item',
          delay: 500
        });
        const swappableSite = new Swappable(document.querySelectorAll('.schema-create-features-site'), {
          draggable: '.feature-item',
          delay: 500
        });

        // swappableNnz.on('swappable:start', () => console.log('swappable:start'))
        // swappableNnz.on('swappable:swapped', () => console.log('swappable:swapped'));
        // swappableNnz.on('swappable:stop', () => console.log('swappable:stop'));
        //
        // swappableSite.on('swappable:start', () => console.log('swappable:start'))
        // swappableSite.on('swappable:swapped', () => console.log('swappable:swapped'));
        // swappableSite.on('swappable:stop', () => console.log('swappable:stop'));
    },

    methods: {

        //Получаем данные для создания шаблона
        generateSchemaHanler() {
            axios.get(`/getschema?source=${this.source}&id=${this.article}`)
            .then( (res) => {
                console.log(res);
                this.nnzFeatures = res.data.nnzFeatures.map( (v,i,a) => {
                    return {
                        description: v,
                        edit: false,
                        id: i + 'nnz'
                    };
                });
                this.siteFeatures = res.data.siteFeatures.map( (v,i,a) => {
                    return {
                        description: v,
                        edit: false,
                        id: i + 'site'
                    };
                });
            })
            .catch( (err) => console.log(err));
        },

        //Удаляем свойство
        deleteFeatureHandler(id) {
            console.log(id);
            this.nnzFeatures = this.nnzFeatures.filter( v => v.id !== id);
            console.log(this.nnzFeatures);
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
        padding-top: calc(var(--row) * 2);
        padding-bottom: calc(var(--row) * 2);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .schema-create-block {
        background-color: #fff;
        border-radius: 15px;
        width: 90%;
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
        -webkit-transition: all .2s ease-in-out;
        -o-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
    }



</style>
