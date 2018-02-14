<template lang="html">

    <aside class="schema-menu">
        <input class="schema-menu__search" type="text" name="" id="" placeholder="Название шаблона">

        <template v-if="schemasArr.length == 0">
            <p>Вы не создали ни одной схемы</p>
        </template>

        <template v-else>
            <aside-item
                v-for="(item, index) in schemasArr"
                :schema="item"
                :key="item._id"
                @edit-schema="editHandler"
            >

            </aside-item>
        </template>

    </aside>

</template>

<script>

import asideItem from './schema-aside-item.vue';

export default {

    props: ['schemas'],

    components: {
        'aside-item': asideItem
    },

    data() {
        return {

        }
    },

    computed: {
        schemasArr() {
            return this.schemas;
        }
    },

    methods: {
        //Редактирование шаблона
        editHandler(id) {
            this.$emit('edit', id);
        }
    }

}
</script>

<style lang="css">

@import './../../css/variables.css';

.schema-menu {
    width: calc(var(--column) * 4);
    background-color: #ccc;
}

.schema-menu__search {
    display: block;
    position: relative;
    width: 90%;
    margin: 40px auto;
    background-color: #ccc;
    border: none;
    border-bottom: 1px solid #6b6b6b;
    background-image: url('./../../img/magnifying-glass.svg');
    background-position: right center;
    background-repeat: no-repeat;
    background-size: contain;
}

</style>
