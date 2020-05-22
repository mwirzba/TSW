<template>
    <div class="auction-details-container">
        <form class="form-border" v-on:submit.prevent="onSubmit">
            <h3>{{auction.auctionName}}</h3>
            <p>Cena: {{auction.currentPrice}}</p>
            <label for="newPrice">Twoja cena</label>
            <input v-model="newPrice" id="newPrice">
            <button v-on:click="onSubmit()" v-if="this.$store.state.userData.authenticated">Przebij</button>
            <p v-if="!this.$store.state.userData.authenticated">Zaloguj brać udział w aukcji.</p>
        </form>
    </div>
</template>

<script src="./auctionDetails.js">

</script>

<style scoped lang="scss" src="./auctionDetails.scss">

</style>
