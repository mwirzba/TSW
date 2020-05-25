
<template>
    <div class="navbar-container" >
        <div class="navbar-flex">
            <div class="navbar-links">
                <a class="navbar-link">
                    <router-link  :to="{ name: 'auctionsByPage' , params: { page: 1 } }">Aukcje</router-link>
                </a>
                <a class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'newAuction' }">Dodaj Aukcje</router-link>
                </a>
                <a class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'yourAuctions' , params: { page: 1} }">Twoje aukcje</router-link>
                </a>
                <a class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'auctionsPanel' }">Licytowane aukcje</router-link>
                </a>
                <a class="navbar-link" v-if="logged">
                    <router-link  :to="{ name: 'auctionHistory', params: { page: 1} }">Historia zakupów</router-link>
                </a>
                <a class="navbar-link" v-if="logged">
                  <router-link  :to="{ name: 'chat' }">Chat</router-link>
                </a>
            </div>
            <div class="navbar-auth">
                <a class="navbar-link" v-if="logged">
                  Witaj, {{$store.state.userData.username}}
                </a>
                <a class="navbar-link">
                    <router-link  :to="{ name: 'register'}">Rejestracja</router-link>
                </a>
                <a class="navbar-link">
                        <router-link v-if="!logged" :to="{ name: 'login' }">Zaloguj się</router-link>
                        <a v-else v-on:click="logOut">Wyloguj</a>
                </a>
            </div>
        </div>
    </div>
</template>

<script src="./navbar.js"></script>
<style src="./navbar.scss" lang="scss"/>
