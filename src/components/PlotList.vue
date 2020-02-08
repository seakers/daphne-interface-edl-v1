<template>
    <draggable id="plot-list" class="columns is-mobile is-multiline" v-bind:options="plotListOptions">
        <GeneralPlot
                v-for="plot, index in plots"
                v-bind:info="plot"
                v-bind:plot-i-d="index"
                v-bind:key="index">
        </GeneralPlot>
    </draggable>
</template>

<script>
    import { mapState } from 'vuex';
    import draggable from 'vuedraggable';
    import GeneralPlot from "./GeneralPlot";

    export default {
        components: {
            draggable,
            GeneralPlot
        },
        name: 'plot-list',
        data () {
            return {
                plotListOptions: {
                    group: {
                        name: 'plot_list',
                        pull: false,
                        put: false
                    },
                    handle: '.panel-heading',
                    animation: 150
                }
            };
        },
        computed: {
            ...mapState({
                response: state => state.daphne.response,
                plots: state => state.generalPlot.plotList
            })
        },

        watch: {
            response: function(newResponse, oldResponse) {
                console.log(newResponse);
                for (let i = 0; i < newResponse['visual_message_type'].length; ++i){
                    if (newResponse['visual_message_type'][i] === 'hist_plot') {
                        this.$store.commit("addStatsPlot", { ...newResponse['visual_message'][i], type: newResponse['visual_message_type'][i] });
                    }
                    if (newResponse['visual_message_type'][i] === 'plot_vars'){

                        this.$store.commit("addScatterPlot", { ...newResponse['visual_message'][i], type: newResponse['visual_message_type'][i] });
                    }
                }



            },
        }
    }
</script>

<style scoped></style>