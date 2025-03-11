<template>
    <div>
        <!-- En-tête avec date et badges -->
        <div class="mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span class="text-sm font-bold">
                <slot name="match-number"></slot>
                {{ formatDate(match.date) }}
            </span>
            <slot name="match-badges"></slot>
            <span v-if="getPointsDifference && getPointsDifference(match)" class="text-xs ml-2">
                <UBadge :color="getPointsDifference(match) <= 3 ? 'orange' : 'gray'" size="xs" class="transition-opacity hover:opacity-80">
                    {{ getPointsDifference(match) }} point{{ getPointsDifference(match) > 1 ? 's' : '' }} d'écart
                </UBadge>
            </span>
        </div>
        
        <!-- Affichage des équipes -->
        <div class="grid grid-cols-11 items-center text-center gap-4">
            <!-- Équipe domicile -->
            <div class="col-span-5 flex items-center justify-end gap-3">
                <div class="flex flex-col items-end">
                    <div class="flex items-center gap-2">
                        <img 
                            v-if="match.homeTeam.crest" 
                            :src="match.homeTeam.crest" 
                            :alt="match.homeTeam.name"
                            class="w-6 h-6 object-contain"
                            loading="lazy"
                        />
                        <span class="font-medium text-gray-900">{{ match.homeTeam.name }} - [{{ match.homeTeam.position }}]</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-xs" :class="{
                            'text-green-600': match.homeTeam.position <= 4,
                            'text-yellow-600': match.homeTeam.position > 4 && match.homeTeam.position < 17,
                            'text-red-600': match.homeTeam.position >= 17
                        }">
                            {{ getTeamForm(match.homeTeam.position) }}
                        </span>
                        <slot name="home-team-badges" :team="match.homeTeam"></slot>
                    </div>
                </div>
            </div>
            
            <!-- VS au milieu -->
            <div class="font-bold text-gray-400 text-lg">VS</div>
            
            <!-- Équipe extérieur -->
            <div class="col-span-5 flex items-center justify-start gap-3">
                <div class="flex flex-col items-start">
                    <div class="flex items-center gap-2">
                        <img 
                            v-if="match.awayTeam.crest" 
                            :src="match.awayTeam.crest" 
                            :alt="match.awayTeam.name"
                            class="w-6 h-6 object-contain"
                            loading="lazy"
                        />
                        <span class="font-medium text-gray-900">{{ match.awayTeam.name }} - [{{ match.awayTeam.position }}]</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-xs" :class="{
                            'text-green-600': match.awayTeam.position <= 4,
                            'text-yellow-600': match.awayTeam.position > 4 && match.awayTeam.position < 17,
                            'text-red-600': match.awayTeam.position >= 17
                        }">
                            {{ getTeamForm(match.awayTeam.position) }}
                        </span>
                        <slot name="away-team-badges" :team="match.awayTeam"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Match } from '~/types'

const props = defineProps<{
    match: Match
    getTeamForm: (position: number) => string
    getPointsDifference?: (match: Match) => number
    formatDate: (dateStr: string) => string
}>()
</script>
