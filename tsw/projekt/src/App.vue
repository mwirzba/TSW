<template>
  <div id="app">
    <div class="container">
      <app-nav-bar></app-nav-bar>
      <div class="main">
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
