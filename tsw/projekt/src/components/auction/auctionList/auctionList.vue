<template>
<div class="auction-container">
    <div v-if="auctions.length">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
            <h3>{{auction.auctionName}}</h3>
            <h4>{{auction.currentPrice}} zł</h4>
            <p>Sprzedawca: {{auction.auctionOwner}}</p>
            <p v-if="!auction.buyNow">Zakończenie aukcji: {{auction.endViewDate.date}} {{auction.endViewDate.hour}}:{{auction.endViewDate.minute}}</p>
            <router-link v-if="!auction.archived" :to="{ name: 'auctionDetails' , params: { id: auction.id } }">Zobacz</router-link>
            <router-link v-if="auction.auctionOwner === $store.state.userData.username" :to="{ name: 'editAuction' , params: { id: auction.id } }">Edytuj</router-link>
        </div>
        <div class="pagination-container">
            <button class="pagination-button " v-on:click="onPageNumber(1)">PIERWSZE</button>
            <button class="pagination-button " v-on:click="onPrevPage">POPRZEDNIA</button>
            <button class="pagination-button" v-on:click="onNextPage">NASTEPNA</button>
            <button class="pagination-button " v-on:click="onPageNumber(paginationInfo.totalPages)"> OSTATNIE </button>
        </div>
    </div>
    <div v-else>
            <h1 style="text-align: center">Brak aukcji.</h1>
    </div>

</div>
</template>

<script src="./auctionList.js">

</script>

<style  scoped lang="scss" src="./auctionList.scss">

</style>
