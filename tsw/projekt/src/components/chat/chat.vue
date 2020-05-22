<template>
  <div class="chat-container">
      <div class="users-list-container">
          <h2>Użytkownicy</h2>
          <ul class="users-list">
             <li class="users-element" v-for="(user,i) in usersList" :key="user+i">
                 <a v-on:click="onUserSelected(i)">
                     {{user.username}}
                 </a>
             </li>
          </ul>
      </div>
      <div class="chat">
          <div v-if="userToSend.length>0">
              <h2>{{userToSend}}</h2>
              <ul class="chat-list">
                  <li v-for="(msg,i) in messages" :key="msg+i" class="message">
                      <p v-bind:style="[ msg.sendingUser === userToSend ? {'text-align':'left'} : {'text-align':'right'}]">
                          {{msg.message}}
                      </p>
                  </li>
              </ul>
              <form v-on:submit.prevent="onSend" class="chat-form">
                  <input id="message" type="text" v-model="message">
                  <button v-on:click="onSend">Wyślij</button>
              </form>
          </div>
          <div v-else>
              <h1>Wybierz użytkownika aby otworzyć czat.</h1>
          </div>
      </div>
  </div>
</template>

<script src="./chat.js"/>
<style scoped lang="scss" src="./chat.scss"/>
