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
            timestamp: Date.now(),
        }
        await writeFile(getCacheFilePath(key), JSON.stringify(cacheItem))
    } catch (error) {
        console.error(`Error writing to cache for key ${key}:`, error)
    }
}

const readFromCache = async <T>(key: string, from_cache: boolean): Promise<T | null> => {
    let str = `Reading from cache for key ${key} , from_cache: ${from_cache}`
    try {
        const content = await readFile(getCacheFilePath(key), 'utf-8')
        const cacheItem: CacheItem<T> = JSON.parse(content)
        if (!from_cache) {
            // Check if cache is still valid
            const age = (Date.now() - cacheItem.timestamp) / 1000 // Convert to seconds
            if (age > CACHE_DURATION) {
                return null
            }
        }
        str += `, Cache for key ${key} is valid`
        return cacheItem.data
    } catch (error) {
        return null
    } finally {
        console.log(str)
    }
}

export const cacheTeams = async (league: League, data: LeagueData) => {
    await writeToCache(`teams_${league}`, data)
}

export const getCachedTeams = async (league: League, from_cache: boolean): Promise<LeagueData | null> => {
    return readFromCache<LeagueData>(`teams_${league}`, from_cache)
}

export const cacheMatches = async (league: League, data: LeagueMatches) => {
    await writeToCache(`matches_${league}`, data)
}

export const getCachedMatches = async (league: League, from_cache: boolean): Promise<LeagueMatches | null> => {
    return readFromCache<LeagueMatches>(`matches_${league}`, from_cache)
}
