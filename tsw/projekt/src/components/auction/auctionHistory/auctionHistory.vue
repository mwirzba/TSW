<template>
    <div class="auction-container">
        <div v-if="auctions.length">
            <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
                <h3>{{auction.auctionName}}</h3>
                <h4>Cena: {{auction.currentPrice}} zł</h4>
                <p>Sprzedawca: {{auction.auctionOwner}}</p>
                <p v-if="!auction.buyNow">Aukcja zakończona: {{auction.endViewDate.date}} {{auction.endViewDate.hour}}:{{auction.endViewDate.minute}}</p>
            </div>
            <div class="pagination-container">
                <button class="pagination-button " v-on:click="onPageNumber(1)">PIERWSZE</button>
                <button class="pagination-button " v-on:click="onPrevPage">POPRZEDNIA</button>
                <button class="pagination-button" v-on:click="onNextPage">NASTEPNA</button>
                <button class="pagination-button " v-on:click="onPageNumber(paginationInfo.totalPages)"> OSTATNIE </button>
            </div>
        </div>
        <div v-else>
            <h2>Nie kupiono żadnych produktów ani nie brano udziału w żadnych aukcjach</h2>
        </div>
    </div>
</template>

<script src="./auctionHistory.js">

</script>

<style scoped lang="scss" src="./auctionHistory.scss">

</style>
