<template>
    <div class="auth-container">
        <form v-on:submit.prevent="onsubmit"  class="form">
            <h1 v-if="loginMode">Zaloguj się</h1>
            <h1 v-else>Zajerestruj się</h1>
            <label for="login">Login</label>
            <input id="login" type="text" v-model="username">
            <label for="password">Hasło</label>
            <input id="password" type="text" v-model="password">
            <button v-if="loginMode" type="submit">Login</button>
            <button v-else type="submit">Register</button>
        </form>
        <button v-on:click="onSend">Status</button>
    </div>
</template>

<script src="./authorization.js"/>
<style lang="scss" src="./authorization.scss"/>
