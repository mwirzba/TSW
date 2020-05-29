<template>
    <div class="auction-container">
        <div v-if="auctions.length">
            <div v-for="(auction,i) in auctions" :key="auction+i" class="auction-element">
                <p class="header">{{auction.auctionName}}</p>
                <h4>Cena: {{auction.currentPrice}} zł</h4>
                <p>Sprzedawca: {{auction.auctionOwner}}</p>
                <p v-if="!auction.buyNow">Aukcja zakończona: {{auction.endViewDate.date}}</p>
                <div v-if="!auction.buyNow">Wynik aukcji
                       <p v-if="auction.auctionBuyer === userLogin">Wygrano aukcje</p>
                        <p v-else>Nie wygrano aukcji</p>
                </div>
            </div>
            <div class="pagination-container">
                <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === 1" v-on:click="onPageNumber(1)">&lt;&lt;</button>
                <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === 1"  v-on:click="onPrevPage">&lt;</button>
                <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === paginationInfo.totalPages" v-on:click="onNextPage">&gt;</button>
                <button class="pagination-button"  :disabled="this.paginationInfo.currentPage === paginationInfo.totalPages" v-on:click="onPageNumber(paginationInfo.totalPages)"> &gt;&gt; </button>
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
