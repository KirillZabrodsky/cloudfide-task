import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { FolderNode } from '../types/tree'
import { parseTreeJson } from '../utils/tree'
import { TreeDataContext } from './useTreeData'
import type { TreeDataContextValue } from './useTreeData'

const STORAGE_KEY = 'file-tree-explorer:root'

const loadStoredRoot = (): FolderNode | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return parseTreeJson(raw)
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function TreeDataProvider({ children }: { children: ReactNode }) {
  const [root, setRootState] = useState<FolderNode | null>(() => loadStoredRoot())

  useEffect(() => {
    if (root) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root))
      return
    }

    window.localStorage.removeItem(STORAGE_KEY)
  }, [root])

  const value = useMemo<TreeDataContextValue>(
    () => ({
      root,
      setRoot: (nextRoot) => setRootState(nextRoot),
    }),
    [root],
  )

  return <TreeDataContext.Provider value={value}>{children}</TreeDataContext.Provider>
}
