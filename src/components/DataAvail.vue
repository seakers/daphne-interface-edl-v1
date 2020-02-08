<template>


    <div class="panel-block panel-heading-size" style="overflow: auto; flex-direction: column; height: 100%">
        <div id="metrics-list-content" class="content" style="width: 100%">


            <h1 class="title is-5"> Scorecard Metrics for the current dataset </h1>
            <table class="table is-bordered is-striped is-narrow is-hoverable is-half">
                <thead>
                <tr>
                    <th>Scorecard Metrics</th>
                    <th>Matout Variables</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="f in tableData">
                    <th>{{ f.metricCol }}</th>
                    <th>{{f.varCol}}</th>
                </tr>
                </tbody>
            </table>


        </div>
    </div>


</template>

<script>
    import { mapState } from 'vuex';
    import * as d3 from 'd3';
    import 'd3-selection-multi';
    let jStat = require('jStat').jStat;
    export default {
        name: "DataAvail",
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
                currentTab:'Home',
                tabs: ['Home', 'Posts', 'Archive']

            }
        },

        computed:{

            ...mapState({
                metricsAvail: state => state.datasetImport.metricsAvail,
                varsAvail: state=> state.datasetImport.varsAvail

            }),

            tableData() {
                const tableData = [];
                for (let i = 0, len = Math.max(this.metricsAvail.length, this.varsAvail.length); i < len; i++) {
                    tableData.push({
                        metricCol: this.metricsAvail[i] && this.metricsAvail[i].message || this.metricsAvail[i],
                        varCol: this.varsAvail[i] && this.varsAvail[i].message || this.varsAvail[i]
                    })
                }
                return tableData
            },

            currentTabComponent: function(){
                return 'tab-' + this.currentTab.toLowerCase()
            }


        },

        methods:{


        }

    }
</script>

<style scoped>

</style>