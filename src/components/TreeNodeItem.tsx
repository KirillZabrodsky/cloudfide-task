import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { TreeNode } from '../types/tree'
import { formatBytes, joinRelativePath, toNodeRouteSegment } from '../utils/tree'

interface TreeNodeItemProps {
  node: TreeNode
  path: string
  depth: number
  expandedPaths: Set<string>
  onToggleFolder: (path: string) => void
}

export function TreeNodeItem({
  node,
  path,
  depth,
  expandedPaths,
  onToggleFolder,
}: TreeNodeItemProps) {
  const isFolder = node.type === 'folder'
  const isExpanded = isFolder && expandedPaths.has(path)
  const canToggle = isFolder && node.children.length > 0

  return (
    <li>
      <div className="node-row" style={{ '--depth': depth } as CSSProperties}>
        {isFolder ? (
          <button
            type="button"
            onClick={() => onToggleFolder(path)}
            className="toggle-button"
            disabled={!canToggle}
            aria-label={isExpanded ? `Collapse folder ${node.name}` : `Expand folder ${node.name}`}
          >
            {isExpanded ? '-' : '+'}
          </button>
        ) : (
          <span className="toggle-placeholder" />
        )}

        <span className="node-type">{isFolder ? 'DIR' : 'FILE'}</span>
        <Link to={`/tree/${toNodeRouteSegment(path)}`} className="node-name">
          {node.name}
        </Link>
        <span className="node-meta">
          {isFolder ? `${node.children.length} children` : formatBytes(node.size)}
        </span>
      </div>

      {isFolder && isExpanded && node.children.length > 0 ? (
        <ul className="tree-list">
          {node.children.map((child) => (
            <TreeNodeItem
              key={joinRelativePath(path, child.name)}
              node={child}
              path={joinRelativePath(path, child.name)}
              depth={depth + 1}
              expandedPaths={expandedPaths}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
