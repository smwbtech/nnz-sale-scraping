export default {

    //Валидация артикула в разделе Схемы
    checkArticle(art) {
        let pattern = /\d{5,}/i;
        return pattern.test(art);
    },

}
