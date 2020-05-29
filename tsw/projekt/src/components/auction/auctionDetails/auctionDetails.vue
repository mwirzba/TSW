<template>
    <div class="auction-details-container">
        <div class="form-border" v-on:submit.prevent="onSubmit">
            <p class="header">{{auction.auctionName}}</p>
            <div class="price-container">
                <span>Aktualna Cena:</span>
                <span class="price">
                        {{auction.currentPrice}} zł</span>
            </div>
            <div class="price-container">
                <span>
                    Opis:
                </span>
                <span>
                    {{auction.description}}
                </span>
            </div>
            <div v-if="auction.auctionOwner !== this.$store.state.userData.username && !auction.buyNow" class="price-input">
                <label for="newPrice">Twoja cena</label>
                <input v-model="newPrice" id="newPrice">
            </div>
            <div class="error-message" >
                <p v-if="!inputValid && submitted">Nieprawidłowa cena</p>
            </div>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated &&
                    !auction.buyNow && auction.auctionOwner !== this.$store.state.userData.username">Przebij
            </button>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated && auction.buyNow
                    && auction.auctionOwner !== this.$store.state.userData.username">Kup teraz.
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
