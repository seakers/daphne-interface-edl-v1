<template>
    <p>{{ response }}</p>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'text-response',
        props: ['response'],
    }
</script>

<style scoped>

</style>