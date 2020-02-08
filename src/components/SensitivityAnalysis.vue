<template>

        <div class="panel-block panel-heading-size" style="overflow: auto; flex-direction: column; height: 100%">
            <div id="sensitivity-analysis-content" class="content" style="width: 100%">

                Monte Carlo filtering
                <!--<br> 1. Data is divided into two classes.-->
                <!--<br> 2. CDF for each curve is generated. Maximal distance between both curves is computed-->
                <!--<br> 3. K-S test is conducted-->
                <p class="help"> A small p-value indicates high influence and a large distance between curves indicates a significant effect of that variable in the response.</p>

                <h5 class="subtitle has-text-danger">
                    Specify the objective/target metric of interest.
                </h5>
                <div class="field has-addons is-fullwidth">
                    <div class="control is-expanded">
                        <input class="input" type="text" name="metricName" placeholder="Type scorecard metric name or choose from the list" v-model="metricName" v-on:keyup.enter="sendMetricName">
                    </div>
                    <div class="control">
                        <a class="button is-info" id="run_sa" v-on:click.prevent="sendMetricName">Analyze</a>
                    </div>
                </div>
                <div class="panel-block"> ...Or select a metric </div>
                <p class="select">
                    <select v-model="metricName">
                        <option selected disabled> Flagged or Out of Spec Metrics</option>
                        <option v-for="metric in metricList" v-bind:value="metric">{{ metric }}</option>
                    </select>
                </p>

                <h5 class="subtitle has-text-danger">
                    Specify type of metric:
                </h5>
                <p class="select">
                    <select  v-model="inputDataType">
                        <option value="mcOutput">MC Output Variable</option>
                        <option value="scorecard">Scorecard Metric</option>

                    </select>
                </p>

                <h5 class="subtitle has-text-danger">
                    Use Entire Dataset ?
                </h5>
                <div class="control">
                    <div class = "tooltip">
                        <label class="radio">
                            Yes:
                            <input type="radio" name="dataset-selection" value="entire-dataset" v-model="datasetOptions" />
                        </label>
                    </div>
                    <div class = "tooltip">
                        <label class = "radio">
                            No:
                            <input type="radio" name="dataset-selection" value="fraction-dataset" v-model="datasetOptions" />
                        </label>
                    </div>
                </div>
                <p>Specify range in dataset to use based on target metric values.</p>
                <input class="input" type="text" style="width: 25%" placeholder="Min" v-model="cutDatasetMin">
                <input class="input" type="text" style="width: 25%" placeholder="Max" v-model="cutDatasetMax">

                <h5 class="subtitle has-text-danger">
                    Select criteria for dividing dataset into two classes
                </h5>
                <p class="select">
                    <select  v-model="divideDataBy">
                        <option value="0.01">1%-tile</option>
                        <option value="0.99">99%-tile</option>
                        <option value="cutoff">Set cutoff value</option>
                        <option value="passfail">Pass/Fail (only if the target metric exists in scorecard)</option>

                    </select>


                </p>

                <input class="input" type="text" style="width: 25%" placeholder="Type a cutoff value" v-model="cutoffValue">
                <input class="input" type="text" style="width: 25%" placeholder="Type a second cutoff value (if needed)" v-model="cutoffValue2">




                <h5 class="subtitle has-text-danger">
                    Run SA against the following data:
                </h5>
                <p class="select">
                    <select  v-model="inputDataSA">
                        <option value="MCInput">Monte Carlo Inputs</option>
                        <option value="EDLSequence">Events in EDL Sequence </option>

                    </select>
                </p>

                <h5 class="subtitle has-text-danger">
                    If running SA for a given event, select event of interest:
                </h5>
                <p>This will run SA of target metric against parameters in this event.</p>
                <p class="select">
                    <select  v-model="eventSelected">
                        <option value="_ei">Entry Interface</option>
                        <option value="_pd">Parachute Deploy</option>
                        <option value="_hs">Heat Shield Separation</option>
                        <option value="_bs">Backshell Separation</option>
                        <option value="_sky">SkyCrane</option>
                        <option value="_td">Touchdown</option>
                        <option value="_AGLsample0">AGLsample0</option>
                        <option value="_AGLsample1">AGLsample1</option>
                        <option value="_AGLsample2">AGLsample2</option>
                        <option value="_AGLsample3">AGLsample3</option>
                        <option value="_AGLsample4">AGLsample4</option>
                        <option value="_AGLsample5">AGLsample5</option>
                        <option value="_AGLsample6">AGLsample6</option>
                        <option value="_AGLsample7">AGLsample7</option>
                        <option value="_AGLsample8">AGLsample8</option>
                        <option value="_Allsample">All AGL Samples</option>
                        <option value="_AllEDLEvents">All EDL Events</option>

                    </select>
                </p>
                <h5 class="subtitle has-text-danger">
                   Additional Options:
                </h5>
                <div class="control">
                    <div class = "tooltip">
                        <label class="radio">
                            Run SA against all events up to the one selected:
                            <input type="radio" name="events-selection" value="up-to-event" v-model="eventsOptions" />
                        </label>
                    </div>
                    <div class = "tooltip">
                        <label class="radio">
                            Run SA from event below up to the one selected:
                            <input type="radio" name="events-selection" value="from-event" v-model="eventsOptions" />
                        </label>
                    </div>

                    <p class="select">
                        <select  v-model="eventSelectedStart">
                            <option value="_ei">Entry Interface</option>
                            <option value="_pd">Parachute Deploy</option>
                            <option value="_hs">Heat Shield Separation</option>
                            <option value="_bs">Backshell Separation</option>
                            <option value="_td">Touchdown</option>
                        </select>
                    </p>

                    <div class = "tooltip">
                        <label class = "radio">
                            N/A:
                            <input type="radio" name="cases-selection" value="plot-selection" v-model="eventsOptions" />
                        </label>
                    </div>
                </div>

            </div>

            <div id="main-plot-sensitivity"></div>

            <h1 class="title is-5"> Summary of Results </h1>
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                <tr>
                    <th>Input Metric</th>
                    <th>Distance</th>
                    <th>P-Value</th>
                    <th>Description</th>
                    <th>Label</th>
                    <th>Model</th>

                </tr>
                </thead>

            <tbody>
                <tr v-for="f in tableData">
                    <th>{{ f.nameCol }}</th>
                    <td>{{ f.distanceCol}}</td>
                    <td>{{ f.resultCol}}</td>
                    <td>{{ f.descCol}}</td>
                    <td>{{ f.labelCol}}</td>
                    <td>{{ f.modelCol}}</td>

                </tr>
            </tbody>
            </table>
        </div>

</template>

<script>
    import { mapState } from 'vuex';
    import * as d3 from 'd3';
    import 'd3-selection-multi';
    let jStat = require('jStat').jStat;
    export default {
        name: "SensitivityAnalysis",
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

        computed: {
            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },

            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            },

            tableData() {
                const tableData = [];
                for (let i = 0, len = Math.max(this.inputNames.length, this.pvalue.length, this.inputDescription.length, this.inputLabel.length, this.inputModel.length, this.distanceCDF.length); i < len; i++) {
                    tableData.push({
                        nameCol: this.inputNames[i] && this.inputNames[i].message || this.inputNames[i],
                        resultCol: this.pvalue[i] && this.pvalue[i].message || (this.pvalue[i]).toFixed(7),
                        descCol: this.inputDescription[i] && this.inputDescription[i].message || this.inputDescription[i],
                        labelCol: this.inputLabel[i] && this.inputLabel[i].message || this.inputLabel[i],
                        modelCol: this.inputModel[i] && this.inputModel[i].message || this.inputModel[i],
                        distanceCol: this.distanceCDF[i] && this.distanceCDF[i].message || this.distanceCDF[i]
                    })
                }
                return tableData
            },

            inputDataSA: {
                get() {
                    return this.$store.state.sensitivityAnalysis.inputDataSA;
                },
                set(newInputData) {
                    this.$store.commit('setInputData', newInputData);
                }
            },

            eventSelected: {
                get() {
                    return this.$store.state.sensitivityAnalysis.eventSelected;
                },
                set(newEventSelected) {
                    this.$store.commit('setEventSelected', newEventSelected);
                }
            },
            eventSelectedStart: {
                get() {
                    return this.$store.state.sensitivityAnalysis.eventSelectedStart;
                },
                set(newEventSelected) {
                    this.$store.commit('setEventSelectedStart', newEventSelected);
                }
            },

            inputDataType: {
                get() {
                    return this.$store.state.sensitivityAnalysis.inputDataType;
                },
                set(newDataType) {
                    this.$store.commit('setObjectiveDataType', newDataType);
                }
            },

            divideDataBy: {
                get() {
                    return this.$store.state.sensitivityAnalysis.divideDataBy;
                },
                set(newDataBoundary) {
                    this.$store.commit('setDataDivision', newDataBoundary);
                }
            },

            cutoffValue: {
                get() {
                    return this.$store.state.sensitivityAnalysis.cutoffValue;
                },
                set(newCutoffVal) {
                    this.$store.commit('setCutoffVal', newCutoffVal);
                }
            },

            cutoffValue2: {
                get() {
                    return this.$store.state.sensitivityAnalysis.cutoffValue2;
                },
                set(newCutoffVal2) {
                    this.$store.commit('setCutoffVal2', newCutoffVal2);
                }
            },

            eventsOptions: {
                get() {
                    return this.$store.state.sensitivityAnalysis.eventsOptions;
                },
                set(newEventOptions) {
                    this.$store.commit('setEventOptions', newEventOptions);
                }
            },
            datasetOptions: {
                get() {
                    return this.$store.state.sensitivityAnalysis.datasetOptions;
                },
                set(newDatasetOptions) {
                    this.$store.commit('setDatasetOptions', newDatasetOptions);
                }
            },

            cutDatasetMin: {
                get() {
                    return this.$store.state.sensitivityAnalysis.cutDatasetMin;
                },
                set(newDatasetMin) {
                    this.$store.commit('setDatasetMin', newDatasetMin);
                }
            },

            cutDatasetMax: {
                get() {
                    return this.$store.state.sensitivityAnalysis.cutDatasetMax;
                },
                set(newDatasetMax) {
                    this.$store.commit('setDatasetMax', newDatasetMax);
                }
            },


            ...mapState({
                metricList: state => state.sensitivityAnalysis.metricList,
                pvalue: state => state.sensitivityAnalysis.pvalue,
                inputNames: state => state.sensitivityAnalysis.inputNames,
                inputDescription: state => state.sensitivityAnalysis.inputDescription,
                inputLabel: state => state.sensitivityAnalysis.inputLabel,
                inputModel: state => state.sensitivityAnalysis.inputModel,
                distanceCDF: state => state.sensitivityAnalysis.distanceCDF

            }),
            metricName: {
                get() {
                    return this.$store.state.sensitivityAnalysis.metricName;
                },
                set(newMetric) {
                    this.$store.commit('setMetricName', newMetric);
                }
            },



        },

        methods: {
            resetMainPlot() {
                //Resets the main plot
                let id = '#main-plot-sensitivity';
                d3.select(id).select('svg').remove();
                d3.select(id).selectAll('canvas').remove();
                //d3.select(id).style('width', 0 + 'px');
            },

            sendMetricName(event){
                this.$store.dispatch("getPValue");

            },

            updatePlot() {
                this.resetMainPlot();

                // Update width
                this.mainPlotParams.width = document.getElementById('sensitivity-analysis-content').clientWidth - 30;
                let margin = this.mainPlotParams.margin;
                let width = this.mainPlotParams.width;
                let height = this.mainPlotParams.height;
                let plotData = this.distanceCDF;
                let plotLabels = this.inputNames;
                console.log(plotData);

                var greyColor = "#898989";
                var barColor = d3.interpolateInferno(0.4);
                var highlightColor = d3.interpolateInferno(0.3);

                var svg = d3.select("#main-plot-sensitivity").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scaleBand()
                    .range([0, width])
                    .padding(0.4);
                var y = d3.scaleLinear()
                    .range([height, 0]);

                var xAxis = d3.axisBottom(x).tickValues(plotLabels);
                var yAxis = d3.axisLeft(y).tickSize([]).tickPadding(10);

                x.domain(plotLabels);
                y.domain([0, 1]);


                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dy", "2.0em")
                    .attr("transform", "rotate(-50)");

                svg.append("g")
                    .attr("class","y axis")
                    .call(yAxis);

                svg.selectAll(".bar")
                    .data(plotData)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .style("display", d => { return plotLabels === null ? "none" : null; })
                    .style("fill",  d => {
                        return plotLabels === d3.max(plotData,  d => { return plotLabels; })
                            ? highlightColor : barColor
                    })
                    .attr("x",  (d,i) => { return x(plotLabels[i]); })
                    .attr("width", x.bandwidth())
                    .attr("y",  d => { return height; })
                    .attr("height", 0)
                    .transition()
                    .duration(750)
                    .delay(function (d, i) {
                        return i * 150;
                    })
                    .attr("y",  d => { return y(d); })
                    .attr("height",  d => { return height - y(d); });

                // svg.selectAll(".label")
                //     .data(plotData)
                //     .enter()
                //     .append("text")
                //     .attr("class", "label")
                //     .style("display",  d => { return plotLabels === null ? "none" : null; })
                //     .attr("x", ( (d,i) => { return x(plotLabels[i]) + (x.bandwidth() / 2) -8 ; }))
                //     .style("fill",  d => {
                //         return plotLabels === d3.max(plotData,  d => { return plotLabels; })
                //             ? highlightColor : greyColor
                //     })
                //     .attr("y",  d => { return height; })
                //     .attr("height", 0)
                //     .transition()
                //     .duration(750)
                //     .delay((d, i) => { return i * 150; })
                //     .text( (d, i) => { return d.toExponential(2); })
                //     .attr("y",  d => { return y(d) + .1; })
                //     .attr("dy", "-.7em");
            }

        },

        mounted() {
            this.$store.dispatch("getMetricsList");
            this.updatePlot();
        },

        watch: {
            distanceCDF: function(val, oldVal) {
                this.updatePlot();
            },


        },

    }
</script>

<style scoped>

</style>