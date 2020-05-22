<template>
    <div class="auction-form-container">
        <form v-on:submit.prevent="onsubmit" class="form-border">
            <h1 v-if="this.$route.params.id">Edytuj aukcje</h1>
            <h1 v-else>Dodaj aukcje</h1>
            <label for="auctionName">Nazwa</label>
            <input id="auctionName" type="text" v-model="auctionName">
            <label for="auctionOwner">Auction owner</label>
            <input id="auctionOwner" type="text" v-model="auctionOwner">
            <label for="currentPrice">Cena</label>
            <input id="currentPrice" type="text" v-model="currentPrice">
            <label for="startDate">Data rozpoczęcia aukcji</label>
            <input id="startDate" type="date" :value="startDate && startDate.toISOString().split('T')[0]"
                   @input="startDate = $event.target.valueAsDate">
            <label for="endDate">Data zakończenia aukcji</label>
            <input id="endDate" type="date" :value="endDate && endDate.toISOString().split('T')[0]"
                   @input="endDate = $event.target.valueAsDate">
            <label for="startHour">Godzina rozpoczęcia aukcji</label>
            <input id="startHour" type="text" v-model="startHour">
            <label for="startMinute">Minuta rozpoczęcia aukcji</label>
            <input id="startMinute" type="text" v-model="startMinute">
            <label for="endHour">Godzina zakończenia aukcji</label>
            <input id="endHour" type="text" v-model="endHour">
            <label for="endMinute">Minuta zakończenia aukcji</label>
            <input id="endMinute" type="text" v-model="endMinute">
            <button type="submit">Zatwierdź</button>
        </form>
    </div>
</template>

<script src="./auctionForm.js">

</script>

<style  scoped lang="scss" src="./auctionForm.scss">

</style>
