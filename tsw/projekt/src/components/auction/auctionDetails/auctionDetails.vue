<template>
    <div class="auction-details-container" v-if="auction">
        <div class="form-border" v-on:submit.prevent="onSubmit">
            <p class="header">{{auction.auctionName}}</p>
            <div v-if="!auction.buyNow && auction.auctionBuyer && auction.auctionOwner !== this.$store.state.userData.username" class="auction-status-info">
                <span v-if="auction.auctionBuyer === this.$store.state.userData.username" v-bind:style="{'color':'green'}">Wygrywasz obecnie aukcje.</span>
                <span v-else v-bind:style="{'color':'red'}">Zalicytuj aby prowadzić w aukcji.</span>
            </div>
            <div class="price-container">
                <span>Aktualna Cena:</span>
                <span class="price">
                        {{auction.currentPrice}} zł</span>
            </div>
            <div v-if="!auction.buyNow">Data zakończenia {{auction.endViewDate.date}} {{auction.endViewDate.hour}}:{{auction.endViewDate.minute}}</div>
            <div class="desc-container">
                <span>
                    Opis:
                </span>
                <span>
                    {{auction.description}}
                </span>
            </div>
            <div class="input-group" style="margin-bottom: 10px"
                 v-if="auction.auctionOwner
                !== this.$store.state.userData.username && !auction.buyNow">
                <label for="newPrice">Twoja cena</label>
                <input v-model="newPrice" id="newPrice" :disabled="auction.auctionBuyer === this.$store.state.userData.username || auctionTimeOut  || errorMess">
                <div class="error-message" >
                    <p v-if="!inputValid && submitted">Nieprawidłowa cena</p>
                    <p v-if="errorMess || auctionTimeOut">Aukcja już się zakończyła</p>
                </div>
            </div>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated &&
                    !auction.buyNow && auction.auctionOwner !== this.$store.state.userData.username"
                    :disabled="auction.auctionBuyer === this.$store.state.userData.username || auctionTimeOut  || errorMess">LICYTUJ
            </button>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated && auction.buyNow
                    && auction.auctionOwner !== this.$store.state.userData.username"
                    :disabled="auction.auctionBuyer === this.$store.state.userData.username">Kup teraz.
            </button>
            <p v-if="!this.$store.state.userData.authenticated && !auction.buyNow">Zaloguj brać udział w aukcji.</p>
            <p v-else-if="!this.$store.state.userData.authenticated && auction.buyNow">Zaloguj się aby kupić produkt.</p>
        </div>
    </div>
</template>

<script src="./auctionDetails.js">

</script>

<style scoped lang="scss" src="./auctionDetails.scss">

</style>
