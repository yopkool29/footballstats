<template>
    <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <UContainer class="py-4">
            <div class="flex items-center justify-evenly text-sm text-gray-600">
                <div class="flex items-center gap-2 transition-colors hover:text-gray-900">
                    <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-600" />
                    <span>Données mises à jour le {{ formatDate(new Date().toISOString()) }}</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1 transition-colors hover:text-gray-900">
                        <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-yellow-500" />
                        <span>Top 4</span>
                    </div>
                    <div class="flex items-center gap-1 transition-colors hover:text-gray-900">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-red-500" />
                        <span>Bottom 4</span>
                    </div>
                </div>
            </div>
        </UContainer>
    </footer>
</template>

<script setup lang="ts">
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>
