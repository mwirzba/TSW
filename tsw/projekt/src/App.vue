<template>
    <div class="container">
        <app-header></app-header>
        <div class="main">
            <servers></servers>
            <server-actions></server-actions>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
import Header from "@/components/Common/Header.vue";
import Footer from "@/components/Common/Footer.vue";

export default {
    components: {
        appHeader: Header,
        appFooter: Footer
    }
};
</script>

<style lang="scss">
body {
    margin: 0;
    .main {
        background-color: lightyellow;
        display: grid;
        grid-template-columns: 17em auto;
    }
}
</style>
