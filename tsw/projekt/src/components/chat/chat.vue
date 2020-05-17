<template>
  <div class="container">
    <form v-on:submit.prevent="onSend"  class="form">
      <ul>
          <li v-for="msg in messages" :key="msg">
              {{msg}}
          </li>
      </ul>
      <input type="text" v-model="message">
      <button type="submit">Wyslij</button>
    </form>

  </div>
</template>

<script src="./chat.js"/>
<style lang="scss" src="./chat.scss"/>
