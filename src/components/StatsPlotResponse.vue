<template>
    <div>
        <p>The response to this question is in graphical format. Please click on the button below to open the plot as a block in the main interface.</p>
        <button class="button" v-on:click="openPlot">Open Plot</button>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    export default {
        name: "stats-plot-response",
        props: ["response"],
        methods: {
            openPlot() {
                this.$store.commit("addFunctionality", {
                    functionality: "StatsPlot",
                    funcData: this.response
                });
            }
        },
    }
</script>

<style scoped>

</style>