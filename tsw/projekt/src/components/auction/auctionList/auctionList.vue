<template>
<div class="auction-container">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
            <p>Produkt: {{auction.auctionName}}</p>
            <p>Sprzedawca: {{auction.auctionOwner}}</p>
            <p>Rozpoczęto: {{auction.startDate}}</p>
            <p>Koniec: {{auction.endDate}}</p>
            <router-link v-if="new Date(auction.startDate) < new Date()" :to="{ name: 'auctionDetails' , params: { id: auction._id } }">Zobacz</router-link>
        </div>
</div>
</template>

<script src="./auctionList.js">

</script>

<style  scoped lang="scss" src="./auctionList.scss">

</style>
