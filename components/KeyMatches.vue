<template>
    <div>
        <div v-if="isLoading" class="text-gray-500">Chargement des matchs...</div>

        <div v-else-if="error" class="text-red-500 p-4 bg-red-50 rounded-lg">
            Erreur de chargement : {{ error.message }}
        </div>

        <!-- Section collapsible pour les matchs clés -->
        <div v-else class="bg-white rounded-lg shadow mb-4">
            <div class="p-4 flex items-center justify-between cursor-pointer">
                <div class="flex gap-x-4 justify-center items-center">
                    <h2 class="text-lg font-semibold flex items-center gap-2" @click="isKeyMatchesExpanded = !isKeyMatchesExpanded">
                        Matchs Clés
                        <UBadge v-if="getTotalKeyMatches > 0" color="cyan" size="sm">{{ getTotalKeyMatches }}</UBadge>
                    </h2>

                    <!-- Affichage de la dernière mise à jour -->
                    <div v-if="lastUpdatedDate" class="text-xs text-gray-500 flex items-center gap-1">
                        <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                        Dernière mise à jour : {{ formatLastUpdated(lastUpdatedDate) }}
                    </div>

                    <!-- Bouton de rafraîchissement -->
                    <button @click.stop="refreshKeyMatches" class="p-1.5 rounded-full hover:bg-gray-100 transition-colors" :class="{ 'opacity-50 cursor-not-allowed': isRefreshingMatches }" :disabled="isRefreshingMatches" title="Rafraîchir les matchs clés">
                        <UIcon :name="isRefreshingMatches ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-path'" class="w-5 h-5 text-gray-600" :class="{ 'animate-spin': isRefreshingMatches }" />
                    </button>
                </div>

                <div class="flex items-center gap-2">
                    <!-- Icône d'expansion -->
                    <button @click.stop="isKeyMatchesExpanded = !isKeyMatchesExpanded">
                        <UIcon :name="isKeyMatchesExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-5 h-5 transition-transform" />
                    </button>
                </div>
            </div>

            <div v-if="isKeyMatchesExpanded" class="space-y-4 p-4 border-t">
                <section v-for="item in leaguesWithKeyMatches" :key="item.league.leagueId" class="bg-gray-50 rounded p-3">
                    <h3 class="text-md font-semibold mb-2">{{ getLeagueName(item.league.leagueId) }}</h3>

                    <div class="flex flex-col gap-2">
                        <div 
                            v-for="(match, index) in item.keyMatches" 
                            :key="match.id" 
                            class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-2 border-yellow-400"
                        >
                            <MatchDisplay 
                                :match="match" 
                                :getTeamForm="getTeamForm" 
                                :getPointsDifference="getPointsDifference"
                                :formatDate="formatDate"
                            >
                                <template #match-number>Match #{{ index + 1 }} - </template>
                                <template #match-badges>
                                    <UBadge color="yellow" class="ml-2" size="xs">
                                        Match clé
                                    </UBadge>
                                </template>
                                <template #home-team-badges="{ team }">
                                    <UBadge v-if="team.position <= 4" color="green" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                        Top 4
                                    </UBadge>
                                    <UBadge v-if="team.position >= 17" color="red" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                        Bottom 4
                                    </UBadge>
                                </template>
                                <template #away-team-badges="{ team }">
                                    <UBadge v-if="team.position <= 4" color="green" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                        Top 4
                                    </UBadge>
                                    <UBadge v-if="team.position >= 17" color="red" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                        Bottom 4
                                    </UBadge>
                                </template>
                            </MatchDisplay>
                        </div>
                    </div>
                </section>
                
                <div v-if="leaguesWithKeyMatches.length === 0" class="text-gray-500 text-center p-4">
                    Aucun match clé disponible
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useLeagueData } from '~/composables/useLeagueData'
import { useLeagueStats } from '~/composables/useLeagueStats'
import type { Match, MatchTeam } from '~/types'
import MatchDisplay from '~/components/MatchDisplay.vue'

const { isLoading, error, leagues, matchesByLeague, fetchAllLeaguesMatches, allLeagues } = useLeagueData()
const { isKeyMatch } = useLeagueStats()

// Propriété calculée pour filtrer les ligues avec des matchs clés
const leaguesWithKeyMatches = computed(() => {
    return leagues.value.map((league, idx) => ({
        league,
        keyMatches: matchesByLeague.value[idx]?.filter(match => isKeyMatch(match)) || []
    })).filter(item => item.keyMatches.length > 0)
})

// Propriété calculée pour obtenir la date de dernière mise à jour
const lastUpdatedDate = computed(() => {
    // Recherche de la date de dernière mise à jour parmi toutes les ligues
    for (const league of leagues.value) {
        if ('lastUpdated' in league && league.lastUpdated) {
            return league.lastUpdated
        }
    }
    return null
})

// État pour le collapsible (fermé par défaut)
const isKeyMatchesExpanded = ref(false)
const isRefreshingMatches = ref(false)

// Fonction pour rafraîchir les matchs
const refreshKeyMatches = async () => {
    isRefreshingMatches.value = true
    try {
        await fetchAllLeaguesMatches()
    } finally {
        isRefreshingMatches.value = false
    }
}

// Calculer le nombre total de matchs clés
const getTotalKeyMatches = computed(() => {
    return leaguesWithKeyMatches.value.reduce((total, item) => total + item.keyMatches.length, 0)
})

// Fonction pour formater la date
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date)
}

// Fonction pour obtenir la forme de l'équipe en fonction de sa position
const getTeamForm = (position: number): string => {
    if (position <= 4) return 'Excellente forme'
    if (position <= 8) return 'Très bonne forme'
    if (position <= 12) return 'Bonne forme'
    if (position <= 16) return 'Forme moyenne'
    return 'En difficulté'
}

// Fonction pour calculer la différence de points entre les équipes
const getPointsDifference = (match: Match): number => {
    return Math.abs(match.homeTeam.points - match.awayTeam.points)
}

// Fonction pour formater la dernière mise à jour
const formatLastUpdated = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date)
}

// Fonction pour obtenir le nom de la ligue
const getLeagueName = (leagueId: string): string => {
    const league = allLeagues.find(league => league.key === leagueId)
    return league ? league.label : leagueId
}

// Initialiser les données au montage du composant
onMounted(() => {
    if (leagues.value.length === 0) {
        fetchAllLeaguesMatches()
    }
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
