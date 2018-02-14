<template lang="html">

    <div class="schema-search-item">
        <p class="schema-search-item__title">{{item.name}}</p>
        <button class="schema-search-item__edit" @click="edit"></button>
        <button class="schema-search-item__copy"></button>
        <button class="schema-search-item__delete"></button>
    </div>

</template>

<script>
export default {

    props: ['schema'],

    data() {
        return {
            item: this.schema,
            id: this.schema._id
        }
    },

    methods: {
        edit() {
            this.$emit('edit-schema', this.id);
        }
    }

}
</script>

<style lang="css">

    .schema-search-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 10px;
    }

    .schema-search-item__title {
        width: 60%;
        font-size: .8rem;
    }

    .schema-search-item__edit,
    .schema-search-item__copy,
    .schema-search-item__delete {
        display: block;
        width: 20px;
        height: 20px;
        border: none;
        background-color: #ccc;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
    }

    .schema-search-item__edit {
        background-image: url('./../../img/edit.svg');
    }

    .schema-search-item__copy {
        background-image: url('./../../img/copy.svg');
    }

    .schema-search-item__delete {
        background-image: url('./../../img/garbage.svg');
    }

</style>
