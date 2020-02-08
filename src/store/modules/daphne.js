// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    command: '',
    response: null,
    isLoading: false,
    dialogueHistory: []
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getResponse(state) {
        return state.response;
    },
    getIsLoading(state) {
        return state.isLoading;
    }
};

// actions
const actions = {

    async loadDialogue({ state, commit, rootState }) {
        try {
            let dataResponse = await fetchPost('/api/edl/chat-history', reqData);


            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setChatList', data['chat_list']);
            }
            else {
                console.error('Error retreiving list of chat items.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },



    async executeCommand({ state, commit, rootState }) {
        commit('setIsLoading', true);
        try {
            commit('addDialoguePiece', {
                "voice_message": state.command,
                "visual_message_type": ["text"],
                "visual_message": [state.command],
                "writer": "user"});

            let reqData = new FormData();
            reqData.append('command', state.command);
            if (rootState.experiment.inExperiment) {
                let experimentStage = rootState.experiment.experimentStage;
                let restrictedQuestions = rootState.experiment.stageInformation[experimentStage].restrictedQuestions;
                if (restrictedQuestions !== null) {
                    reqData.append('allowed_commands', JSON.stringify(restrictedQuestions));
                }
            }
            let dataResponse = await fetch(
                '/api/edl/dialogue/command',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setResponse', data['response']);
                commit('addDialoguePiece', data['response']);
            }
            else {
                console.error('Error processing the command.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
        commit('setIsLoading', false);
    }
};

// mutations
const mutations = {
    setChatList(state, dialogueHistory) {
        state.dialogueHistory = dialogueHistory;
    },
    setCommand(state, command) {
        state.command = command;
    },
    setResponse(state, response) {
        state.response = response;
    },
    setIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    resetDaphne(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreDaphne(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    },
    setDialogueHistory(state, dialogueHistory) {
        state.dialogueHistory = dialogueHistory;
    },
    addDialoguePiece(state, dialoguePiece) {
        state.dialogueHistory.push(dialoguePiece);
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
