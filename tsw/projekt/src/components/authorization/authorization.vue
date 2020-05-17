<template>
    <div class="container">
        <form v-on:submit.prevent="onsubmit"  class="form">
            <h1 v-if="loginMode">Zaloguj się</h1>
            <h1 v-else>Zajerestruj się</h1>
            <label for="login">Login</label>
            <input id="login" type="text" v-model="username">
            <label for="password">Hasło</label>
            <input id="password" type="text" v-model="password">
            <button v-if="loginMode" type="submit">Zaloguj się</button>
            <button v-else type="submit">Zajerestruj się</button>
        </form>
        <button v-on:click="onSend">Wyslij</button>
    </div>
</template>

<script src="./authorization.js"/>
<style lang="scss" src="./authorization.scss"/>
