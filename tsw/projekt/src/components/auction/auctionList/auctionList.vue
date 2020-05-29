<template>
<div class="auction-container">
    <div v-if="auctions.length" class="auction-list">
        <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
            <p class="header">{{auction.auctionName}}</p>
            <h3>Cena: {{auction.currentPrice}} zł</h3>
            <p>Sprzedawca: {{auction.auctionOwner}}</p>
            <p v-if="!auction.buyNow">Zakończenie aukcji: {{auction.endViewDate.date}}</p>
            <router-link v-if="!auction.archived" :to="{ name: 'auctionDetails' , params: { id: auction.id } }">Zobacz</router-link>
            <router-link v-if="!auction.userPrice.length && auction.auctionOwner === userLogin" :to="{ name: 'editAuction' , params: { id: auction.id } }">Edytuj</router-link>
        </div>
        <div class="pagination-container">
            <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === 1" v-on:click="onPageNumber(1)">&lt;&lt;</button>
            <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === 1"  v-on:click="onPrevPage">&lt;</button>
            <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === paginationInfo.totalPages" v-on:click="onNextPage">&gt;</button>
            <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === paginationInfo.totalPages" v-on:click="onPageNumber(paginationInfo.totalPages)"> &gt;&gt; </button>
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
