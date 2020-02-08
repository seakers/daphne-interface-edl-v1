<template>
    <div class="column is-full">
        <section class="panel">
            <p class="panel-heading">
                Scatter Plot | {{ xaxis }} vs {{ yaxis }}
                <span style="float:right;">
                   <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fas fa-times"></span></span></a>
                </span>
            </p>
            <div class="panel-block" v-bind:id="'plot' + plotId + '-block'" style="position: relative;">
                <div v-bind:id="'plot' + plotId"></div>
                <div id = "user-selections-block">
                    <div class = "card" id = "interaction_modes">
                        <header class="card-header">
                            <p class = "card-header-title">
                                Mouse Selection
                            </p>
                        </header>
                        <div class= "card-content control is-small">
                            <div class = "tooltip">
                                <label class="radio">
                                    Zoom/Pan:
                                    <input type="radio" name="mouse-selection" value="zoom-pan" v-model="selectionMode" />
                                </label>
                            </div>
                            <div class = "tooltip">
                                <label class = "radio">
                                    Drag-Select:
                                    <input type="radio" name = "mouse-selection" value="drag-select" v-model="selectionMode" />
                                </label>
                            </div>
                            <div class="tooltip">
                                <label class="radio">
                                    Deselect:
                                    <input type="radio" name = "mouse-selection" value="de-select" v-model="selectionMode" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content is-small">
                            <div class="field">
                                <p class="control">
                                    <button class="button" id = "cancel-selection" v-on:click="cancelSelection">Cancel all selections</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import {mapGetters, mapMutations, mapState} from 'vuex';
    import * as _ from "lodash-es";

    export default {
        name: "scatter-plot",
        props: ['plotInfo', 'plotId'],
        data() {
            return {
                mainPlotParams: {
                    margin: {top: 20, right: 20, bottom: 30, left: 90},
                    width: 960,
                    height: 450,
                    scale: 1
                },
                transform: d3.zoomIdentity,
                zoom: {},
                xMap: {},
                yMap: {},
                selectedCase: -1,
                context: {},
                hiddenContext: {},
            }
        },


        computed: {

            ...mapState({
                problemData: state => state.problem.problemData,
                plotData(state) { return state.generalPlot.plotList[this.plotId].plotData; },  // this is equal to tradespaceplot
                colorMap(state) { return state.generalPlot.plotList[this.plotId].colorMap; },
                hoveredArch(state) {return state.generalPlot.plotList[this.plotId].hoveredArch;} ,
                clickedCase(state) {return state.generalPlot.plotList[this.plotId].clickedCase; },
                numPoints(state) {return state.generalPlot.plotList[this.plotId].numPoints;},
                selectedCases(state) {return state.generalPlot.plotList[this.plotId].selectedCases;},
                highlightedArchs(state) {return state.generalPlot.plotList[this.plotId].highlightedArchs;},
                hiddenArchs(state) {return state.generalPlot.plotList[this.plotId].hiddenArchs;},
                currentExpression(state) {return state.generalPlot.plotList[this.plotId].currentExpression;},
                xaxis(state) {return state.generalPlot.plotList[this.plotId].xaxis},
                yaxis(state) {return state.generalPlot.plotList[this.plotId].yaxis},
                websocket: state => state.websocket
            }),

            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },

            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            },

            numSelectedPoints() {
                return this.selectedCases.filter(point => point).length;
            },

            selectionMode: {
                get(){
                    return this.$store.state.generalPlot.plotList[this.plotId].selectionMode;
                },
                set(newSelectionMode) {
                    this.$store.commit('updateSelectionMode', { index: this.plotId, selectionMode: newSelectionMode });
                }
            }

        },
        methods: {

            ...mapMutations([
                'updateHoveredArch',
            ]),

            remove: function() {
                this.$store.commit('removePlot', this.plotId);
                // PubSub.publish(functionality + '_removed', funcId);
            },

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

                // setup x
                let xValue = d => d.x; // data -> value
                let xScale = d3.scaleLinear().range([0, this.plotWidth]); // value -> display
                // don't want dots overlapping axis, so add in buffer to data domain
                let xBuffer = Math.max((d3.max(plotData, xValue) - d3.min(plotData, xValue)) * 0.05, 0.05);
                xScale.domain([d3.min(plotData, xValue) - xBuffer, d3.max(plotData, xValue) + xBuffer]);
                this.xMap = d => xScale(xValue(d)); // data -> display
                let xAxis = d3.axisBottom(xScale);

                // setup y
                let yValue = d => d.y; // data -> value
                let yScale = d3.scaleLinear().range([this.plotHeight, 0]); // value -> display
                let yBuffer = Math.max((d3.max(plotData, yValue) - d3.min(plotData, yValue)) * 0.05, 0.05);
                yScale.domain([d3.min(plotData, yValue) - yBuffer, d3.max(plotData, yValue) + yBuffer]);
                this.yMap = d => yScale(yValue(d)); // data -> display
                let yAxis = d3.axisLeft(yScale);

                d3.select(id)
                    .style('width', this.mainPlotParams.width + 'px')
                    .style('height', this.mainPlotParams.height + 'px');

                this.zoom = d3.zoom()
                    .scaleExtent([0.4, 25])
                    .on('zoom', d => {
                        this.transform = d3.event.transform;
                        gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                        gY.call(yAxis.scale(this.transform.rescaleY(yScale)));
                        dots.attr("transform", d3.event.transform);
                        //this.drawPoints(this.context, false);
                    });

                let svg = d3.select(id)
                    .append('svg')
                    .style('position', 'absolute')
                    .attr('width', this.plotWidth + margin.left + margin.right)
                    .attr('height', this.plotHeight + margin.top + margin.bottom)
                    .call(this.zoom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                let canvas = d3.select(id)
                    .append('canvas')
                    .style('position', 'absolute')
                    .style('top', margin.top + 'px')
                    .style('left', margin.left + 'px')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight)
                    .call(this.zoom)
                    .style('display', 'none');

                this.context = canvas.node().getContext('2d');

                let hiddenCanvas = d3.select(id)
                    .append('canvas')
                    .style('position', 'absolute')
                    .style('top', margin.top + 'px')
                    .style('left', margin.left + 'px')
                    .style('display', 'none')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight);

                this.hiddenContext = hiddenCanvas.node().getContext('2d');

                // x-axis
                let gX = svg.append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', 'translate(0, ' + this.plotHeight + ')')
                    .style('font-size', '20px')
                    .call(xAxis);

                svg.append('text')
                    .attr('transform', 'translate(' + this.plotWidth + ', ' + this.plotHeight + ')')
                    .attr('class', 'label')
                    .attr('y', -6)
                    .style('text-anchor', 'end')
                    .style('font-size', '20px')
                    .text(this.xaxis);

                // y-axis
                let gY = svg.append('g')
                    .attr('class', 'axis axis-y')
                    .style('font-size', '20px')
                    .call(yAxis);

                svg.append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .style('font-size', '14px')
                    .text(this.yaxis);

                // Functions for the canvas. Canvas is like a brush that draws over our data


                // Add the scatterplot
                let self = this;
                let dots = svg.selectAll("dot")
                    .data(plotData)
                    .enter().append("circle")
                    .attr("r", 4)
                    .attr("cx", d => this.xMap(d))
                    .attr("cy", d => this.yMap(d))
                    .attr("fill", "gray")
                    .on("mouseover", (d,i) => {
                        this.selectedCase = d.extra_info.output_case;
                        svg.append("text")
                            .attr("id", "t_oc" + i)  // Create an id for text so we can select it later for removing on mouseout
                            .attr( "x", function() { return xScale(d.x) - 200; })
                            .attr( "y", function() { return yScale(d.y) - 15; })
                            .attr("fill", "blue")
                            .attr("font-size","20px")
                            .attr("font-weight", "bold")
                            .attr("font-weight", "bold")
                        .text(function() {
                            return ["x:" + Number((d.x).toFixed(2)),
                                "y:" +  Number((d.y).toFixed(2)),
                                "case#"+ d.extra_info.output_case];  // Value of the text
                        });

                    })
                    .on("mouseout", (d,i) => {
                        d3.select("#t_oc" + i).remove();
                    })
                    .on("click", function (d,i) {
                        self.$store.commit("updateClickedCase", { index: self.plotId, clickedCase: d.extra_info.output_case });
                        self.$store.commit("updateClickedPoint", { index: self.plotId, clickedPoint: i });
                        self.updateColors();
                        // d3.select(this)
                        //     .transition()
                            //.attr('fill', "#ff0000");
                    });
                function wrap(text, width) {
                    text.each(function () {
                        var text = d3.select(this),
                            words = text.text().split(/\s+/).reverse(),
                            word,
                            line = [],
                            lineNumber = 0,
                            lineHeight = 1.1, // ems
                            y = text.attr("y"),
                            dy = parseFloat(text.attr("dy")),
                            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));
                            if (tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                            }
                        }
                    });
                }

                // Canvas related function
                // this.drawPoints(this.context, false);

                // Restore old zoom values if they are there
                gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                gY.call(yAxis.scale(this.transform.rescaleY(yScale)));
            },

            // Draw points under canvas
            updateColors() {
                console.log('RIP')
                let id = "#plot" + this.plotId;
                let svg = d3.select(id).select('svg');
                console.log(svg.selectAll("circle"));
                let dots = svg.selectAll("circle")
                    .attr("fill", (d, i) => this.$store.getters.getScatterPointColor(this.plotId, i));
            },

            getPointUnderMouse() {
                /// Here we have to get the points as the canvas is drawn
                // this.drawPoints(this.hiddenContext, true); // we defined this function already and now we want the values

                let id = "#plot" + this.plotId;

                // Get mouse positions under the drawn canvas
                let mousePos = d3.mouse(d3.select(id).select('canvas').node());
                let mouseX = mousePos[0];
                let mousey = mousePos[1]; // set origin

                let color = this.hiddenContext.getImageData(mouseX-3, mouseY-3, 6, 6).data;
                let colorList = {};
                for (let i = 0; i < color.length; i += 4) {
                    let colorRgb = 'rgb(' + color[i] + ',' + color[i+1] + ',' + color[i+2] + ')';
                    if (colorRgb in colorList) {
                        colorList[colorRgb] += 1;
                    }
                    else {
                        colorList[colorRgb] = 1;
                    }
                }
                let maxcolor = -1;
                let maxcolor_num = 0;
                for (let key in colorList) {
                    if (maxcolor_num < colorList[key]) {
                        maxcolor_num = colorList[key];
                        maxcolor = key;
                    }
                }
                if (maxcolor === 0) {
                    maxcolor = -1;
                }
                return maxcolor;

            },

            canvasMouseMove(){
                let pointColor = this.getPointUnderMouse();

                // Get the data from the map
                if (pointColor in this.colorMap){
                    let point = this.colorMap[pointColor];
                    // update when there is a change iin the selection
                    if (this.hoveredArch !== point) {
                        this.hoveredArch(point);
                    }
                }

                else {
                    if (this.hoveredArch !== -1){
                        this.updateHoveredArch(-1); // revert to normal if nothing is selected
                    }
                }
            },

            canvasClick(){
                let pointColor = this.getPointUnderMouse();

                // get data on click
                if (pointColor in this.colorMap){
                    let point = this.colorMap[pointColor];
                    // update upon change
                    if (this.clickedArch !== point){
                        this.updateClickedArch(point)
                    }
                }
            },

            cancelSelection(){
                this.$store.commit('clearSelectedCases', this.plotId);
            },


        },
        mounted() {
            // Tutorial
            this.updatePlot();
        },
        watch: {
            plotData: function(val, oldVal) {
                this.updatePlot();
                console.log(val);
            },

            hoveredArch: function(val, oldVal) {
                // this.drawPoints(this.context, false);
            },
            clickedArch: function(val, oldVal) {
                // this.drawPoints(this.context, false);
            },


            selectionMode: function(val, oldVal) {
                let margin = this.mainPlotParams.margin;
                let width  = this.mainPlotParams.width;
                let height = this.mainPlotParams.height;

                let id = "#plot" + this.plotId;

                if (this.selectionMode === 'zoom-pan') { // Zoom
                    d3.select(id).select('svg')
                        .on('mousedown.modes',null)
                        .on('mousemove.modes',null)
                        .on('mouseup.modes',null)
                        .call(this.zoom);
                    d3.select(id).selectAll('canvas')
                        .on('mousedown.modes',null)
                        .on('mousemove.modes',null)
                        .on('mouseup.modes.modes',null)
                        .call(this.zoom);
                }
                else {
                    let svg = d3.select(id).select('svg')
                        .on('.zoom', null);
                    let canvases = d3.select(id).selectAll('canvas')
                        .on('.zoom', null);
                    let self = this;
                    let justSelectedCases = new Set();
                    function selectMousedown() {
                        let mousePos = d3.mouse(this);
                        svg.append('rect')
                            .attrs(
                                {
                                    rx     : 0,
                                    ry     : 0,
                                    class  : 'selection',
                                    x      : mousePos[0],
                                    y      : mousePos[1],
                                    width  : 0,
                                    height : 0,
                                    x0     : mousePos[0],
                                    y0     : mousePos[1]
                                })
                            .style('background-color', '#EEEEEE')
                            .style('opacity', 0.18);
                            //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                        justSelectedCases = new Set();
                    }
                    function selectMousemove() {
                        let selection = svg.select('rect.selection');
                        if (!selection.empty()) {
                            let selectionUpdated = false;
                            let mousePos = d3.mouse(this);
                            let box = {
                                x      : parseInt(selection.attr('x'), 10),
                                y      : parseInt(selection.attr('y'), 10),
                                x0     : parseInt(selection.attr('x0'), 10),
                                y0     : parseInt(selection.attr('y0'), 10),
                                width  : parseInt(selection.attr('width'), 10),
                                height : parseInt(selection.attr('height'), 10)
                            };
                            let move = {
                                x : mousePos[0] - box.x0,
                                y : mousePos[1] - box.y0
                            };
                            if (move.x < 0) {
                                box.x = box.x0 + move.x;
                            }
                            else {
                                box.x = box.x0;
                            }
                            if (move.y < 0) {
                                box.y = box.y0 + move.y;
                            }
                            else {
                                box.y = box.y0;
                            }
                            box.width = Math.abs(move.x);
                            box.height = Math.abs(move.y);
                            selection.attrs(box);
                            let newSelectedCases = self.selectedCases.slice();

                            if (self.selectionMode === 'drag-select') { // Make selection
                                self.plotData.forEach((point, index) => {
                                    let tx = self.transform.applyX(self.xMap(point)) + self.mainPlotParams.margin.left;
                                    let ty = self.transform.applyY(self.yMap(point)) + self.mainPlotParams.margin.top;
                                    if( tx >= box.x && tx <= box.x + box.width &&
                                        ty >= box.y && ty <= box.y + box.height)
                                    {
                                        if (!self.selectedCases[index]) {
                                            // Select
                                            newSelectedCases[index] = true;
                                            justSelectedCases.add(index);
                                            selectionUpdated = true;
                                        }
                                    }
                                    else {
                                        if (justSelectedCases.has(index)) {
                                            // Select
                                            newSelectedCases[index] = false;
                                            justSelectedCases.delete(index);
                                            selectionUpdated = true;
                                        }
                                    }
                                });
                            }
                            else {  // De-select
                                self.plotData.forEach((point, index) => {
                                    let tx = self.transform.applyX(self.xMap(point));
                                    let ty = self.transform.applyY(self.yMap(point));
                                    if( tx >= box.x && tx <= box.x + box.width &&
                                        ty >= box.y && ty <= box.y + box.height)
                                    {
                                        if (self.selectedCases[index]) {
                                            newSelectedCases[index] = false;
                                            justSelectedCases.add(index);
                                            selectionUpdated = true;
                                        }
                                    }
                                    else {
                                        if (justSelectedCases.has(index)) {
                                            newSelectedCases[index] = true;
                                            justSelectedCases.delete(index);
                                            selectionUpdated = true;
                                        }
                                    }
                                });
                            }
                            if (selectionUpdated) {
                                self.$store.commit('updateSelectedCases', { index: self.plotId, selectedCases: newSelectedCases });
                            }
                        }
                    }
                    function selectMouseup() {
                        // remove selection frame
                        svg.selectAll('rect.selection').remove();
                        justSelectedCases.clear();
                    }
                    svg.on('mousedown.modes', selectMousedown)
                        .on('mousemove.modes', selectMousemove)
                        .on('mouseup.modes', selectMouseup);
                    canvases.on('mousedown.modes', selectMousedown)
                        .on('mousemove.modes', selectMousemove)
                        .on('mouseup.modes', selectMouseup);
                }
            },

            selectedCases: function(val, oldVal) {
                this.updateColors();
            }
        },
    }
</script>

<style scoped>

</style>