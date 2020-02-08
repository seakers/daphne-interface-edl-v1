// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    metricList: [],
    metricName: "",
    pvalue: [],
    inputNames: [],
    inputDescription: [],
    inputLabel: [],
    inputModel: [],
    distanceCDF: [],
    inputDataSA: "",
    eventSelected: "",
    eventSelectedStart: "",
    inputDataType: "",
    divideDataBy: "",
    cutoffValue: "",
    cutoffValue2: "",
    eventsOptions: "",
    datasetOptions: "",
    cutDatasetMin: "",
    cutDatasetMax: "",


};

const initialState = _.cloneDeep(state);

// getters
const getters = {

};

// actions
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

    async getPValue({ state, commit, rootState }) {
        commit('setMetricName', state.metricName);
        commit('setInputData', state.inputDataSA);
        commit('setEventSelected', state.eventSelected);
        commit('setObjectiveDataType', state.inputDataType);
        commit('setDataDivision', state.divideDataBy);
        commit('setCutoffVal', state.cutoffValue);
        commit('setCutoffVal2', state.cutoffValue2);
        commit('setEventOptions', state.eventsOptions);
        commit('setDatasetOptions', state.datasetOptions);
        commit('setDatasetMin', state.cutDatasetMin);
        commit('setDatasetMax', state.cutDatasetMax);
        commit('setEventSelectedStart', state.eventSelectedStart);
        try {
            let reqData = new FormData();
            reqData.append("metric_name", state.metricName);
            reqData.append("input_data_type", state.inputDataSA);
            reqData.append("event_selection", state.eventSelected);
            reqData.append("data_type", state.inputDataType);
            reqData.append("divide_data_by", state.divideDataBy);
            reqData.append("cutoff_val", state.cutoffValue);
            reqData.append("cutoff_val2", state.cutoffValue2);
            reqData.append("event_opts", state.eventsOptions);
            reqData.append("dataset_opts", state.datasetOptions);
            reqData.append("dataset_min", state.cutDatasetMin);
            reqData.append("dataset_max", state.cutDatasetMax);
            reqData.append("event_start", state.eventSelectedStart);


            let dataResponse = await fetchPost('/api/edl/sensitivity-analysis', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setPVal', data['pvals']);
                commit('setInputName', data['input_name']);
                commit('setInputDescr', data['input_description']);
                commit('setInputLabel', data['input_label']);
                commit('setInputModel', data['input_model']);
                commit('setDistanceCDF', data['distance'])

            }
            else {
                console.error('Error processing the command.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
        commit('setIsLoading', false);
    },
};



// mutations
const mutations = {
    setMetricsList(state, metricsList){
        state.metricList = metricsList;
    },
    setMetricName(state, metricName){
        state.metricName = metricName;
    },
    setPVal(state, pvalue){
        state.pvalue = pvalue;
    },
    setInputName(state, input_name){
        state.inputNames = input_name;
    },
    setInputDescr(state, description){
        state.inputDescription = description;
    },
    setInputLabel(state, input_label){
        state.inputLabel = input_label;
    },
    setInputModel(state, input_model){
        state.inputModel = input_model;
    },
    setDistanceCDF(state, distance){
        state.distanceCDF = distance;
    },
    setInputData(state, inputDataSA){
        state.inputDataSA = inputDataSA;
    },
    setEventSelected(state, eventSelected){
        state.eventSelected = eventSelected;
    },
    setEventSelectedStart(state, eventSelectedStart){
        state.eventSelectedStart = eventSelectedStart;
    },

    setObjectiveDataType(state, inputDataType){
        state.inputDataType = inputDataType;
    },
    setDataDivision(state, divideDataBy){
        state.divideDataBy = divideDataBy;
    },
    setCutoffVal(state, cutoffValue){
        state.cutoffValue = cutoffValue;
    },
    setCutoffVal2(state, cutoffValue2){
        state.cutoffValue2 = cutoffValue2;
    },
    setEventOptions(state, eventOptions){
        state.eventsOptions = eventOptions;
    },
    setDatasetOptions(state, datasetOptions){
        state.datasetOptions = datasetOptions;
    },
    setDatasetMin(state, cutDatasetMin){
        state.cutDatasetMin = cutDatasetMin;
    },
    setDatasetMax(state, cutDatasetMax){
        state.cutDatasetMax = cutDatasetMax;
    },

};

export default {
    state,
    getters,
    actions,
    mutations
}
