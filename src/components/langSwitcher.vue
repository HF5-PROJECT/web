<template>
    <label for="locale">{{ $t('language') }}</label>
    <select v-model="$i18n.locale">
        <option value="en">English</option>
        <option value="da">Dansk</option>
    </select>
</template>

<script lang="ts">
export default {
    mounted() {
        console.log(this.$i18n);
    }
}
</script>
