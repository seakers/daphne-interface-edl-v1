<template>
    <div style="display: flex; overflow: auto; flex-direction: column;  height: 100%;">
        <div class="panel-block"><b>Select a Sample DataSet...</b></div>
        <div class="panel-block">
            <div class="select is-fullwidth">
                <select v-model="selectedDataSet">
                    <option v-for="option in dataSetOptions" v-bind:value="option.value" v-bind:key="option.value">{{ option.name }}</option>
                </select>
            </div>
            <button class="button" id="loadData-button" @click="loadData">Load</button>
        </div>
        <div class="panel-block"><b>...Or Upload your Data here</b></div>
        <div class="panel-block flex-column">
            <p>(Standard matout.mat files are compatible with Daphne)</p>
            <p> When dataset is uploaded, a correlation matrix is generated and stored into the context Database</p>
            <div class="content flex-column">
                <div class="file is-large">
                    <label class="file-label">
                        <input class="file-input" type="file" name="resume" @change="onFileChange">
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">
                                Upload your .mat file here
                            </span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
        <div class="panel-block"><b>Loaded data into Daphne: </b>
            <div v-if="!isDataLoaded">No Data is loaded yet</div>
            <div v-else>
                {{loadedData}}
            </div>
        </div>
        <div class="panel-block"> Status: {{scorecardStatus}}, {{cormatStatus}}  </div>
        <div class="panel-block flex-column is-narrow" style="text-align: left; row-gap: 200px">

            <p class="title is-4">Database Loader</p>
            <h6 class="subtitle is-6"> Add to Database ? (Scorecard must exist) </h6>

                <h6 class="subtitle is-6" style="margin-bottom: 5px">
                    1. Select the mission data corresponds to:
                </h6>
            <div class="select is-hovered" style="margin-bottom: 20px;">
                <select  v-model="missionSelected">
                    <option value="" selected>Please select a mission</option>
                    <option value='Mars2020'>Mars 2020</option>
                    <option value='insight'>InSight</option>
                </select>
            </div>
            <h6 class="subtitle is-6" style="margin-bottom: 5px"> 2. Type a unique ID in the following format: (_XYZ) </h6>
            <input class="input" type="text" style="width: 25%; margin-bottom: 20px" placeholder="Type ID" v-model="dbID">

            <h6 class="subtitle is-6" style="margin-bottom: 5px"> 3. Enter a description </h6>
            <input class="input flex-column" type="text" style="width:100%; margin-bottom: 20px" placeholder="Type description" v-model="dbDescr">
            <p>

            </p>
            <button class="button is-expanded is-primary" id="loadDB-button" style="background-color: lightseagreen; position: relative"  @click="loadDB">Load to Database</button>

        </div>

        <div class="panel-block"> <b>Loaded Data Into Database: </b>
        <div v-if="!isDBLoaded">No Data is loaded yet into the database </div>
            <div v-else>
                {{loadedDB}}
            </div>
        </div>
        <div class="panel-block"> Status: {{dbLoadStatus}} </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "DataLoader",

        data() {
            return {
                isDataLoaded: false,
                selectedDataSet: '',
                loadedData: '',
                isDBLoaded: ''
            }
        },

        props: ['name'],
        computed:{
            dataSetOptions() {
                return this.$store.getters.getOptionsList(this.name);
            },

            ...mapState({
                scorecardStatus: state => state.datasetImport.scorecardStatus,
                cormatStatus: state => state.datasetImport.cormatStatus,
                metricsAvail: state => state.datasetImport.metricsAvail,
                dbLoadStatus: state => state.datasetImport.dbLoadStatus,


            }),

           missionSelected: {
                get() {
                    return this.$store.state.datasetImport.missionSelected;
                },
                set(newMission) {
                    this.$store.commit('updateMission', newMission);
                }
            },
            dbID: {
                get() {
                    return this.$store.state.datasetImport.dbID;
                },
                set(newdbID) {
                    this.$store.commit('updateID', newdbID);
                }
            },

            dbDescr: {
                get() {
                    return this.$store.state.datasetImport.dbDescr;
                },
                set(newdbDescr) {
                    this.$store.commit('updateDescription', newdbDescr);
                }
            },

        },

        methods:{
            loadData(){
                this.$store.dispatch('loadEDLDataset', this.selectedDataSet).then(()=>{
                    this.$store.dispatch('getScorecardStatus', this.selectedDataSet);
                    //this.$store.dispatch('getCorMatStatus', this.selectedDataSet);
                });
                this.loadedData = this.selectedDataSet + "(Sample data)"; // todo this logic must be into the store
                this.isDataLoaded = true;
            },
            loadDB(){
                this.$store.dispatch('loadEDLDatasetDB', this.selectedDataSet);

                this.loadedDB = this.selectedDataSet + "(Being Added to DB)"; // todo this logic must be into the store
                this.isDBLoaded = true;
            },
            onFileChange() {
                let  fileField = document.querySelector("input[type='file']");
                this.$store.dispatch('loadEDLDatasetFromFile', fileField.files[0]);
                this.isDataLoaded = true;
                this.loadedData = fileField.files[0]['name'] + "(Uploaded)";
            },


        },

        mounted() {
        },
    }

</script>

<style scoped>
.flex-column {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}
</style>