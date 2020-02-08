import * as _ from 'lodash-es';
import SensitivityAnalysis from "../../components/SensitivityAnalysis";
import EDLDataMining from "../../components/EDLDataMining";
import CommandsAvailable from "../../components/CommandsAvailable";
import DataAvail from "../../components/DataAvail";
import ChatWindow from "../../components/ChatWindow";

let functionalityTypes = new Map();

// Anomaly Code
// functionalityTypes.set('AnomalyDetection', {
//     title: 'Anomaly Detection',
//     component: 'AnomalyDetection',
//     class: 'anomaly-detection',
//     minSize: 'two-thirds',
//     maxRepeat: 1,
//     optionsList: [
//         // Here we will be listing all the methods implemented
//         // Algorithms parameters are defined in algorithmsInfo in 'anomaly-problem'
//         {name: "", value: ""},
//         {name: "UniVariate: Windowed Statistic Method", value: "ADWindowedStats"},
//         {name: "UniVariate: Seasonal ARIMA + Exogenous Variables", value: "SARIMAX_AD"},
//         {name: "Multivariate: Adaptive Kernel Density Based", value: "adaptiveKNN"},
//         {name: "Multivariate: Isolation Forest", value: "iForest"}
//     ]
// });
functionalityTypes.set('DataLoader', {
    title: 'Data Loader',
    component: 'DataLoader',
    class: 'data-loader',
    minSize: 'one-third',
    maxRepeat: 1,
    optionsList: [
        // Here we will be listing the sample data sets available
        {name: "", value: ""},
        {name: "18-MDW-02", value: "MonteCarlo_18-MDW-02.mat"},
        {name: "19-JEZ-02", value: "MonteCarlo_19-JEZ-02_v1_MC.mat"},
        {name: '19-JEZ-02_Baseline', value: "MonteCarlo_19-JEZ-02_Baseline.mat"},
        {name: '19-JEZ-02_Baseline_Performance', value: "MonteCarlo_19-JEZ-02_Baseline_Performance.mat"},
        {name: 'TDS-Nominal', value: "TDS_Nominal.mat"},
        {name: 'TDS1-Fail', value: "TDS1Fail_matout.mat"},
        {name: 'TDS2-Fail', value: "TDS2Fail_matout.mat"},
        {name: 'TDS3-Fail', value: "TDS3Fail_matout.mat"},
        {name: 'EllipseContributions-Attitude', value: "sa_att.mat"},
        {name: 'NorthWinds Dataset', value: "NortWind.mat"},
        {name: 'Wind Characterization', value: "WindChar.mat"},
        {name: 'Wind Characterization (Bug Fix 25)', value: "WindChar_BugFix.mat"},
        {name: 'NorthWind (Bug Fix 25)', value: "NortWind_BugFix.mat"},
        {name: 'Baseline-PoweredFlight-EFC (Bug Fix 25)', value: "NoTRN.mat"},
        {name: 'NoTRN-PoweredFlight-EFC', value: "Baseline_PoweredFlight.mat"},

    ]
});

// functionalityTypes.set('DatabaseLoader', {
//     title: 'Anomaly Database Loader',
//     component: 'DatabaseLoader',
//     class: 'database-loader',
//     minSize: 'one-third',
//     maxRepeat: 1,
//     optionsList: [
//         // Here we will be listing the sample data sets available
//         {name: "", value: ""},
//         {name: "Satellite", value: "SatelliteBattery.csv"}
//     ]
// });

// functionalityTypes.set('AnomalyQuestions', {
//     title: 'Anomaly Questions',
//     component: 'AnomalyQuestions',
//     class: 'anomaly-questions',
//     minSize: 'one-third',
//     maxRepeat: 1,
//     optionsList: []
// });

// functionalityTypes.set('DaphneAnswer', { title: 'Answers', component: 'DaphneAnswer', class: 'answers', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('DesignBuilder', { title: 'Design Builder', component: 'DesignBuilder', class: 'design-builder', minSize: 'two-thirds', maxRepeat: 1});
functionalityTypes.set('DataMining', { title: 'Data Mining', component: 'DataMining', class: 'data-mining', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('EOSSFilter', { title: 'Filter', component: 'EOSSFilter', class: 'filter', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('FeatureApplication', { title: 'Feature Application', component: 'FeatureApplication', class: 'feature-application', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('SensitivityAnalysis', { title: 'Sensitivity Analysis', component: 'SensitivityAnalysis', class: 'sensitivity-analysis',minSize: 'two-thirds', maxRepeat: 1});
functionalityTypes.set('EDLDataMining', { title: 'EDL Data Mining', component: 'EDLDataMining', class: 'edl-datamining',minSize: 'two-thirds', maxRepeat: 1});
functionalityTypes.set('CommandsAvailable', { title: 'Commands Available', component: CommandsAvailable, class: 'commands-available',minSize: 'two-thirds', maxRepeat: 1});
functionalityTypes.set('DataAvail', { title: 'Data Available', component: 'DataAvail', class: 'data-available',minSize: 'two-thirds', maxRepeat: 1});
functionalityTypes.set('ChatWindow', { title: 'Chat Window', component: 'ChatWindow', class: 'chat-window',minSize: 'two-thirds', maxRepeat: 1});

functionalityTypes.set('OrbitInstrInfo', {
    title: 'Orbits and Instruments Information',
    component: 'Cheatsheet',
    class: 'orbit-instr-info',
    minSize: 'one-third',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "Orbits Information", value: "orb_info"},
        {name: "Instruments Information", value: "instr_info"}
    ]});
functionalityTypes.set('AvailableCommands', {
    title: 'Available Commands',
    component: 'Cheatsheet',
    class: 'available-commands',
    minSize: 'one-third',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "General", value: "general"},
        {name: "iFEED", value: "ifeed"},
        {name: "Analyst", value: "analyst"},
        {name: "Critic", value: "critic"},
        {name: "Historian", value: "historian"},
        {name: "EDL", value: "edl"}
    ]});
functionalityTypes.set('CommandsInformation', {
    title: 'Commands Information',
    component: 'Cheatsheet',
    class: 'commands-information',
    minSize: 'one-third',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "Analyst Instruments", value: "analyst_instruments"},
        {name: "Analyst Instrument Parameters", value: "analyst_instrument_parameters"},
        {name: "Analyst Measurements", value: "analyst_measurements"},
        {name: "Analyst Stakeholders", value: "analyst_stakeholders"},
        {name: "Analyst Objectives", value: "objectives"},
        {name: "Historical Measurements", value: "measurements"},
        {name: "Historical Missions", value: "missions"},
        {name: "Historical Technologies", value: "technologies"},
        {name: "Historical Space Agencies", value: "space_agencies"}
    ]});


let newFunctionalityId = 0;

// initial state
// shape: [{ id, quantity }]
const state = {
    availableFunctionalities: [
        // { name: 'DaphneAnswer', title: 'Answers', icon: 'fa-comments' },
        // { name: 'DesignBuilder', title: 'Design Builder', icon: 'fa-search' },
        //{ name: 'AnomalyDetection', title: 'Anomaly Detection', icon: 'fa-chart-bar' },
        { name: 'DataLoader', title: 'Data Loader', icon: 'fa-upload' },
        // { name: 'DatabaseLoader', title: 'Anomaly Database Loader', icon: 'fa-upload' },
        { name: 'AnomalyQuestions', title: 'Questions', icon: 'fa-question-circle' },
        { name: 'GeneralPlot', title: 'Scatter Plot', icon: 'fa-chart-bar' },
        { name: 'StatsPlot', title: 'Variable Statistics', icon: 'fa-chart-bar' },
        { name: 'SensitivityAnalysis', title: 'Sensitivity Analysis (MC Filtering)', icon: 'fa-chart-bar' },
        { name: 'EDLDataMining', title: 'Data Mining', icon: 'fa-chart-bar' },
        { name: 'CommandsAvailable', title: 'Commands Available', icon: 'fa-comments' },
        { name: 'DataAvail', title: 'Data Available', icon: 'fa-comments' },
        { name: 'ChatWindow', title: 'Chat Window', icon: 'fa-comments' },
        // { name: 'DataMining', title: 'Data Mining', icon: 'fa-chart-bar' },
        // { name: 'EOSSFilter', title: 'Filter', icon: 'fa-filter' },
        { name: 'FeatureApplication', title: 'Feature Application', icon: 'fa-sitemap' },
        // { name: 'OrbitInstrInfo', title: 'Orbits and Instruments Information', icon: 'fa-book' },
        // { name: 'AvailableCommands', title: 'Available Commands', icon: 'fa-book' },
        // { name: 'CommandsInformation', title: 'Commands Information', icon: 'fa-book' }
    ],
    functionalities: [],
    functionalityCount: {
        // 'DaphneAnswer': 0,
        'DesignBuilder': 0,
        // 'AnomalyDetection': 0,
        'AnomalyQuestions': 0,
        'DataLoader': 0,
        'DatabaseLoader': 0,
        'DataMining': 0,
        'EOSSFilter': 0,
        'FeatureApplication': 0,
        'OrbitInstrInfo': 0,
        'AvailableCommands': 0,
        'CommandsInformation': 0,
        'SensitivityAnalysis': 0,
        'EDLDataMining': 0,
        'CommandsAvailable': 0,
        'DataAvail': 0,
        'ChatWindow':0
    }
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getOptionsList: (state) => (name) => {
        return functionalityTypes.get(name).optionsList;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    addFunctionality(state, functionality) {
        console.log(functionality);
        console.log('aaaaaaaaaaa');
        let funcInfo = functionalityTypes.get(functionality);

        if (state.functionalityCount[functionality] < funcInfo.maxRepeat) {
            // Add to columns and to the array
            state.functionalities.push({
                name: functionality,
                component: funcInfo.component,
                title: funcInfo.title,
                funcClass: funcInfo.class,
                initialSize: funcInfo.minSize,
                id: newFunctionalityId++
            });
            state.functionalityCount[functionality]++;
        }
    },
    closeFunctionality(state, funcId) {
        let funcIndex = state.functionalities.findIndex((elem) => elem.id === funcId);
        let funcName = state.functionalities[funcIndex].name;
        state.functionalities.splice(funcIndex, 1);
        state.functionalityCount[funcName]--;
    },
    resetFunctionalityList(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreFunctionalityList(state, recoveredState) {
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
