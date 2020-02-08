// initial state
// shape: [{ id, quantity }]
import * as _ from 'lodash-es';



const state = {
    plotList: []
};

const initialState = _.cloneDeep(state);


// getters
const getters = {
    getScatterPointColor: (state) => (plotIndex, caseIndex) => {
        //console.log('why is this shit happening');
        console.log(state.plotList[plotIndex].plotData[caseIndex].is_failed_case);
        if (state.plotList[plotIndex].plotData[caseIndex].is_failed_case)
            return state.plotList[plotIndex].colorList.fail_case;
        if (state.plotList[plotIndex].plotData[caseIndex].is_flagged_case)
            return state.plotList[plotIndex].colorList.flag_case;
        if (state.plotList[plotIndex].clickedPoint === caseIndex) {
            return state.plotList[plotIndex].colorList.important;
        }
        else {
            if (state.plotList[plotIndex].hoveredCase-1 === caseIndex) {
                return state.plotList[plotIndex].colorList.mouseover;
            }
            else {
                if (state.plotList[plotIndex].selectedCases[caseIndex]) {
                    return state.plotList[plotIndex].colorList.selected;
                }
                else {
                    return state.plotList[plotIndex].colorList.default;
                }
            }
        }
    },
    getScatterPointShape: (state) => (index) => {
        if (state.clickedArch === index) {
            return 'cross';
        }
        else {
            return 'circle';
        }
    },
    getSelectedCaseNumbers: (state) => (index) => {
        let selectedCaseNumbers = [];
        for (let caseIndex in state.plotList[index].selectedCases){
            selectedCaseNumbers.push(state.plotList[index].plotData[caseIndex].extra_info.output_case);
        }
        return selectedCaseNumbers;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {


    addScatterPlot (state, plotInfo) {
        let plot = {};
        plot.plotData = plotInfo.plot_info.plot_data;
        plot.title =  plotInfo.plot_info.title;
        plot.xaxis = plotInfo.plot_info.x_axis;
        plot.yaxis = plotInfo.plot_info.y_axis;
        plot.type = plotInfo.type;

        plot.colorList = {
        default: 'rgba(110,110,110,255)',
                selected: 'rgba(25,186,215,255)',
                highlighted: 'rgba(248,101,145,255)',
                overlap: 'rgba(163,64,240,255)',
                mouseover: 'rgba(116,255,110,255)',
                hidden: 'rgba(110,110,110,22)',
                important: 'rgba(255,0,0,255)',
                ga: 'rgba(0,0,255,255)',
                fail_case: 'rgb(237, 12, 12, 255)',
                flag_case: 'rgb(240, 211, 65, 255)'
        };

        plot.clickedCase = -1;
        plot.clickedPoint = -1;
        plot.hoveredCase = -1;
        plot.colorMap = {};
        plot.selectionMode = 'zoom-pan';
        plot.selectedCases = [];
        plot.nextColor = 1;
        plot.plotData.fail_case= [];
        plot.plotData.flag_case= [];

        state.plotList.push(plot);
    },

    addStatsPlot(state, plotInfo){
        console.log(plotInfo);
        let plot = {};
        plot.plotData = plotInfo.plot_info.plot_data;
        plot.title =  plotInfo.plot_info.title;
        plot.type = plotInfo.type;
        console.log(plot);

        state.plotList.push(plot);

    },

    removePlot(state, index){
        state.plotList.splice(index, 1);
    },


    updateClickedPoint(state, { index, clickedPoint }) {
        state.plotList[index].clickedPoint = clickedPoint;
    },

    updatePlotData(state, problemData) {
        let plotData = JSON.parse(JSON.stringify(problemData));
        // Create aux arrays
        state.selectedCases = [];
        state.selectedCases.length = plotData.length;
        state.selectedCases.fill(false);
        state.highlightedArchs = [];
        state.highlightedArchs.length = plotData.length;
        state.highlightedArchs.fill(false);
        state.hiddenArchs = [];
        state.hiddenArchs.length = plotData.length;
        state.hiddenArchs.fill(false);

        // Function to create new colours for the picking.
        function genColor() {
            let ret = [];
            if (state.nextColor < 16777215) {
                ret.push(state.nextColor & 0xff); // R
                ret.push((state.nextColor & 0xff00) >> 8); // G
                ret.push((state.nextColor & 0xff0000) >> 16); // B
                state.nextColor += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        // Add one unique color to each point and save the backreference
        state.colorMap = {};
        plotData.forEach((point, index) => {
            point.interactColor = genColor();
            state.colorMap[point.interactColor] = index;
        });

        state.plotData = plotData;
    },
    addPlotData(state, problemData) {
        // Function to create new colours for the picking.
        function genColor() {
            let ret = [];
            if (state.nextColor < 16777215) {
                ret.push(state.nextColor & 0xff); // R
                ret.push((state.nextColor & 0xff00) >> 8); // G
                ret.push((state.nextColor & 0xff0000) >> 16); // B
                state.nextColor += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        let lengthDiff = problemData.length - state.plotData.length;
        for (let i = 0; i < lengthDiff; ++i) {
            state.selectedCases.push(false);
            state.highlightedArchs.push(false);
            state.hiddenArchs.push(false);
            state.gaArchs.push(false);
            let plotPoint = JSON.parse(JSON.stringify(problemData[state.plotData.length+i]));
            plotPoint.interactColor = genColor();
            state.colorMap[plotPoint.interactColor] = state.plotData.length+i;
            state.plotData.push(plotPoint);
        }

        if (lengthDiff !== 0) {
            state.clickedArch = state.plotData.length - 1;
        }
    },
    updateClickedCase(state, { index, clickedCase }) {
        state.plotList[index].clickedCase = clickedCase;
    },
    updateHoveredArch(state, hoveredArch) {
        state.hoveredArch = hoveredArch;
    },
    updateSelectionMode(state, { index, selectionMode }) {
        state.plotList[index].selectionMode = selectionMode;
    },
    updateSelectedCases(state, { index, selectedCases }) {
        console.log(index);
        console.log(selectedCases);
        console.log(typeof selectedCases);
        state.plotList[index].selectedCases = selectedCases;
    },
    updateHighlightedArchs(state, highlightedArchs) {
        state.highlightedArchs = highlightedArchs;
    },
    clearSelectedCases(state, index ) {
        state.plotList[index].selectedCases = [];
        state.plotList[index].selectedCases.length = state.plotData.length;
        state.plotList[index].selectedCases.fill(false);
    },
    clearHighlightedArchs(state) {
        state.highlightedArchs = [];
        state.highlightedArchs.length = state.plotData.length;
        state.highlightedArchs.fill(false);
    },
    resetTradespacePlot(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreTradespacePlot(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
