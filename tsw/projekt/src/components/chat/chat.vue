<template>
  <div class="chat-container">
      <div class="users-list-container">
          <h1>Users</h1>
          <ul class="users-list">
             <li class="list-el" v-for="(user,i) in usersList" :key="user+i">
                 <a v-on:click="onUserSelected(i)">
                     {{user.username}}
                 </a>
             </li>
          </ul>
      </div>
      <div class="chat">
          <div v-if="userToSend.length>0">
              <h1>Send message to {{userToSend}}</h1>
              <form v-on:submit.prevent="onSend" class="form">
                  <ul>
                      <li v-for="(msg,i) in messages" :key="msg+i">
                          {{msg}}
                      </li>
                  </ul>
                  <label for="message">Message</label>
                  <input id="message" type="text" v-model="message">
                  <button v-on:click="onSend">Send</button>
              </form>
          </div>
      </div>
  </div>
</template>

<script src="./chat.js"/>
<style scoped lang="scss" src="./chat.scss"/>
