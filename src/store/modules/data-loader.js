import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    edlDataset: [],
    scorecardStatus: "",
    cormatStatus:"",
    missionSelected: "",
    dbID: "",
    dbDescr: "",
    metricsAvail: [],
    varsAvail: [],
    dbLoadStatus: ''
};

const initialState = _.cloneDeep(state);

const getters = {

};

const actions = {
    async loadEDLDataset({commit}, fileName) {
        commit('updateEDLDataset', state.edlDataset);
        try {
            let reqData = new FormData();
            reqData.append('filename', fileName);

            let dataResponse = await fetchPost('/api/edl/import-data', reqData);

            if (dataResponse.ok){
                let data = await dataResponse.json();
                commit('updateEDLDataset', data);
                commit('setScorecardStatus', data['scorecard_status']);
                commit('setCorMatStatus', data['cormat_status']);
                commit('setMetricsAvail', data['metrics_available']);
                commit('setVarsAvail', data['list_variables'])
            }
            else {
                // Display error
            }
        }
        catch (e) {
            // Display error
        }
    },

    async loadEDLDatasetDB({commit}, fileName) {
        commit('updateEDLDataset', state.edlDataset);
        commit('updateMission', state.missionSelected);
        commit('updateID', state.dbID);
        commit('updateDescr', state.dbDescr);
        try {
            let reqData = new FormData();
            reqData.append('filename', fileName);
            reqData.append('mission_name', state.missionSelected);
            reqData.append('db_ID', state.dbID);
            reqData.append('db_description', state.dbDescr);


            let dataResponse = await fetchPost('/api/edl/import-data-db', reqData);

            if (dataResponse.ok){
                let data = await dataResponse.json();
                commit('updateEDLDataset', data);
                commit('updateDBStatus', data['file_status'])
            }
            else {
                // Display error
            }
        }
        catch (e) {
            // Display error
        }
    },
    async loadEDLDatasetFromFile ({state, commit, rootState}) {

        try {

            let dataResponse = await fetchPost('/api/edl/import-data');

            if (dataResponse.ok){
                let data = await dataResponse.json();
                commit('updateEDLDataset', data);
            }
            else {
                // Display error
            }
        }
        catch (e) {
            // Display error
        }
    },

    // async getScorecardStatus({ state, commit, rootState }) {
    //     try {
    //         let dataResponse = await fetch(
    //             '/api/edl/import-scorecard-status',
    //             {
    //                 method: 'GET',
    //                 credentials: 'same-origin'
    //             }
    //         );
    //
    //         if (dataResponse.ok) {
    //             let data = await dataResponse.json();
    //             commit('setScorecardStatus', data['scorecard_status']);
    //         }
    //         else {
    //             console.error('Error retreiving scorecard status.');
    //         }
    //     }
    //     catch(e) {
    //         console.error('Networking error:', e);
    //     }
    // },

    // async getScorecardStatus({ state, commit, rootState }, fileName) {
    //     commit('updateEDLDataset', state.edlDataset);
    //     try {
    //         let reqData = new FormData();
    //         reqData.append('filename', fileName);
    //
    //         let dataResponse = await fetchPost('/api/edl/import-data', reqData);
    //         if (dataResponse.ok) {
    //             let data = await dataResponse.json();
    //             commit('setScorecardStatus', data['scorecard_status']);
    //             commit('setCorMatStatus', data['cormat_status']);
    //
    //         }
    //         else {
    //             console.error('Error retreiving Scorecard Status.');
    //         }
    //     }
    //     catch(e) {
    //         console.error('Networking error:', e);
    //     }
    //     commit('setIsLoading', false);
    // },

};

const mutations = {
    updateEDLDataset(state, dataset){
        state.edlDataset = dataset;
    },
    setScorecardStatus(state, scorecardStatus){
        state.scorecardStatus = scorecardStatus;
    },
    setCorMatStatus(state, cormatStatus){
        state.cormatStatus = cormatStatus;
    },
    updateMission(state, missionSelected){
        state.missionSelected = missionSelected;
    },
    updateID(state, dbID){
        state.dbID = dbID;
    },
    updateDescription(state, dbDescr){
        state.dbDescr = dbDescr;
    },
    setMetricsAvail(state, metrics_avail){
        state.metricsAvail = metrics_avail;
    },
    setVarsAvail(state, vars_avail){
        state.varsAvail = vars_avail;
    },
    updateDBStatus(state, dbLoadStatus){
        state.dbLoadStatus = dbLoadStatus;
    }
};


export default {
    state,
    getters,
    actions,
    mutations
}
