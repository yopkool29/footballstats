export interface Team {
    id: number
    name: string
    position: number
    points: number
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    crest?: string
}

export interface MatchTeam {
    id: number
    name: string
    position: number
    points: number
    crest?: string  // URL du logo de l'équipe
}

export interface Match {
    id: number
    homeTeam: {
        id: number
        name: string
        position: number
        points: number
        crest?: string  // URL du logo de l'équipe
    }
    awayTeam: {
        id: number
        name: string
        position: number
        points: number
        crest?: string  // URL du logo de l'équipe
    }
    date: string
    competition: string
    status: 'SCHEDULED' | 'LIVE' | 'FINISHED'
}

export interface LeagueData {
    name: string
    id: League
    allTeams: Team[]
    topTeams: Team[]
    bottomTeams: Team[]
    lastUpdated: string
}

export interface LeagueMatches {
    leagueId: League
    matches: Match[]
    lastUpdated?: string
}

export interface ApiResponse<T> {
    data: T
    fromCache: boolean
}

export type League = string
