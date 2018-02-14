<template lang="html">

    <div class="schema">

        <aside-search>

        </aside-search>

        <div class="schema-create">

            <div class="schema-create-block">

                <h2>Создание шаблона</h2>
                <input class="schema-create-block__title" type="text" name="" id="" placeholder="Название шаблона" v-model="title">
                <input class="schema-create-block__article" type="text" name="" id="" placeholder="Артикул товара" v-model="article">
                <label class="schema-create-block__label" for="source">Выберите источник:</label>
                <select class="schema-create-block__select" name="source" id="source" v-model="source">
                    <option  v-for="item in resources" :value="item">{{item}}</option>
                </select>
                <input class="schema-create-block__submit" type="submit" value="Сгенерировать" v-if="stage === 1" @click.prevent="generateSchemaHanler">
                <loading v-if="stage === 2"></loading>
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

                        <button class="feature-add" type="button" name="button" @click="addFeatureHandler"></button>

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

                <button type="button" name="button" class="schema-create-block__submit" v-if="stage === 3" @click="saveSchemaHandler">Сохранить</button>

            </div>

        </div>

        <flash-message :message="flashMsg">

        </flash-message>

    </div>

</template>

<script>

import axios from './../../node_modules/axios/dist/axios.js';
import {Swappable} from '@shopify/draggable';
import validation from './../js/validation.js';

//Компоненты
import feature from './interface/feature-list-item.vue';
import search from './interface/schema-aside.vue';
import loading from './interface/loading-indicator.vue';
import flashMessage from './interface/flash-message.vue';

export default {

    components: {
        'feature': feature,
        'aside-search' : search,
        'loading': loading,
        'flash-message': flashMessage
    },

    data() {
        return {
            stage: 1,
            title: '',
            article: '',
            resources: [
                'ipc2u.ru'
            ],
            source: 'ipc2u.ru',
            nnzFeatures: [],
            siteFeatures: [],
            flashMsg: ''

        }
    },

    created() {
        //TODO: delete
        // let testA = [
        //     {description: 'aaaaa', edit: false, id: '1nnz'},
        //     {description: 'bbbb', edit: false, id: '2nnz'},
        //     {description: 'cccc', edit: false, id: '3nnz'},
        //     {description: 'vvvv', edit: false, id: '4nnz'},
        //     {description: 'gggg', edit: false, id: '5nnz'},
        //     {description: 'dddd', edit: false, id: '6nnz'},
        //     {description: 'ssss', edit: false, id: '7nnz'},
        // ];
        //
        // let testB = [
        //     {description: 'aaaaa', edit: false, id: '1site'},
        //     {description: 'bbbb', edit: false, id: '2site'},
        //     {description: 'cccc', edit: false, id: '3site'},
        //     {description: 'vvvv', edit: false, id: '4site'},
        //     {description: 'gggg', edit: false, id: '5site'},
        //     {description: 'dddd', edit: false, id: '6site'},
        //     {description: 'ssss', edit: false, id: '7site'},
        // ];
        //
        // this.nnzFeatures = testA;
        // this.siteFeatures = testB;
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

        //flashMessage
        showFlashMessage(msg) {
            let vm = this;
            this.flashMsg = msg;
            setTimeout( () => vm.flashMsg = '', 8000);
        },

        //Получаем данные для создания шаблона
        generateSchemaHanler() {
            if(validation.checkArticle(this.article)) {

                this.stage = 2;
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
                    this.stage = 3;
                })
                .catch( (err) => console.log(err));

            }
            else {
                let msg = "Поле артикул должно быть заполнено. Допускаются только цифры, длинна значения не менее 5 символов";
                this.showFlashMessage(msg);
            }
        },

        //Добавляем свойство
        addFeatureHandler() {
            this.nnzFeatures.push({
                description: 'Новое свойство',
                edit: false,
                id: this.nnzFeatures.length + 'nnz'
            });
        },

        //Удаляем свойство
        deleteFeatureHandler(id) {
            this.nnzFeatures = this.nnzFeatures.filter( v => v.id !== id);
        },

        //Сохраняем схему
        saveSchemaHandler() {
            if(this.title.length > 0) {
                let token = localStorage.getItem('_token');
                let nnzFeatures = document.querySelectorAll('.schema-create-features-nnz .feature-item input');
                let siteFeatures = document.querySelectorAll('.schema-create-features-site .feature-item input');
                let regExpArr = Array.prototype.slice.call(siteFeatures, 0, nnzFeatures.length);
                let schema = {
                    name: this.title,
                    pattern: {}
                };

                for(let i = 0; i < nnzFeatures.length; i++) {
                    schema.pattern[nnzFeatures[i].value] = regExpArr[i].value;
                }

                axios({
                    method: 'post',
                    url: '/saveschma',
                    data: schema,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then( (res) => {
                    console.log(res);
                    if(res.data.success) {
                        let msg = 'Схема успешно сохранена в базе данных';
                        this.showFlashMessage(msg);
                    }
                    else {
                        let msg = res.data.data;
                        this.showFlashMessage(msg);
                    }
                })
                .catch( (err) => {
                    let msg = 'Ошибка соединения с сервером';
                    this.showFlashMessage(msg);
                });
            }
            else {
                let msg = "Поле название шаблона должно быть заполнено";
                this.showFlashMessage(msg);
            }
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
        -webkit-transition: all .3s ease-in;
        -o-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .schema-create-block {
        margin-bottom: 40px;
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

    .schema-create-block__title,
    .schema-create-block__article {
        width: 100%;
        border: none;
        border-bottom: 1px solid var(--marine);
        margin-bottom: 40px;
        padding-bottom: 10px;
    }

    .schema-create-block__label,
    .schema-create-block__select {
        display: inline-block;
        margin-right: 40px;
    }

    .schema-create-block__select {
        background-color: #fff;
        border: 1px solid var(--marine);
    }

    .schema-create-block__submit {
        display: block;
        width: 40%;
        border-radius: 15px;
        border: none;
        padding: 10px 0px;
        margin: 40px auto;
        background-color: var(--green);
        color: #fff;
        box-shadow: none;
    }

    .feature-add {
        display: block;
        cursor: pointer;
        width: 50px;
        height: 50px;
        margin: 20px auto;
        border: none;
        background-color: #fff;
        background-image: url('./../img/plus.svg');
        background-position: center;
        background-repeat: no-repeat;
    }



</style>
