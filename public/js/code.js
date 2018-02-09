window.onload = () => {

    let formElem = document.forms[0];

    formElem.addEventListener('submit', submitHandler);

    function submitHandler(e) {
        e.preventDefault();
        let fileList = e.target.tablefile.files;
        if(fileList.length <= 0) {
            //TODO: сообщение о том что файлы должен быть загружен!
            console.log('Flash Message: choose file!');
        }
        else {
            let formData = new FormData(e.target);
            let config = {
                'content-type' : 'multipart/form-data'
            }
            axios.post('/sendfile', formData, config)
            .then( (res) => {
                console.log(res);
            })
            .catch( (err) => {
                console.log(err);
            })
        }
    }

};
