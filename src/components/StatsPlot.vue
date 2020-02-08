<template>
    <div class="column">
        <section class="panel">
            <p class="panel-heading">
                Variable Statistics Plot | {{ plotInfo.title }}
                <span style="float:right;">
                   <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fas fa-times"></span></span></a>
                </span>
            </p>
            <div class="panel-block" v-bind:id="'plot' + plotId + '-block'">
                <div v-bind:id="'plot' + plotId"></div>

            </div>
        </section>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import 'd3-selection-multi';
    let jStat = require('jStat').jStat;
    import {mapGetters, mapMutations, mapState} from 'vuex';

    export default {
        name: 'StatsPlot',
        props: ['plotInfo', 'plotId'],
        data() {
            return {
                plotOverlap:  false,
                mainPlotParams: {
                    margin: {top: 20, right: 60, bottom: 30, left: 60},
                    width: 960,
                    height: 450,
                    scale: 1
                },
                transform: d3.zoomIdentity,
                zoom: {},
                xMap: {},
                yMapHist: {},
                yMapCum: {},

            }
        },

        computed: {
            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },

            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            },

            ...mapState({
                plotData(state) { return state.generalPlot.plotList[this.plotId].plotData; }
            })

        },
        methods: {

            resetMainPlot() {
                //Resets the main plot
                let id = '#plot' + this.plotId;
                d3.select(id).select('svg').remove();
                d3.select(id).selectAll('canvas').remove();
                d3.select(id).style('width', 0 + 'px');
            },

            updatePlot() {
                this.resetMainPlot();


                // Update width
                let id = '#plot' + this.plotId;
                let blockId = 'plot' + this.plotId + '-block';
                console.log(blockId, document.getElementById(blockId));
                this.mainPlotParams.width = document.getElementById(blockId).clientWidth - 30;
                let margin = this.mainPlotParams.margin;
                let plotData = this.plotData;


                // Get maximums and minimums and use accessor to get numerical value
                console.log(plotData);
                let minimum = d3.min(plotData, d => d);
                let maximum = d3.max(plotData, d => d);

                // Set the axes
                // x-axis
                let x = d3.scaleLinear().domain([minimum, maximum]).range([0, this.plotWidth]); // values from data object
                let xValue = d => d;
                this.xMap = d => x(xValue(d));
                console.log(x);

                // y-axis
                let yhist = d3.scaleLinear().range([this.plotHeight, 0]);
                let ycum = d3.scaleLinear().domain([0, 1]).range([this.plotHeight, 0]);


                // Setup the histogram
                let histogram = d3.histogram()
                    .value(d => d)
                    .domain(x.domain());

                // group the data for the bars
                let bins = histogram(plotData);

                // Scale the range of the data in the y domain
                yhist.domain([0, d3.max(bins, d => d.length)]);

                // let yValue = d => elem[yIndex];
                // this.yMapHist = d => yhist(yValue(d));
                // this.yMapCum = d => ycum(yValue(d));

                console.log('this works?');
                // zoom into plot
                this.zoom = d3.zoom()
                    .scaleExtent([0.4, 25])
                    .on('zoom', d => {
                        this.transform = d3.event.transform;
                        gX.call(xAxis.scale(this.transform.rescaleX(x)));
                        let newXScale = this.transform.rescaleX(x);
                        bar
                            .attr('transform', d => 'translate(' + newXScale(d.x0) + ',' + yhist(d.length) + ')')
                            .attr('width', d => 0.99*(newXScale(d.x1) - newXScale(d.x0)));
                        line
                            .x(d => newXScale(d.x0));
                        svgline
                            .attr('d', line)

                    });


                // Draw svg
                let svg = d3.select(id)
                    .append('svg')
                    .style('position', 'absolute')
                    .attr('width', this.plotWidth + margin.left + margin.right)
                    .attr('height', this.plotHeight + margin.top + margin.bottom)
                    .call(this.zoom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Draw histogram
                let bar = svg.selectAll('rect.bar')
                    .data(bins)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', 1)
                    .attr('transform', d => 'translate(' + x(d.x0) + ',' + yhist(d.length) + ')')
                    .attr('width', d => x(d.x1) - x(d.x0) - 1)
                    .attr('height', d => this.plotHeight - yhist(d.length))
                    .on("mouseover", (d,i) => {
                    svg.append("text")
                        .attr("id", "t_oc" + i)  // Create an id for text so we can select it later for removing on mouseout
                        .attr( "y", function() { return (yhist(d.length)); })
                        .attr( "x", function() { return (x(d.x0)) - 5; })
                        .attr("fill", "red")
                        .attr("font-size","20px")
                        .attr("font-weight", "bold")
                        .text(function() {
                            return [d.length];  // Value of the text
                        });
                })
                    .on("mouseout", (d,i) => {
                        d3.select("#t_oc" + i).remove();
                    });


                let jstat = jStat(plotData, d => d);
                for (let i = 0; i < bins.length; i++) {
                    bins[i]['cum'] = jstat.normal(jstat.mean(), jstat.stdev()).cdf(bins[i].x0);
                }

                console.log(bins);

                console.log('hey 9');
                // Draw CDF line
                var line = d3.line()
                    .x(d => x(d.x0)) // set the x values for the line generator
                    .y(d => ycum(d.cum)) // set the y values for the line generator
                    .curve(d3.curveMonotoneX); // apply smoothing to the line

                console.log(line);

                console.log('hey 10');
                let svgline = svg.append('path')
                    .datum(bins)
                    .attr('d', line)
                    .attr('class', 'line');

                console.log('hey 11');
                // Draw axes
                // add the x Axis
                let xAxis = d3.axisBottom(x);

                // add the y Axis
                let yAxis = d3.axisLeft(yhist);
                let yAxis2 = d3.axisRight(ycum);

                // x-axis
                let gX = svg.append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', 'translate(0, ' + this.plotHeight + ')')
                    .style('font-size', '20px')
                    .call(xAxis);

                svg.append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .style('font-size', '20px')
                    .text('Value');

                // y-axis
                let gY = svg.append('g')
                    .attr('class', 'axis axis-y')
                    .style('font-size', '20px')
                    .call(yAxis)
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .style('font-size', '20px')
                    .text('Count (Histogram)');

                let gY2 = svg.append('g')
                    .attr('class', 'axis axis-y')
                    .attr('transform', 'translate(' + this.plotWidth + ', 0)')
                    .style('font-size', '20px')
                    .call(yAxis2)
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', 'translate(-30,0) rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .style('font-size', '20px')
                    .text('CDF');

                d3.select(id)
                    .style('width', this.mainPlotParams.width + 'px')
                    .style('height', this.mainPlotParams.height + 'px');





            },

            remove: function() {
                this.$store.commit('removePlot', this.plotId);
                // PubSub.publish(functionality + '_removed', funcId);
            },

        },

        mounted() {
            // Tutorial
            this.updatePlot();
        },
        watch: {
            plotData: function(val, oldVal) {
                this.updatePlot();
            },

        },

    }
</script>

<style>
    rect.bar {
        fill: steelblue;
        shape-rendering: crispEdges;
    }
    .axis path, .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }
    .line {
        fill: none;
        stroke: purple;
        stroke-width: 1.5px;
    }
</style>