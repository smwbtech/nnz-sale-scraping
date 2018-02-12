<template lang="html">

    <div class="sale">
        <p class="sale-info"></p>

        <div class="sale-controls">
            <label v-show="stage === 1" class="sale-controls__load-btn" for="tablefile">Загрузить файл</label>
            <input class="sale-controls__file" type="file" name="tablefile" id="tablefile" @change="loadFileHandler">
            <div v-show="stage === 2" class="sale-progressbar">
                <p class="sale-progressbar__bg">{{ Math.round(progress.current / progress.total * 100) }}%</p>
                <div :style="{width: progress.current / progress.total * 100 +'%'}" class="sale-progressbar__progress"></div>
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
                total: 1,
                current: 1
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
                            if(res.data.current === res.data.total) {
                                vm.progress.current = res.data.current;
                                vm.link = res.data.link;
                                vm.stage = 3;
                                console.log(res.data.link);
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
    width: calc(var(--column)  * 19);
    padding-left: var(--column);
    padding-right: var(--column);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
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
    height: calc(var(--row) - 40px);
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
    height: calc(var(--row) - 40px);
    overflow: hidden;
}

.sale-progressbar__bg,
.sale-progressbar__progress {
    font-weight: bold;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;

}

.sale-progressbar__bg {
    width: 100%;
    z-index: 102;
}

.sale-progressbar__progress {
    z-index: 101;
    background-color: var(--green);
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
}

.sale-controls-link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(var(--row) - 40px);
    text-align: center;
    color: var(--marine);
}



</style>
