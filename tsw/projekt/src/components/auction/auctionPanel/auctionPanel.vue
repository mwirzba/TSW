<template>
    <div v-if="auctions.length" class="list-container">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="form-border">
            <p class="header">{{auction.auctionName}}</p>
            <h3>Cena: {{auction.currentPrice}}</h3>
            <div v-if="auction.auctionBuyer && auction.userBid" class="auction-status-info">
                <span v-if="auction.auctionBuyer === userName" v-bind:style="{'color':'green'}">Wygrywasz obecnie aukcje.</span>
                <span v-else v-bind:style="{'color':'red'}">Zostałeś przebity zalicytuj ponowanie.</span>
            </div>
            <div class="input-group">
                <label>Twoja cena</label>
                <input type="text" v-model="auction.newPrice" :disabled="auction.auctionBuyer === userName">
                <div class="error-message">
                    <span v-if="auction.errorPrice">Nieprawidłowa cena</span>
                    <span v-if="auction.errorMsg">Aukcja sie skonczyła</span>
                </div>
            </div>
            <button v-on:click="onSubmit(auction,i)" :disabled="auction.auctionBuyer === userName">Przebij</button>
        </div>
    </div>
    <div v-else class="empty">
        <h1>Nie licytujesz żadnych aukcji.</h1>
    </div>
</template>

<script src="./auctionPanel.js">

</script>

<style scoped lang="scss" src="./auctionPanel.scss">

</style>
