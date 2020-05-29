<template>
    <div class="auction-panel-container">
        <div v-if="auctions.length">
            <div v-for="(auction,i) in auctions" :key="auction+i">
                <div class="form-border item">
                    <h3>{{auction.auctionName}}</h3>
                    <p>Cena: {{auction.currentPrice}}</p>
                    <div class="input-group">
                        <label for="price">Twoja cena</label>
                        <input id="price" type="text" :value="newPrice">
                        <div class="error-message">
                            <span v-if="!inputValid">Nieprawidłowa cena</span>
                        </div>
                    </div>
                    <button v-on:click="onSubmit(auction._id)">Przebij</button>
                </div>
            </div>
        </div>

        <div v-else>
            <h1 style="text-align: center">Nie licytujesz żadnych aukcji.</h1>
        </div>
    </div>
</template>

<script src="./auctionPanel.js">

</script>

<style scoped lang="scss" src="./auctionPanel.scss">

</style>
