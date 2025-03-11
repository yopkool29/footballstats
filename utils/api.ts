import { useRuntimeConfig } from '#imports'
import type { League, LeagueData, LeagueMatches, Team, Match } from '../types'

interface ApiResponse<T> {
    response: T[]
    results: number
}

interface FootballDataTeam {
    team: {
        id: number
        name: string
        crest: string  // URL du logo
    }
    position: number
    points: number
    playedGames: number
    won: number
    draw: number
    lost: number
    goalsFor: number
    goalsAgainst: number
}

interface FootballDataMatch {
    id: number
    homeTeam: {
        id: number
        name: string
        crest: string  // URL du logo
    }
    awayTeam: {
        id: number
        name: string
        crest: string  // URL du logo
    }
    utcDate: string
    status: string
}

const config = useRuntimeConfig()

const headers = {
    'X-Auth-Token': config.footballDataApiKey as string
} satisfies Record<string, string>

const convertTeam = (standing: FootballDataTeam): Team => ({
    id: standing.team.id,
    name: standing.team.name,
    position: standing.position,
    points: standing.points,
    played: standing.playedGames,
    won: standing.won,
    drawn: standing.draw,
    lost: standing.lost,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    crest: standing.team.crest
})

export const getTeams = async (league: League): Promise<LeagueData> => {
    // console.log(`${config.footballDataApiUrl}/competitions/${league}/standings`)

    const response = await fetch(`${config.footballDataApiUrl}/competitions/${league}/standings`, {
        headers
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.statusText}`)
    }

    const data = await response.json()
    const standings = data.standings[0].table as FootballDataTeam[]

    const teams = standings.map(convertTeam)

    return {
        id: league,
        allTeams: teams,
        topTeams: teams.slice(0, 4),
        bottomTeams: teams.slice(-4),
        lastUpdated: new Date().toISOString()
    }
}

const convertStatus = (apiStatus: string): Match['status'] => {
    switch (apiStatus) {
        case 'SCHEDULED':
            return 'SCHEDULED'
        case 'LIVE':
            return 'LIVE'
        default:
            return 'FINISHED'
    }
}

export const getMatches = async (league: League): Promise<LeagueMatches> => {
    const response = await fetch(`${config.footballDataApiUrl}/competitions/${league}/matches?status=SCHEDULED`, {
        headers
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`)
    }

    const data = await response.json()
    const matches = data.matches as FootballDataMatch[]

    // Get only the next 10 matches
    const nextMatches: Match[] = matches.slice(0, 10).map((match: FootballDataMatch) => ({
        id: match.id,
        homeTeam: {
            id: match.homeTeam.id,
            name: match.homeTeam.name,
            position: 0,
            points: 0,
            crest: match.homeTeam.crest
        },
        awayTeam: {
            id: match.awayTeam.id,
            name: match.awayTeam.name,
            position: 0,
            points: 0,
            crest: match.awayTeam.crest
        },
        date: match.utcDate,
        status: convertStatus(match.status)
    }))

    // Get standings to add team positions
    const standings = await getTeams(league)
    const teamPositions = new Map(standings.allTeams.map(team => [team.id, team.position]))

    // Update positions in matches
    nextMatches.forEach(match => {
        match.homeTeam.position = teamPositions.get(match.homeTeam.id) || 0
        match.awayTeam.position = teamPositions.get(match.awayTeam.id) || 0
    })

    return {
        leagueId: league,
        matches: nextMatches,
        lastUpdated: new Date().toISOString()
    }
}
