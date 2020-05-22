
<template>
    <div class="navbar-container" >
        <div class="navbar-flex">
            <ul class="navbar-links">
                <li class="navbar-link">
                    <router-link  :to="{ name: 'auctions' }">Aukcje</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'newAuction' }">Dodaj Aukcje</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'yourAuctions' }">Twoje aukcje</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'auctionsPanel' }">Licytowane aukcje</router-link>
                </li>
                <li class="navbar-link" v-if="logged">
                  <router-link  :to="{ name: 'chat' }">Chat</router-link>
                </li>
            </ul>
            <ul class="navbar-auth">
                <li class="navbar-link">
                    <router-link  :to="{ name: 'register' , params: { loginMode: false } }">Rejestracja</router-link>
                </li>
                <li class="navbar-link">
                        <router-link v-if="!logged" :to="{ name: 'login' , params: { loginMode: true } }">Zaloguj się</router-link>
                        <a v-else v-on:click="logOut">Wyloguj</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script src="./navbar.js"></script>
<style src="./navbar.scss" lang="scss"/>
