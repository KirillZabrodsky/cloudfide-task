import type { FolderNode, IndexedNode, TreeNode } from '../types/tree'

const ROOT_NODE_PARAM = '__root__'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const validateNode = (value: unknown, tracePath: string): TreeNode => {
  if (!isRecord(value)) {
    throw new Error(`Node "${tracePath || '/'}" must be an object.`)
  }

  const { name, type } = value
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`Node "${tracePath || '/'}" has invalid "name".`)
  }

  const currentPath = tracePath ? `${tracePath}/${name}` : name

  if (type === 'file') {
    const { size } = value
    if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) {
      throw new Error(`File "${currentPath}" has invalid "size".`)
    }

    return { name, type, size }
  }

  if (type === 'folder') {
    const { children } = value
    if (!Array.isArray(children)) {
      throw new Error(`Folder "${currentPath}" must define "children".`)
    }

    return {
      name,
      type,
      children: children.map((child) => validateNode(child, currentPath)),
    }
  }

  throw new Error(`Node "${currentPath}" has unsupported "type".`)
}

const validateTreeRoot = (value: unknown): FolderNode => {
  const root = validateNode(value, '')
  if (root.type !== 'folder') {
    throw new Error('Root node must be a folder.')
  }

  return root
}

export const parseTreeJson = (raw: string): FolderNode => {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON format.')
  }

  return validateTreeRoot(parsed)
}

export const joinRelativePath = (parentPath: string, nodeName: string): string =>
  parentPath ? `${parentPath}/${nodeName}` : nodeName

export const buildDisplayPath = (rootName: string, relativePath: string): string =>
  relativePath ? `${rootName}/${relativePath}` : rootName

export const buildNodeIndex = (root: FolderNode): Map<string, IndexedNode> => {
  const index = new Map<string, IndexedNode>()

  const visit = (node: TreeNode, path: string): void => {
    index.set(path, { node, path })

    if (node.type === 'folder') {
      node.children.forEach((child) => {
        visit(child, joinRelativePath(path, child.name))
      })
    }
  }

  visit(root, '')
  return index
}

export const getFolderTotalSize = (node: FolderNode): number =>
  node.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return acc + child.size
    }

    return acc + getFolderTotalSize(child)
  }, 0)

export const searchTreeByName = (
  root: FolderNode,
  query: string,
): Array<{ node: TreeNode; path: string }> => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return []
  }

  const matches: Array<{ node: TreeNode; path: string }> = []

  const walk = (node: TreeNode, path: string): void => {
    if (node.name.toLowerCase().includes(normalized)) {
      matches.push({ node, path })
    }

    if (node.type === 'folder') {
      node.children.forEach((child) => {
        walk(child, joinRelativePath(path, child.name))
      })
    }
  }

  walk(root, '')
  return matches
}

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`
}

export const toNodeRouteSegment = (relativePath: string): string =>
  relativePath ? encodeURIComponent(relativePath) : ROOT_NODE_PARAM

export const fromNodeRouteSegment = (segment: string | undefined): string | null => {
  if (!segment) {
    return null
  }

  return segment === ROOT_NODE_PARAM ? '' : segment
}
