<template lang="html">

    <div class="sale">
        <p class="sale-info"></p>

        <div class="sale-controls">
            <label v-show="stage === 1" class="sale-controls__load-btn" for="tablefile">Загрузить файл</label>
            <input class="sale-controls__file" type="file" name="tablefile" id="tablefile" @change="loadFileHandler">
            <div v-show="stage === 2" class="sale-progressbar">
                <div :style="{width: progress.current / progress.total * 100 +'%'}" class="sale-progressbar__progress"></div>
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
            link: '',
            progress: {
                total: 0,
                current: 0
            }
        }
    },

    methods: {
        //Загрузка файла
        loadFileHandler(e) {
            // TODO: валидация на верный формат
            let vm = this;
            let file = e.target.files[0];
            if(file) {
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                let formData = new FormData();
                formData.append('tablefile', file, file.name);
                this.stage = 2;
                axios.post('/getsales', formData, config)
                .then( (res) => {

                    let barId = res.data.bar;
                    console.log(barId);
                    let intervalId = setInterval( () => {
                        axios.get(`/salesprogress?id=${barId}`)
                        .then( (res) => {
                            console.log(vm);
                            console.log(vm.progress);
                            if(res.data.current === res.data.total) {
                                vm.progress.current = res.data.current;
                                clearInterval(intervalId);
                            }
                            else {
                                vm.progress.current = res.data.current;
                                vm.progress.total = res.data.total;
                            }

                        })
                        .catch( (err) => {
                            console.log(err);
                        })
                    }, 1000)

                })
                .catch( (err) => {
                    console.log(err)
                });
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
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
}



</style>
