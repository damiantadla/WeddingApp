<template>
    <div>
        <h2 class="pb-5">Inspiracje</h2>
        <div v-for="(category, index) in categories" :key="index">
            <h3 @click="toggleCategory(index)">{{ category.name }}</h3>
            <ul v-if="category.visible">
                <li v-for="(item, itemIndex) in category.items" :key="itemIndex">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: [
                { name: 'Kategoria 1', visible: false, items: ['Inspiracja 1', 'Inspiracja 2'] },
                { name: 'Kategoria 2', visible: false, items: ['Inspiracja 3', 'Inspiracja 4'] },
                // Dodaj więcej kategorii według potrzeb
            ],
        }
    },
    methods: {
        toggleCategory(index) {
            this.categories[index].visible = !this.categories[index].visible
        },
    },
}
</script>

<style scoped>
/* Dodaj stylizację według potrzeb */
</style>
