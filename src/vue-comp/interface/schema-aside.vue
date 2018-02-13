<template lang="html">

    <aside class="schema-menu">
        <input type="text" name="" id="">

        <template v-if="schemas.length == 0">
            <p>Вы не создали ни одной схемы</p>
        </template>

        <template v-else>
            <div class="schema-search-item" v-for="(item, index) in schemas">
                <p>{{item.title}}</p>
                <button class="schema-search-item__edit"></button>
                <button class="schema-search-item__delete"></button>
            </div>
        </template>

    </aside>

</template>

<script>
export default {

    data() {
        return {
            schemas: []
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

</style>
