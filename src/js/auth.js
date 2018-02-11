import axios from './../../node_modules/axios/dist/axios.js';

export default {

    checkUser() {

        return new Promise( (resolve, rejected) => {
            if(!localStorage.getItem('_token')) {
                rejected(false);
            }
            else {
                let token = localStorage.getItem('_token')
                axios.get('/checkuser', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then( (res) => {
                    console.log(res);
                    resolve(res.data);
                })
                .catch( (err) => {
                    console.log(err);
                });
            }
        });

    }

}
