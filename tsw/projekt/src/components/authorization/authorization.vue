<template>
    <div class="auth-container">
        <form v-on:submit.prevent="onsubmit"  class="form-border">
            <h1 v-if="loginMode">Zaloguj się</h1>
            <h1 v-else>Zajerestruj się</h1>
            <div class="error-message">
                <span v-if="!loginDataValid && submitted">Zły login albo hasło.</span>
            </div>
            <div class="input-group">
                <label for="login">Login</label>
                <input id="login" type="text" v-model="username">
                <div class="error-message">
                    <span v-if="!loginValid && submitted" >Login jest wymagany.</span>
                </div>
            </div>
            <div class="input-group">
                <label for="password">Hasło</label>
                <input id="password" type="password" v-model="password">
                <div class="error-message">
                    <span v-if="!passwordValid && submitted">Hasło jest wymagane.</span>
                </div>
            </div>
            <button v-if="loginMode" type="submit">Zaloguj się</button>
            <button v-else type="submit">Rejestracja</button>
        </form>
    </div>
</template>

<script src="./authorization.js"/>
<style lang="scss" src="./authorization.scss"/>
