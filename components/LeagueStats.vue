<template>
    <UCard class="mb-8">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <h2 class="text-2xl font-bold text-gray-700">{{ leagueName }}</h2>
                    <div v-if="matches?.lastUpdated" class="text-xs text-gray-500 flex items-center gap-1">
                        <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                        Dernière mise à jour matchs : {{ formatLastUpdated(matches.lastUpdated) }}
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <UTooltip text="Ignore le cache et force la récupération des données depuis l'API">
                        <UCheckbox v-model="forceUpdate" label="Forcer la mise à jour" class="cursor-help" />
                    </UTooltip>
                    <div class="flex gap-2">
                        <UButton :loading="isLoadingTeams" color="orange" @click="fetchTeams">
                            {{ isLoadingTeams ? 'Chargement...' : 'Récupérer les équipes' }}
                        </UButton>

                        <UButton :loading="isLoadingMatches" color="green" @click="fetchMatches">
                            {{ isLoadingMatches ? 'Chargement...' : 'Récupérer les matchs' }}
                        </UButton>
                    </div>
                </div>
            </div>
        </template>

        <!-- Top 4 et Bottom 4 -->
        <div v-if="leagueData" class="grid md:grid-cols-2 gap-6 mb-8">
            <UCard>
                <template #header>
                    <h3 class="text-xl font-medium text-gray-900">Top 4</h3>
                </template>
                <div v-if="leagueData.topTeams.length" class="space-y-2">
                    <div v-for="team in leagueData.topTeams" :key="team.id" class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <img v-if="team.crest" :src="team.crest" :alt="team.name" class="w-6 h-6 object-contain" loading="lazy" />
                            <span class="font-medium text-gray-600">{{ team.position }}. {{ team.name }}</span>
                        </div>
                        <UBadge color="green">{{ team.points }} pts</UBadge>
                    </div>
                </div>
                <UEmpty v-else message="Aucune donnée disponible" />
            </UCard>

            <UCard>
                <template #header>
                    <h3 class="text-xl font-medium text-gray-900">Bottom 4</h3>
                </template>
                <div v-if="leagueData.bottomTeams.length" class="space-y-2">
                    <div v-for="team in leagueData.bottomTeams" :key="team.id" class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <img v-if="team.crest" :src="team.crest" :alt="team.name" class="w-6 h-6 object-contain" loading="lazy" />
                            <span class="font-medium text-gray-600">{{ team.position }}. {{ team.name }}</span>
                        </div>
                        <UBadge color="red">{{ team.points }} pts</UBadge>
                    </div>
                </div>
                <UEmpty v-else message="Aucune donnée disponible" />
            </UCard>
        </div>

        <!-- Matchs à venir -->
        <div v-if="matches">
            <UDivider class="my-4" />
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-medium text-gray-900">Matchs à venir</h3>
                <div class="flex items-center gap-2">
                    <UTooltip v-if="keyMatchesCount" text="Confrontations entre équipes du top 4 et du bottom 4">
                        <UBadge color="yellow" size="sm" class="transition-opacity hover:opacity-80">
                            {{ keyMatchesCount }} match{{ keyMatchesCount > 1 ? 's' : '' }} clé{{ keyMatchesCount > 1 ? 's' : '' }}
                        </UBadge>
                    </UTooltip>
                    <UTooltip v-if="importantMatchesCount" text="Matchs entre équipes proches au classement (≤ 3 positions d'écart)">
                        <UBadge color="orange" size="sm" class="transition-opacity hover:opacity-80">
                            {{ importantMatchesCount }} match{{ importantMatchesCount > 1 ? 's' : '' }} important{{ importantMatchesCount > 1 ? 's' : '' }}
                        </UBadge>
                    </UTooltip>
                </div>
            </div>
            <div class="space-y-8">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold">Prochains matchs</h2>
                </div>
                <div v-if="matches.matches.length" class="space-y-4">
                    <div v-for="(match, index) in sortedMatches" :key="match.id" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200" :class="{ 'border-yellow-400 border-2': isKeyMatch(match) }">
                        <div class="mb-4 flex items-center gap-2">
                            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
                            <span class="text-sm font-bold">Match #{{ index + 1 }} - {{ formatDate(match.date) }}</span>
                            <UBadge v-if="isKeyMatch(match)" color="yellow" class="ml-2" size="xs">
                                Match clé
                            </UBadge>
                            <UBadge v-else-if="isCloseMatch(match)" color="orange" class="ml-2" size="xs">
                                Match important
                            </UBadge>
                            <span v-if="getPointsDifference(match)" class="text-xs ml-2">
                                <UBadge :color="getPointsDifference(match) <= 3 ? 'orange' : 'gray'" size="xs" class="transition-opacity hover:opacity-80">
                                    {{ getPointsDifference(match) }} point{{ getPointsDifference(match) > 1 ? 's' : '' }} d'écart
                                </UBadge>
                            </span>
                        </div>
                        <div class="grid grid-cols-11 items-center text-center gap-4">
                            <div class="col-span-5 flex items-center justify-end gap-3">
                                <div class="flex flex-col items-end">
                                    <div class="flex items-center gap-2">
                                        <img v-if="match.homeTeam.crest" :src="match.homeTeam.crest" :alt="match.homeTeam.name" class="w-6 h-6 object-contain" loading="lazy" />
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
                                        <UTooltip v-if="isTopTeam(match.homeTeam)" text="Cette équipe fait officiellement partie du top 4 selon les données de l'API">
                                            <UBadge color="green" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                                Top 4
                                            </UBadge>
                                        </UTooltip>
                                        <UTooltip v-if="isBottomTeam(match.homeTeam)" text="Cette équipe fait officiellement partie du bottom 4 selon les données de l'API">
                                            <UBadge color="red" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                                Bottom 4
                                            </UBadge>
                                        </UTooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="font-bold text-gray-400 text-lg">VS</div>
                            <div class="col-span-5 flex items-center justify-start gap-3">
                                <div class="flex flex-col items-start">
                                    <div class="flex items-center gap-2">
                                        <img v-if="match.awayTeam.crest" :src="match.awayTeam.crest" :alt="match.awayTeam.name" class="w-6 h-6 object-contain" loading="lazy" />
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
                                        <UTooltip v-if="isTopTeam(match.awayTeam)" text="Cette équipe fait officiellement partie du top 4 selon les données de l'API">
                                            <UBadge color="green" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                                Top 4
                                            </UBadge>
                                        </UTooltip>
                                        <UTooltip v-if="isBottomTeam(match.awayTeam)" text="Cette équipe fait officiellement partie du bottom 4 selon les données de l'API">
                                            <UBadge color="red" size="xs" class="ml-1 transition-opacity hover:opacity-80">
                                                Bottom 4
                                            </UBadge>
                                        </UTooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <UEmpty v-else message="Aucun match à venir" />
            </div>
        </div>

        <!-- Footer -->
        <FootstatsFooter />

        <!-- Toutes les équipes -->
        <div v-if="leagueData" class="mb-8">
            <UDivider class="my-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Toutes les équipes</h3>
            <div class="overflow-x-auto">
                <UTable :rows="leagueData.allTeams" :columns="columns">
                    <template #position-data="{ row }">
                        <span :class="{
                            'text-green-600 font-medium': isTopTeam(row),
                            'text-red-600 font-medium': isBottomTeam(row)
                        }">
                            {{ row.position }}
                        </span>
                    </template>
                    <template #name-data="{ row }">
                        <div class="flex items-center gap-2">
                            <img v-if="row.crest" :src="row.crest" :alt="row.name" class="w-6 h-6 object-contain" loading="lazy" />
                            <span :class="{
                                'text-green-600 font-medium': isTopTeam(row),
                                'text-red-600 font-medium': isBottomTeam(row)
                            }">
                                {{ row.name }}
                            </span>
                        </div>
                    </template>
                </UTable>
            </div>
        </div>

    </UCard>
</template>

<script setup lang="ts">
import type { LeagueData, LeagueMatches, League, Team, Match, MatchTeam, ApiResponse } from '~/types'
import FootstatsFooter from '~/components/FootstatsFooter.vue'

const { isTopTeam, isBottomTeam, getTeamForm, isCloseMatch, getPointsDifference, isKeyMatch } = useLeagueStats()

const props = defineProps<{
    leagueName: string
    leagueId: League
}>()

const forceUpdate = ref(false)
const isLoadingTeams = ref(false)
const isLoadingMatches = ref(false)
const leagueData = ref<LeagueData | null>(null)
const matches = ref<LeagueMatches | null>(null)
const isFromCache = ref(false)

const columns = [
    {
        key: 'position',
        label: 'Pos',
        tooltip: 'Position actuelle dans le classement'
    },
    {
        key: 'name',
        label: 'Équipe',
        tooltip: 'Nom de l\'équipe'
    },
    {
        key: 'played',
        label: 'J',
        tooltip: 'Nombre de matchs joués'
    },
    {
        key: 'won',
        label: 'G',
        tooltip: 'Nombre de matchs gagnés'
    },
    {
        key: 'drawn',
        label: 'N',
        tooltip: 'Nombre de matchs nuls'
    },
    {
        key: 'lost',
        label: 'P',
        tooltip: 'Nombre de matchs perdus'
    },
    {
        key: 'goalsFor',
        label: 'BP',
        tooltip: 'Buts pour (marqués)'
    },
    {
        key: 'goalsAgainst',
        label: 'BC',
        tooltip: 'Buts contre (encaissés)'
    },
    {
        key: 'points',
        label: 'Pts',
        tooltip: 'Total des points',
        class: 'font-bold'
    }
]

const sortedMatches = computed(() => {
    if (!matches.value) return []

    return [...matches.value.matches].sort((a, b) => {
        // Priorité 1 : Matchs entre top 4 et bottom 4
        const aIsKey = isKeyMatch(a)
        const bIsKey = isKeyMatch(b)
        if (aIsKey && !bIsKey) return -1
        if (!aIsKey && bIsKey) return 1

        // Priorité 2 : Matchs entre équipes proches
        const aIsClose = isCloseMatch(a)
        const bIsClose = isCloseMatch(b)
        if (aIsClose && !bIsClose) return -1
        if (!aIsClose && bIsClose) return 1

        // Priorité 3 : Par date
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
})

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

const fetchTeams = async (from_cache = false) => {
    isLoadingTeams.value = true
    try {
        const response = await $fetch<ApiResponse<LeagueData>>(`/api/teams/${props.leagueId}`, {
            query: {
                force: forceUpdate.value,
                from_cache: from_cache,
            }
        })
        leagueData.value = response.data
        isFromCache.value = response.fromCache
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error)
    } finally {
        isLoadingTeams.value = false
    }
}

const fetchMatches = async (from_cache = false) => {
    isLoadingMatches.value = true
    try {
        const response = await $fetch<ApiResponse<LeagueMatches>>(`/api/matches/${props.leagueId}`, {
            query: {
                from_cache: from_cache,
                force: forceUpdate.value
            }
        })
        matches.value = response.data
        isFromCache.value = response.fromCache
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error)
    } finally {
        isLoadingMatches.value = false
    }
}

const keyMatchesCount = computed(() => {
    if (!matches.value?.matches) return 0
    return matches.value.matches.filter(match => isKeyMatch(match)).length
})

const importantMatchesCount = computed(() => {
    if (!matches.value?.matches) return 0
    return matches.value.matches.filter(match => !isKeyMatch(match) && isCloseMatch(match)).length
})

// Type pour l'interface exposée
interface LeagueStatsExpose {
    keyMatchesCount: ComputedRef<number>
}

// Au montage, on ne force pas la mise à jour
onMounted(() => {
    const currentForceUpdate = forceUpdate.value
    forceUpdate.value = false  // Désactiver temporairement
    fetchMatches(true)
    fetchTeams(true)
    forceUpdate.value = currentForceUpdate  // Restaurer la valeur
})

// Exposer keyMatchesCount pour le composant parent
defineExpose({
    keyMatchesCount
} satisfies LeagueStatsExpose)

</script>
