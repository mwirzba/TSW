
<template>
    <div>
        <div class="navbar-container" id="navbar-container">
            <router-link  class="navbar-link" :to="{ name: 'auctionsByPage' , params: { page: 1 } }">Aukcje</router-link>
            <router-link  v-if="logged" class="navbar-link" :to="{ name: 'newAuction' }">Dodaj Aukcje</router-link>
            <router-link  v-if="logged" class="navbar-link" :to="{ name: 'yourAuctions' , params: { page: 1} }">Twoje aukcje</router-link>
            <router-link  v-if="logged" class="navbar-link" :to="{ name: 'auctionsPanel' }">Licytowane aukcje</router-link>
            <router-link  v-if="logged" class="navbar-link" :to="{ name: 'auctionHistory', params: { page: 1} }">Historia zakupów</router-link>
            <router-link  v-if="logged" class="navbar-link" :to="{ name: 'chat' }">Chat</router-link>
            <router-link class="navbar-link-right" :to="{ name: 'register'}">Rejestracja</router-link>
            <router-link class="navbar-link-right" v-if="!logged" :to="{ name: 'login' }">Zaloguj się</router-link>
            <a v-else class="navbar-link-right"  v-on:click="logOut">Wyloguj</a>
            <a class="navbar-link-right" v-if="logged">
                Witaj, {{$store.state.userData.username}}
            </a>
            <a class="icon" v-on:click="toogleNavbar">&#9776;</a>
        </div>
    </div>
</template>

<script src="./navbar.js"></script>
<style src="./navbar.scss" lang="scss"/>
