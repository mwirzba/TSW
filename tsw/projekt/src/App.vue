<template>
  <div id="app">
    <div class="main-container">
      <app-nav-bar></app-nav-bar>
      <div class="body-container">
        <router-view :key="$route.path"></router-view>
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
        grid-template-columns: 10% 80% 10%;
        justify-content: center;
    }

    input {
        border-radius: 4px;
        padding: 10px;
    }

    input:focus {
        border-radius: 4px;
        border: 3px solid #555;
    }

    button {
        border: none;
        padding: 20px;
        background-color: #5199FF;
        display: inline-block;
    }
    button:active {
        padding: 20px;
        background-color: #0260E8;
    }

}
</style>
