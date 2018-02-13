<template lang="html">

    <div :class="flashMessage">
        <p class="flashMessage__text">{{text}}</p>
    </div>

</template>

<script>
export default {

    props: ['message'],

    computed: {

        text() {
            return this.message;
        },

        //Показываем сообщение, если в компонент посупил текс
        flashMessage() {
            return {
                'flashMessage' : true,
                'flashMessage_inactive': this.text.length === 0,
                'flashMessage_active': this.text.length > 0
            }
        }
    }

}
</script>

<style lang="css">


    .flashMessage {
        position: fixed;
        top: 40px;
        right: 40px;
        padding: 20px;
        width: 30%;
        background-image: linear-gradient(to bottom, #203756, #465E7E);
        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,.3);
        box-shadow: 1px 1px 4px rgba(0,0,0,.3);
        transform-origin: center;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;

    }

    .flashMessage__text {
        text-align: center;
        color:#fff;
    }

    .flashMessage_inactive {
        visibility: hidden;
        opacity: 0;
        transform: scale(0);
        transform-origin: center;
    }

    .flashMessage_active {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
        transform-origin: center;
    }





</style>
