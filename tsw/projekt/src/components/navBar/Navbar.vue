
<template>
    <div class="container" >
        <div class="navbar-flex">
            <ul class="navbar-links">
                <li class="navbar-link"><a>Home</a></li>
                <li class="navbar-link"><a>News</a></li>
                <li class="navbar-link"><a>Contact</a></li>
                <li class="navbar-link">
                  <router-link  :to="{ name: 'chat' }">Chat</router-link>
                </li>
            </ul>
            <ul class="navbar-auth">
                <router-link  :to="{ name: 'register' , params: { loginMode: false } }">Register</router-link>
                <li class="navbar-link"><a>
                    <router-link v-if="loginMode" :to="{ name: 'login' , params: { loginMode: true } }">Login</router-link>
                    <button v-else v-on:click="logOut">Logout</button>
                </a></li>
            </ul>
        </div>
    </div>
</template>

<script src="./navbar.js"></script>
<style src="./navbar.scss" lang="scss"/>
