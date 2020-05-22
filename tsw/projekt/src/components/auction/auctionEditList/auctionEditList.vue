<template>
    <div class="auction-container">
        <div v-if="logged && auctions.length > 0">
            <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
                <p>Produkt: {{auction.auctionName}}</p>
                <p>Rozpoczęto: {{auction.startDate}}</p>
                <p>Koniec: {{auction.endDate}}</p>
                <router-link v-if="new Date(auction.startDate) > new Date()" :to="{ name: 'editAuction' , params: { id: auction._id  , editMode: true } }">Edytuj</router-link>
            </div>
        </div>
    </div>
</template>

<script src="./auctionEditList.js">

</script>

<style scoped lang="scss" src="./auctionEditList.scss">

</style>
