<template>
    <component v-bind:is="responseTypes[info.type]" v-bind:plot-info="info" v-bind:id="'plotContainer' + plotID" v-bind:plot-id="plotID"></component>
</template>

<script>
    import { mapGetters } from 'vuex';
    import StatsPlot from './StatsPlot';
    import ScatterPlot from './ScatterPlot';
    import * as _ from 'lodash-es';
    export default {
        name: "GeneralPlot",
        props: ["info", "plotID"],
        data() {
            return {
                responseTypes: {
                    hist_plot: 'StatsPlot',
                    plot_vars: 'ScatterPlot'
                },
                pinnedPlot: null,
                pinnedPlotType: null
            }
        },
        computed: {
        },
        components: {
            StatsPlot,
            ScatterPlot
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>