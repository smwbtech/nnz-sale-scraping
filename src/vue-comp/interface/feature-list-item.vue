<template lang="html">

    <div class="feature-item" :id="featureId">
        <input
            type="text"
            name="feature"
            class="feature-item__name"
            :value="name"
            :readonly="!isEditable"
        >
        <button v-if="isEditable" class="feature-item__delete" @click="deleteHandler"></button>
    </div>

</template>

<script>
export default {

    props: ['iseditable', 'description', 'featureid', 'edit'],

    data() {
        return {
            isEditable: this.iseditable,
            name: this.description,
            featureId: this.featureid,
            currentEdit: this.edit
        }
    },

    methods: {
        //Удаляем запись
        deleteHandler() {
            this.$emit('delete-feature', this.featureId);
        }
    }


}
</script>

<style lang="css">

    @import './../../css/variables.css';

    .feature-item {
        display: flex;
        justify-content: space-between;
        margin: 20px auto;
        width: 90%;
        min-height: 50px;
        -webkit-box-shadow: 1px 4px 6px rgba(0,143,159,.4);
        box-shadow: 1px 4px 6px rgba(0,143,159,.4);
        padding: 10px;
    }

    .draggable-mirror.feature-item {
        max-width: 400px;
        -webkit-box-shadow: 0px 0px 6px rgba(0,143,159,.8);
        box-shadow: 0px 0px 6px rgba(0,143,159,.8);
    }

    .feature-item__name {
        width: 70%;
        border: none;
        background-color: rgba(255,255,255,0);
    }

    .feature-item__delete {
        display: block;
        width: 30px;
        height: 30px;
        background: #fff;
        border: none;
        background-image: url('./../../img/delete.svg');
        background-position: center;
        background-repeat: no-repeat;
    }

</style>
