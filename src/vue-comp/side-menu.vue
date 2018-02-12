<template lang="html">

    <aside class="menu">
        <nav class="menu-nav">
            <ul>
                <li><router-link to="/">РАСПРОДАЖА</router-link></li>
                <li><router-link to="/schema">ШАБЛОНЫ</router-link></li>
                <li><router-link to="/features">ХАРАКТЕРИСТИКИ</router-link></li>
            </ul>
        </nav>
    </aside>

</template>

<script>
export default {
}
</script>

<style lang="css">

    @import './../css/variables.css';

    .menu {
        width: calc(var(--column) * 5);
        height: 100vh;
        position: relative;
    }

    .menu-nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: inherit;
        height: 100%;
        padding-top: calc(var(--row) * 4);
        background-image: linear-gradient(to bottom, #203756, #465E7E);
    }

    .menu-nav ul {
        list-style: none;
    }

    .menu-nav li {
        display: block;
    }

    .menu-nav a {
        display: block;
        padding: 20px 10px 20px 40px;
        text-decoration: none;
        color: #fff;
        background-color: rgba(0,143,159,0);
        -webkit-transition: background-color .2s ease-in-out;
        -o-transition: background-color .2s ease-in-out;
        transition: background-color .2s ease-in-out;
    }

    .menu-nav a:hover {
        background-color: rgba(0,143,159,1);
    }


</style>
