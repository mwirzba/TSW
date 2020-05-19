<template>
    <div class="auction-form-container">
        <form v-on:submit.prevent="onsubmit"  class="form">
            <h1>Add auction</h1>
            <label for="auctionName">Auction name</label>
            <input id="auctionName" type="text" v-model="auctionName">
            <label for="auctionOwner">Auction owner</label>
            <input id="auctionOwner" type="text" v-model="auctionOwner">
            <label for="startDate">Start date</label>
            <input id="startDate" type="date" v-model="startDate">
            <label for="endDate">Start date</label>
            <input id="endDate" type="date" v-model="endDate">
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script src="./auctionForm.js">

</script>

<style lang="scss" src="./auctionForm.scss">

</style>
