import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import type { League, LeagueData, LeagueMatches } from '~/types'
import { useRuntimeConfig } from '#imports'

const CACHE_DIR = join(process.cwd(), 'cache')
const config = useRuntimeConfig()
const CACHE_DURATION = Number(config.cacheDuration) || 3600

interface CacheItem<T> {
    data: T
    timestamp: number
}

const ensureCacheDir = async () => {
    try {
        await mkdir(CACHE_DIR, { recursive: true })
    } catch (error) {
        console.error('Error creating cache directory:', error)
    }
}

const getCacheFilePath = (key: string) => join(CACHE_DIR, `${key}.json`)

const writeToCache = async <T>(key: string, data: T) => {
    try {
        await ensureCacheDir()
        const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now()
        }
        await writeFile(getCacheFilePath(key), JSON.stringify(cacheItem))
    } catch (error) {
        console.error(`Error writing to cache for key ${key}:`, error)
    }
}

const readFromCache = async <T>(key: string): Promise<T | null> => {
    try {
        const content = await readFile(getCacheFilePath(key), 'utf-8')
        const cacheItem: CacheItem<T> = JSON.parse(content)
        
        // Check if cache is still valid
        const age = (Date.now() - cacheItem.timestamp) / 1000 // Convert to seconds
        if (age > CACHE_DURATION) {
            return null
        }

        return cacheItem.data
    } catch (error) {
        return null
    }
}

export const cacheTeams = async (league: League, data: LeagueData) => {
    await writeToCache(`teams_${league}`, data)
}

export const getCachedTeams = async (league: League): Promise<LeagueData | null> => {
    return readFromCache<LeagueData>(`teams_${league}`)
}

export const cacheMatches = async (league: League, data: LeagueMatches) => {
    await writeToCache(`matches_${league}`, data)
}

export const getCachedMatches = async (league: League): Promise<LeagueMatches | null> => {
    return readFromCache<LeagueMatches>(`matches_${league}`)
}
