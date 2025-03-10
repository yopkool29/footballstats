<script setup lang="ts">
import type { League } from '~/types'

const config = useRuntimeConfig()
const tabs = [
    { key: config.public.premierLeagueId, label: 'Premier League' },
    { key: config.public.ligue1Id, label: 'Ligue 1' },
    { key: config.public.bundesligaId, label: 'Bundesliga' },
    { key: config.public.serieAId, label: 'Serie A' },
    { key: config.public.laLigaId, label: 'La Liga' },
    { key: config.public.eredivisieId, label: 'Eredivisie' },
    { key: config.public.primeiraLigaId, label: 'Primeira Liga' }
]
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <UContainer class="py-8 pb-24">
            <UCard class="mb-8">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <!-- Logo SVG -->
                            <svg class="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <!-- Cercle de fond -->
                                <circle cx="24" cy="24" r="22" fill="#0891B2" />
                                <!-- Hexagones du ballon -->
                                <path d="M24 8l8 8-8 8-8-8z" fill="white" />
                                <path d="M24 24l8 8-8 8-8-8z" fill="white" fill-opacity="0.7" />
                                <!-- Barres de stats -->
                                <rect x="34" y="12" width="3" height="24" rx="1.5" fill="white" />
                                <rect x="39" y="16" width="3" height="16" rx="1.5" fill="white" />
                                <rect x="29" y="20" width="3" height="8" rx="1.5" fill="white" />
                            </svg>
                            <div>
                                <h1 class="text-3xl font-bold text-cyan-600">Football Stats Analyzer</h1>
                                <UBadge color="gray">Beta</UBadge>
                            </div>
                        </div>
                    </div>
                </template>

                <p class="text-gray-600">
                    Analysez les performances des équipes de Premier League et de Ligue 1
                </p>
            </UCard>

            <UTabs :items="tabs" class="mb-8">
                <template #item="{ item }">
                    <LeagueStats :league-name="item.label" :league-id="item.key" />
                </template>
            </UTabs>
        </UContainer>

        <FootstatsFooter />
    </div>
</template>
