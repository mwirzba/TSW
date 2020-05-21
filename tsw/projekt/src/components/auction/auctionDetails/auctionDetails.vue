<template>
    <div class="auction-details-container">
        <form class="form" v-on:submit.prevent="onSubmit">
            <h3>{{auctionName}}</h3>
            <p>Cena: {{currentPrice}}</p>
            <label for="newPrice">Twoja cena</label>
            <input v-model="newPrice" id="newPrice">
            <button v-on:click="onSubmit()" v-if="this.$store.state.logged">Przebij</button>
            <p v-if="!this.$store.state.logged">Zaloguj brać udział w aukcji.</p>
        </form>
    </div>
</template>

<script src="./auctionDetails.js">

</script>

<style scoped lang="scss" src="./auctionDetails.scss">

</style>
