<template>
    <div v-if="auctions.length" class="list-container">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="form-border">
            <p class="header">{{auction.auctionName}}</p>
            <h3>Cena: {{auction.currentPrice}}</h3>
            <div v-if="!auction.buyNow">Data zakończenia {{auction.endViewDate.date}} {{auction.endViewDate.hour}}:{{auction.endViewDate.minute}}</div>
            <div v-if="auction.auctionBuyer && auction.userBid" class="auction-status-info">
                <span v-if="auction.auctionBuyer === userName" v-bind:style="{'color':'green'}">Wygrywasz obecnie aukcje.</span>
                <span v-else v-bind:style="{'color':'red'}">Zostałeś przebity zalicytuj ponowanie.</span>
            </div>
            <div class="input-group">
                <label>Twoja cena</label>
                <input type="text" v-model="auction.newPrice" :disabled="!auction.buyNow && auction.auctionBuyer === userName || new Date(auction.endDate) <= currentTime">
                <div class="error-message">
                    <span v-if="auction.errorPrice">Nieprawidłowa cena</span>
                    <span v-if="auction.errorMsg ||  new Date(auction.endDate) <= currentTime">Aukcja sie zakończyła.</span>
                </div>
            </div>
            <button v-on:click="onSubmit(auction,i)" :disabled="!auction.buyNow && auction.auctionBuyer === userName || new Date(auction.endDate) <= currentTime">LICYTUJ</button>
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
