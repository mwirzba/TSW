
<template>
    <div class="navbar-container" >
        <div class="navbar-flex">
            <ul class="navbar-links">
                <li class="navbar-link">
                    <router-link  :to="{ name: 'auctions' }">Auctions</router-link>
                </li>
                <li class="navbar-link">
                    <router-link  :to="{ name: 'newAuction' }">Add Auction</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'yourAuctions' }">Your auctions</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                  <router-link  :to="{ name: 'chat' }">Chat</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'auctionsPanel' }">Obserwowane aukcje</router-link>
                </li>
            </ul>
            <ul class="navbar-auth">
                <router-link  :to="{ name: 'register' , params: { loginMode: false } }">Register</router-link>
                <li class="navbar-link">
                    <a>
                        <router-link v-if="!logged" :to="{ name: 'login' , params: { loginMode: true } }">Login</router-link>
                        <button v-else v-on:click="logOut">Logout</button>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script src="./navbar.js"></script>
<style src="./navbar.scss" lang="scss"/>
