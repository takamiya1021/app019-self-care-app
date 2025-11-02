import { SessionRecord, SessionSummary } from '@/types'

const STORAGE_KEY = 'self-care:sessions'
const ONE_DAY_MS = 24 * 60 * 60 * 1000

type StoredSessionRecord = SessionRecord

const isBrowser = typeof window !== 'undefined'

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const readStorage = (): StoredSessionRecord[] => {
  if (!isBrowser) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredSessionRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (error) {
    console.error('セッション記録の読み込みに失敗しました', error)
    return []
  }
}

const writeStorage = (records: StoredSessionRecord[]) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (error) {
    console.error('セッション記録の保存に失敗しました', error)
  }
}

const startOfDayKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dayKeyToDate = (key: string): Date => {
  const [year, month, day] = key.split('-').map((value) => Number.parseInt(value, 10))
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  date.setHours(0, 0, 0, 0)
  return date
}

export const getSessionRecords = (): SessionRecord[] => {
  return readStorage()
}

export const addSessionRecord = (record: Omit<SessionRecord, 'id'>): SessionRecord[] => {
  const newRecord: StoredSessionRecord = {
    ...record,
    id: generateId()
  }

  const current = readStorage()
  const updated = [newRecord, ...current]
  writeStorage(updated)
  return updated
}

const calculateLongestStreak = (uniqueDayKeysAsc: string[]): number => {
  if (uniqueDayKeysAsc.length === 0) return 0

  let longest = 1
  let current = 1

  for (let index = 1; index < uniqueDayKeysAsc.length; index++) {
    const prev = dayKeyToDate(uniqueDayKeysAsc[index - 1])
    const currentDate = dayKeyToDate(uniqueDayKeysAsc[index])
    const diff = (currentDate.getTime() - prev.getTime()) / ONE_DAY_MS

    if (diff === 1) {
      current += 1
    } else if (diff > 1) {
      current = 1
    }

    if (current > longest) {
      longest = current
    }
  }

  return longest
}

const calculateCurrentStreak = (dayKeySet: Set<string>): number => {
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  while (dayKeySet.has(startOfDayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

const buildRecentDays = (dayKeySet: Set<string>, days: number): SessionSummary['recentDays'] => {
  const recent: SessionSummary['recentDays'] = []

  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - offset)
    const key = startOfDayKey(date)
    recent.push({
      date: key,
      completed: dayKeySet.has(key)
    })
  }

  return recent
}

export const getSessionSummary = (): SessionSummary => {
  const records = readStorage()

  if (records.length === 0) {
    return {
      todayCompleted: false,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      recentDays: buildRecentDays(new Set(), 7),
      lastSession: undefined
    }
  }

  const sorted = [...records].sort((a, b) => {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  })

  const dayKeys = sorted.map((record) => startOfDayKey(new Date(record.completedAt)))
  const uniqueDayKeys = Array.from(new Set(dayKeys))
  const dayKeySet = new Set(uniqueDayKeys)
  const todayKey = startOfDayKey(new Date())

  const summary: SessionSummary = {
    todayCompleted: dayKeySet.has(todayKey),
    totalSessions: records.length,
    currentStreak: calculateCurrentStreak(dayKeySet),
    longestStreak: calculateLongestStreak([...uniqueDayKeys].sort()),
    recentDays: buildRecentDays(dayKeySet, 7),
    lastSession: sorted[0]
  }

  return summary
}
