<template>
<div class="auction-container">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
            <h3>{{auction.auctionName}}</h3>
            <h4>{{auction.currentPrice}} zł</h4>
            <p>Sprzedawca: {{auction.auctionOwner}}</p>
            <p>Rozpoczęto: {{auction.startViewDate.date}} {{auction.startViewDate.hour}}:{{auction.startViewDate.minute}}</p>
            <p>Zakończenie aukcji: {{auction.endViewDate.date}} {{auction.endViewDate.hour}}:{{auction.endViewDate.minute}}</p>
            <router-link v-if="new Date(auction.startDate) < Date.now()" :to="{ name: 'auctionDetails' , params: { id: auction.id } }">Zobacz</router-link>
        </div>
</div>
</template>

<script src="./auctionList.js">

</script>

<style  scoped lang="scss" src="./auctionList.scss">

</style>
