<template>
    <div class="auction-form-container">
        <form v-on:submit.prevent="onsubmit" class="form-border">
            <h1 v-if="this.$route.params.id">Edytuj aukcje</h1>
            <h1 v-else>Dodaj aukcje</h1>
            <div class="input-group">
                <label for="auctionName">Nazwa</label>
                <input id="auctionName" type="text" v-model="auctionName">
                <div class="error-message">
                    <span v-if="!auctionNameValid && submitted" >Nazwa aukcji wymagana.</span>
                </div>
            </div>
            <div class="input-group">
                <label for="currentPrice">Cena</label>
                <input id="currentPrice" type="text" min="0" v-model="currentPrice">
                <div class="error-message">
                    <span v-if="!currentPriceValid && submitted">Nieprawidłowa cena.</span>
                </div>
            </div>
            <div class="input-group">
                <label for="description">Opis</label>
                <textarea id="description" v-model="description"/>
                <div class="error-message">
                    <span v-if="!descriptionValid && submitted">Opis wymagany.</span>
                </div>
            </div>

            <div v-if="!this.$route.params.id">
                <div class="checkBox">
                    <label for="buyNow">Opcja kup teraz</label>
                    <input type="checkbox" id="buyNow" v-model="buyNow">
                </div>
                <div v-if="!buyNow" class="input-group">
                    <label for="endDate">Data zakończenia aukcji</label>
                    <input id="endDate" type="date"  class="date-input" :value="endDate && endDate.toISOString().split('T')[0]"
                           @input="endDate = $event.target.valueAsDate">
                    <p v-if="!endDateValid && submitted && !this.$route.params.id" class="error-message">Zła data</p>
                </div>
            </div>
            <button type="submit">Zatwierdź</button>
        </form>
    </div>
</template>

<script src="./auctionForm.js">

</script>

<style  scoped lang="scss" src="./auctionForm.scss">

</style>
