<template>
    <div class="panel-block functionality content">
        <img src="assets/img/loader.svg" style="margin: auto;" height="64" width="64" v-if="isLoading">
        <template v-else>
            <component v-if="!emptyResponse" v-for="(response, index) in receivedResponses" v-bind:is="responseTypes[receivedResponseTypes[index]]" v-bind:response="response"></component>
            <p v-else>The answers from Daphne will be displayed here.</p>
        </template>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import TextResponse from './TextResponse';
    import ListResponse from './ListResponse';

    let loaderImage = require('../images/loader.svg');

    export default {
        name: 'daphne-answer',
        data() {
            return {
                responseTypes: {
                    text: 'TextResponse',
                    list: 'ListResponse'
                }
            }
        },
        computed: {
            ...mapGetters({
                daphneResponse: 'getResponse',
                isLoading: 'getIsLoading'
            }),
            emptyResponse() {
                return Object.keys(this.daphneResponse).length === 0;
            },
            receivedResponseTypes() {
                return this.daphneResponse['visual_message_type'];
            },
            receivedResponses() {
                return this.daphneResponse['visual_message'];
            }
        },
        components: {
            TextResponse,
            ListResponse
        }
    }
</script>

<style scoped>

</style>