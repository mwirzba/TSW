<template>
    <div class="auction-container">
        <div class="auction-list" v-if="logged && auctions.length > 0">
            <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
                <p>Item: {{auction.auctionName}}</p>
                <p>User: {{auction.auctionOwner}}</p>
                <p>Starting: {{auction.startDate}}</p>
                <p>End: {{auction.endDate}}</p>
                <router-link v-if="new Date(auction.startDate) > new Date()" :to="{ name: 'editAuction' , params: { id: auction._id  , editMode: true } }">Edit</router-link>
            </div>
        </div>
    </div>
</template>

<script src="./auctionEditList.js">

</script>

<style scoped lang="scss" src="./auctionEditList.scss">

</style>
