<template lang="html">

    <div class="sale">
        <p class="sale-info"></p>

        <div class="sale-controls">
            <label v-show="stage === 1" class="sale-controls__load-btn" for="tablefile">Загрузить файл</label>
            <input class="sale-controls__file" type="file" name="tablefile" id="tablefile" @change="loadFileHandler">
            <div v-show="stage === 2" class="sale-progressbar">
                <div class="sale-progressbar__progress"></div>
                <div class="sale-progressbar__bg"></div>
            </div>
            <div v-show="stage === 3" class="sale-controls-link">
                <a :href="link">{{link}}</a>
            </div>
        </div>
    </div>

</template>

<script>

import axios from './../../node_modules/axios/dist/axios.js';

export default {

    data() {
        return {
            stage: 1,
            link: ''
        }
    },

    methods: {
        //Загрузка файла
        loadFileHandler(e) {
            // TODO: валидация на верный формат
            console.log(e.target.files[0]);
            let file = e.target.files[0];
            if(file) {
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                let formData = new FormData();
                formData.append('tablefile', file, file.name);
                this.stage = 2;
                axios.post('/getsales', formData, config)
                .then( (res) => console.log(res))
                .catch( (err) => console.log(err));
            }
        }
    }

}
</script>

<style lang="css">

@import './../css/variables.css';

.sale {
    padding-left: var(--column);
    display: flex;
    flex-flow: column;
    width: 100%;
    min-height: 100%;
}

.sale-controls {
    position: relative;
    width: 100%;
}

.sale-controls__load-btn {
    position: absolute;
    left: 35%;
    top: 0%;
    width: 30%;
    height: var(--row);
    padding: 10px;
    border-radius: 15px;
    text-align: center;
    background-color: var(--marine);
    color: #fff;
}

.sale-controls__file {
    display: none;
}

.sale-progressbar {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 15px;
    background-color: #fff;
    height: var(--row);
    overflow: hidden;
}

.sale-progressbar__progress {
    width: 0;
    height: 100%;
    background-color: var(--green);
}



</style>
