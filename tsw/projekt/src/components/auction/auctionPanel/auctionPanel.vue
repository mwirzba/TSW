<template>
    <div class="auction-panel-container">
        <div v-for="(auction,i) in auctions" :key="auction+i">
                <div  class="form-border">
                    <h3>{{auction.auctionName}}</h3>
                    <p>Cena: {{auction.currentPrice}}</p>
                    <label for="newPrice">Twoja cena</label>
                    <input v-model="newPrice" id="newPrice">
                    <button v-on:click="onSubmit(auction._id)">Przebij</button>
                </div>
        </div>
    </div>
</template>

<script src="./auctionPanel.js">

</script>

<style scoped lang="scss" src="./auctionPanel.scss">

</style>
