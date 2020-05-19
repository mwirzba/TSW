<template>
  <div id="app">
    <div class="main-container">
      <app-nav-bar></app-nav-bar>
      <div class="body-container">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import Footer from "./components/footer/Footer.vue";
import NavBar from "./components/navBar/Navbar.vue";
export default {
    components: {
        appFooter: Footer,
        appNavBar: NavBar
    }
};
</script>

<style lang="scss">
#app {
    .main-container{
        height: 100vh;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100px auto 50px;
    }
    .body-container {
        background-color: white;
        width: 100%;
        display: grid;
        grid-template-columns: 80%;
        justify-content: center;
    }
}
</style>
