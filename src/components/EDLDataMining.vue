<template>

    <div class="panel-block panel-heading-size" style="overflow: auto; flex-direction: column; height: 100%">
        <div id="dm-analysis-content" class="content" style="width: 100%">
            <h5 class="subtitle has-text-danger">
                Specify the objective/target metric of interest.
            </h5>
            Type metric:

            <div class="field has-addons is-fullwidth">
                <div class="control is-expanded">
                    <input class="input" type="text" name="metricName" placeholder="Type target metric name" v-model="metricName" v-on:keyup.enter="sendMetricName">
                </div>
                <div class="control">
                    <a class="button is-info" id="run_dm" v-on:click.prevent="sendMetricName">Analyze</a>
                </div>
            </div>
            <div class="panel-block"> ...Or select a metric </div>
            <p class="select">
                <select v-model="metricName">
                    <option selected disabled> Flagged or Out of Spec Metrics</option>
                    <option v-for="metric, index in metricList" v-bind:value="metric">{{ metric }}</option>
                </select>
            </p>

            <p class="select">
                <select v-model="plotIndex">
                    <option selected disabled> Flagged or Out of Spec Metrics</option>
                    <option v-for="(plot, index) in plots" v-bind:value="index">{{ plot.title }}</option>
                </select>
            </p>
            <h5 class="subtitle has-text-danger">
                Select data for the analysis.
            </h5>
            <div class="control">
                <div class = "tooltip">
                    <label class="radio">
                        Entire Dataset:
                        <input type="radio" name="cases-selection" value="entire-dataset" v-model="casesSelection" />
                    </label>
                </div>
                <div class = "tooltip">
                    <label class = "radio">
                        Plot Selection:
                        <input type="radio" name="cases-selection" value="plot-selection" v-model="casesSelection" />
                    </label>
                </div>
            </div>

            <h5 class="subtitle has-text-danger">
                Select the value of the target metric you want to investigate.
            </h5>
            <p class="select">
                <select  v-model="directionAnalysis">
                    <option value="above">Cases above percentile specified</option>
                    <option value="below">Cases below percentile specified</option>

                </select>
            </p>
            <p class="select">
                <select  v-model="percentileSelected">
                    <option value=0.01>1%-tile</option>
                    <option value=0.1>10%-tile</option>
                    <option value=0.25>25%-tile</option>
                    <option value=0.50>50%-tile</option>
                    <option value=0.75>75%-tile</option>
                    <option value=0.9>90%-tile</option>
                    <option value=0.99>99%-tile</option>
                </select>
            </p>


            <h1 class="title is-5"> Rules Extracted </h1>
            <h6 class="subtitle is-6 has-text-danger">
                Legend
            </h6>
            <br>This table shows the class label mapping to percentile.
            <table class="table is-bordered is-striped is-narrow is-hoverable">
                <thead>
                <tr>
                    <th>Value</th>
                    <th>Interval</th>

                </tr>
                </thead>

                <tbody>
                <tr>
                    <th>0</th> <td>(0,0.01]</td>
                </tr>
                <tr>
                    <th>1</th> <td>(0.01,0.25]</td>
                </tr>
                <tr>
                    <th>2</th> <td>(0.25,0.75]</td>
                </tr>
                <tr>
                    <th>3</th> <td>(0.75,0.99]</td>
                </tr>
                <tr>
                    <th>4</th> <td>(0.99,1.0]</td>
                </tr>
                </tbody>
            </table>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                <tr>
                    <th>Rule</th>
                    <th>Complexity</th>
                    <th>Precision</th>
                    <th>Recall</th>

                </tr>
                </thead>

                <tbody v-for="f in tableData" @click="selectRow(f.ruleCol)" :key="f.ruleCol" :class="{'highlight':(f.ruleCol === selectedRow)}">
                <tr class="clickable-row">
                    <th>{{ f.ruleCol }}</th>
                    <td>{{ f.complexityCol}}</td>
                    <td>{{ f.precisionCol}}</td>
                    <td>{{ f.recallCol}}</td>
                </tr>
                </tbody>
            </table>
        </div>


        <div id="feature-tree-panel"></div>


    </div>
    
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "EDLDataMining",
        data() {
            return {
                plotIndex: 0,
                selectedRow: null,
            }
        },
        computed: {

            ...mapState({
                metricList: state => state.edlDatamining.metricList,
                plots: state => state.generalPlot.plotList,
                edlRule: state => state.edlDatamining.edlRule,
                edlComplexity: state => state.edlDatamining.edlComplexity,
                edlPrecision: state => state.edlDatamining.edlPrecision,
                edlRecall: state => state.edlDatamining.edlRecall,
            }),

            casesSelection: {
                get(){
                    return this.$store.state.edlDatamining.casesSelection;
                },
                set(newCasesSelection) {
                    this.$store.commit('setCasesSelection', newCasesSelection);
                }
            },

            metricName: {
                get() {
                    return this.$store.state.edlDatamining.metricName;
                },
                set(newMetric) {
                    this.$store.commit('setMetricName', newMetric);
                }

            },
            percentileSelected: {
                get() {
                    return this.$store.state.edlDatamining.percentileSelected;
                },
                set(newPercentile) {
                    this.$store.commit('setPercentile', newPercentile);
                }
            },

            directionAnalysis: {
                get() {
                    return this.$store.state.edlDatamining.directionAnalysis;
                },
                set(newDirection) {
                    this.$store.commit('setDirection', newDirection);
                }
            },

            tableData() {
                const tableData = [];
                for (let i = 0, len = Math.max(this.edlRule.length, this.edlComplexity.length, this.edlPrecision.length, this.edlRecall.length,); i < len; i++) {
                    tableData.push({
                        ruleCol: this.edlRule[i] && this.edlRule[i].message || this.edlRule[i],
                        complexityCol: this.edlComplexity[i] && this.edlComplexity[i].message || (this.edlComplexity[i]).toFixed(7),
                        precisionCol: this.edlPrecision[i] && this.edlPrecision[i].message || this.edlPrecision[i],
                        recallCol: this.edlRecall[i] && this.edlRecall[i].message || this.edlRecall[i]
                    })
                }
                return tableData
            },


        },
        methods: {
            sendMetricName() {
                this.$store.dispatch("getSelectedPlot", this.plotIndex);

            },
            selectRow(rule){
                    this.selectedRow = rule;
                    this.$store.commit('setClickedExpression', rule)
        }
        },

        mounted() {
            this.$store.dispatch("getMetricsList");
        },
        watch: {


        },
    }

    

</script>

<style scoped>

</style>