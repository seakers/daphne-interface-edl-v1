import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    edlDataset: [],
    casesSelection: "entire-dataset",
    metricName: "",
    metricList: [],
    plotTitle: "",
    plotIndex: "",
    percentileSelected: [],
    directionAnalysis: "",
    edlRule: [],
    edlComplexity: [],
    edlPrecision: [],
    edlRecall: [],
};

const initialState = _.cloneDeep(state);

const getters = {

};

const actions = {
    async getMetricsList({ state, commit, rootState }) {
        try {
            let dataResponse = await fetch(
                '/api/edl/metrics-of-interest',
                {
                    method: 'GET',
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setMetricsList', data['metrics_list']);
            }
            else {
                console.error('Error retreiving list of metrics.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async getSelectedPlot({ state, commit, rootState, getters}, plotIndex) {
        commit('setMetricName', state.metricName);
        commit('setPercentile', state.percentileSelected);
        commit('setDirection', state.directionAnalysis);
        try {
            let reqData = new FormData();
            if (state.casesSelection === "entire-dataset") {
                reqData.append("cases_option", "entire-dataset");
            }
            else if (state.casesSelection === "plot-selection") {
                reqData.append("cases_option", "plot-selection");
                reqData.append('selected_cases_dm',  getters.getSelectedCaseNumbers(plotIndex));
            }
            reqData.append('metric_name', state.metricName);
            reqData.append('percentile', state.percentileSelected);
            reqData.append('direction', state.directionAnalysis);

            let dataResponse = await fetchPost('/api/edl/edl-data-mining', reqData);
            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setMetricsList', data['metrics_list']);
                commit('setRules', data['rules']);
                commit('setComplexity',  data['complexity']);
                commit('setPrecision',  data['precision']);
                commit('setRecall',  data['recall'])

            }
            else {
                console.error('Error retreiving Scorecard Status.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
        commit('setIsLoading', false);
    },


};

const mutations = {
    setCasesSelection(state, casesSelection){
        state.casesSelection = casesSelection;
    },
    setMetricName(state, metricName) {
        state.metricName = metricName;
    },
    setMetricsList(state, metricsList){
        state.metricList = metricsList;
    },
    setPlotIndex(state, plotIndex){
        state.plotIndex = plotIndex;
    },
    setPercentile(state, percentileSelected) {
        state.percentileSelected = percentileSelected;
    },
    setDirection(state, directionAnalysis) {
        state.directionAnalysis = directionAnalysis;
    },
    setComplexity(state, complexity) {
        state.edlComplexity = complexity;
    },
    setRules(state, rules) {
        state.edlRule  = rules;
    },
    setPrecision(state, precision) {
        state.edlPrecision = precision;
    },
    setRecall(state, recall) {
        state.edlRecall = recall;
    },
};


export default {
    state,
    getters,
    actions,
    mutations
}
