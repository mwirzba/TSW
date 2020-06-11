<template>
  <div class="chat-container">
      <div class="select-container">
          <select class="select-list" @change="onUserSelected($event)">
              <option class="opt"  disabled selected>Wybierz użytkownika do czatowania</option>
              <option class="opt" v-for="user in usersList" :key="user.username" v-bind:style="user.isOnline ? {'color':'green'} : {'color':'red'}">{{user.username}}</option>
          </select>
      </div>
      <div class="chat">
          <div v-if="messages.length">
              <ul class="chat-list" id="chat-list">
                  <li v-for="(msg,i) in messages" :key="msg+i" class="chat-element">
                      <div v-if="msg.sendingUser !== $store.state.userData.username" class="message-text">
                          <span class="nick">{{msg.sendingUser}}</span>
                          <span class="message">{{msg.message}}</span>
                      </div>
                      <div v-else v-bind:style="{'text-align':'right'}" class="chat-user-msg">
                          <span class="message">{{msg.message}}</span>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
      <form v-on:submit.prevent="onSend" class="chat-form">
          <input  class="chat-text-box" type="text" v-model="message">
      </form>
  </div>
</template>

<script src="./chat.js"/>
<style scoped lang="scss" src="./chat.scss"/>
