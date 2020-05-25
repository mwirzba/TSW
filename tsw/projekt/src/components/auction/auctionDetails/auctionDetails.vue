<template>
    <div class="auction-details-container">
        <div class="form-border" v-on:submit.prevent="onSubmit">
            <h3>{{auction.auctionName}}</h3>
            <p>Cena: {{auction.currentPrice}}</p>
            <div v-if="auction.auctionOwner !== this.$store.state.userData.username && !auction.buyNow">
                <label for="newPrice">Twoja cena</label>
                <input v-model="newPrice" id="newPrice">
            </div>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated &&
                    !auction.buyNow && auction.auctionOwner !== this.$store.state.userData.username">Przebij
            </button>
            <button v-on:click="onSubmit"
                    v-if="this.$store.state.userData.authenticated && auction.buyNow
                    && auction.auctionOwner !== this.$store.state.userData.username">Kup
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
