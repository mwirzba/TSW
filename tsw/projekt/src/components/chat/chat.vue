<template>
  <div class="chat-container">
      <h1>Messages</h1>
      <form v-on:submit.prevent="onSend"  class="form">
          <ul>
              <li v-for="msg in messages" :key="msg">
                  {{msg}}
              </li>
          </ul>
          <label for="message">Message</label>
          <input id="message" type="text" v-model="message">
          <label for="userToSend">User</label>
          <input id="userToSend" type="text" v-model="userToSend">
          <button type="submit">Send</button>
      </form>
  </div>
</template>

<script src="./chat.js"/>
<style lang="scss" src="./chat.scss"/>
