import { createContext, useContext } from 'react'
import type { FolderNode } from '../types/tree'

export interface TreeDataContextValue {
  root: FolderNode | null
  setRoot: (nextRoot: FolderNode) => void
}

export const TreeDataContext = createContext<TreeDataContextValue | null>(null)

export const useTreeData = (): TreeDataContextValue => {
  const contextValue = useContext(TreeDataContext)
  if (!contextValue) {
    throw new Error('useTreeData must be used inside TreeDataProvider.')
  }

  return contextValue
}
