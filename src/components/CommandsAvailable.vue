<template>
    <div class="panel-block panel-heading-size" style="overflow: auto; flex-direction: column; height: 100%">
        <div id="query-content" class="content" style="width: 100%">

            <p><b>Select a query from a category below</b></p>

            <p><b>Summarization Queries</b></p>
            <p class="select flex-column is-full-width">
                <select v-model="command">
                    <option value="From the scorecard what metrics are flagged?">From the scorecard what metrics are flagged?</option>
                    <option value="From the scorecard what metrics are out of spec?">From the scorecard what metrics are out of spec?</option>
                    <option value="From the ${edl_scorecard_file} scorecard what metrics are flagged?">From the ${edl_scorecard_file} scorecard what metrics are flagged?</option>
                    <option value="From the ${edl_scorecard_file} scorecard what metrics are out of spec?">From the ${edl_scorecard_file} scorecard what metrics are out of spec?</option>
                </select>
            </p>

            <p><b>Visualization</b></p>
            <p class="select is-full-width" >
                    <select v-model="command">
                        <option value="Calculate the statistics for ${edl_mat_param}.">Calculate the statistics for ${edl_mat_param}.</option>
                        <option value="From the current matfile plot ${edl_mat_param} vs ${edl_mat_param2}.">From the current matfile plot ${edl_mat_param} vs ${edl_mat_param2}.</option>
                        <option value="For ${edl_mission} calculate the statistics for ${edl_mat_param} in ${edl_mat_file}.">For ${edl_mission} calculate the statistics for ${edl_mat_param} in ${edl_mat_file}.</option>
                        <option value="From ${edl_mat_file} calculate ${scorecard_metric_calculation}.">From ${edl_mat_file} calculate ${scorecard_metric_calculation}.</option>
                        <option value="From ${edl_mat_file} plot ${edl_mat_param} vs ${edl_mat_param2}.">From ${edl_mat_file} plot ${edl_mat_param} vs ${edl_mat_param2}.</option>
                    </select>
            </p>

            <p><b>Parameter Values and/or Calculations</b></p>
            <p class="select is-full-width" >
                <select v-model="command">
                    <option value="Calculate the statistics for ${edl_mat_param}.">Calculate the statistics for ${edl_mat_param}.</option>
                    <option value="From the ${edl_scorecard_file} scorecard what are the POST results for the ${scorecard_post_results} metric?">From the ${edl_scorecard_file} scorecard what are the POST results for the ${scorecard_post_results} metric?</option>
                    <option value="From the current scorecard what are the POST results for the ${scorecard_post_results} metric ?">From the current scorecard what are the POST results for the ${scorecard_post_results} metric ?</option>
                    <option value="From the current matfile calculate ${scorecard_metric_calculation}.">From the current matfile calculate ${scorecard_metric_calculation}.</option>
                    <option value="For ${edl_mission} calculate the statistics for ${edl_mat_param} in ${edl_mat_file}.">For ${edl_mission} calculate the statistics for ${edl_mat_param} in ${edl_mat_file}.</option>
                    <option value="From ${edl_mat_file} calculate ${scorecard_metric_calculation}">From ${edl_mat_file} calculate ${scorecard_metric_calculation}</option>
                </select>
            </p>
        </div>
    </div>

</template>

<script>
    import { mapState } from 'vuex';
    import * as d3 from 'd3';
    import 'd3-selection-multi';
    let jStat = require('jStat').jStat;
    export default {
        name: "CommandsAvailable",
        data() {
            return {
                plotOverlap: false,
                mainPlotParams: {
                    margin: {top: 20, right: 75, bottom: 100, left: 75},
                    width: 1000,
                    height: 450,
                    scale: 1
                },
                transform: d3.zoomIdentity,
                zoom: {},
                xMap: {},
                yMapHist: {},
            }
        },

        computed:{
            command: {
                get() {
                    return this.$store.state.daphne.command;
                },
                set(newCommand) {
                    this.$store.commit('setCommand', newCommand);
                }
            }

        }


    }
</script>

<style scoped>

</style>