<template>
<div class="auction-container">
    <div class="auction-list">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
            <p>Item: {{auction.auctionName}}</p>
            <p>User: {{auction.auctionOwner}}</p>
            <p>Starting: {{auction.startDate}}</p>
            <p>End: {{auction.endDate}}</p>
        </div>
    </div>
</div>
</template>

<script src="./auctionList.js">

</script>

<style lang="scss" src="./auctionList.scss">

</style>
