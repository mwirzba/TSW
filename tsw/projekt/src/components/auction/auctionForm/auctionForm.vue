<template>
    <div class="auction-form-container">
        <form v-on:submit.prevent="onsubmit"  class="form">
            <h1 v-if="this.$route.params.id">Edytuj aukcje</h1>
            <h1 v-else>Dadaj aukcje</h1>
            <label for="auctionName">Auction name</label>
            <input id="auctionName" type="text" v-model="auctionName">
            <label for="auctionOwner">Auction owner</label>
            <input id="auctionOwner" type="text" v-model="auctionOwner">
            <label for="currentPrice">Price</label>
            <input id="currentPrice" type="text" v-model="currentPrice">
            <label for="startDate">Start date</label>
            <input id="startDate" type="date" :value="startDate && startDate.toISOString().split('T')[0]"
                   @input="startDate = $event.target.valueAsDate">
            <label for="endDate">End date </label>
            <input id="endDate" type="date" :value="endDate && endDate.toISOString().split('T')[0]"
                   @input="endDate = $event.target.valueAsDate">
            <label for="startHour">Hour</label>
            <input id="startHour" type="text" v-model="startHour">
            <label for="startMinute">Minute</label>
            <input id="startMinute" type="text" v-model="startMinute">
            <label for="endHour">Hour</label>
            <input id="endHour" type="text" v-model="endHour">
            <label for="endMinute">Minute</label>
            <input id="endMinute" type="text" v-model="endMinute">
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script src="./auctionForm.js">

</script>

<style  scoped lang="scss" src="./auctionForm.scss">

</style>
