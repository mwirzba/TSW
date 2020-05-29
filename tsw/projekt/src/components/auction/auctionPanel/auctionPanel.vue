<template>
    <div v-if="auctions.length" class="list-container">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="form-border">
            <p class="header">{{auction.auctionName}}</p>
            <h3>Cena: {{auction.currentPrice}}</h3>
            <div class="input-group">
                <label>Twoja cena</label>
                <input type="text" v-model="auction.newPrice">
                <div class="error-message">
                    <span v-if="auction.errorPrice">Nieprawidłowa cena</span>
                    <span v-if="auction.errorMsg">Aukcja sie skonczyła</span>
                </div>
            </div>
            <button v-on:click="onSubmit(auction,i)">Przebij</button>
        </div>
    </div>
    <div v-else>
        <h1 style="text-align: center">Nie licytujesz żadnych aukcji.</h1>
    </div>
</template>

<script src="./auctionPanel.js">

</script>

<style scoped lang="scss" src="./auctionPanel.scss">

</style>
