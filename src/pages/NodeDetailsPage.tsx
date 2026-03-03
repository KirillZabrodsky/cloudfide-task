import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTreeData } from '../context/useTreeData'
import type { IndexedNode } from '../types/tree'
import {
  buildDisplayPath,
  buildNodeIndex,
  formatBytes,
  fromNodeRouteSegment,
  getFolderTotalSize,
  joinRelativePath,
  toNodeRouteSegment,
} from '../utils/tree'

export function NodeDetailsPage() {
  const { root } = useTreeData()
  const { nodePath } = useParams()

  const relativePath = fromNodeRouteSegment(nodePath)

  const indexedTree = useMemo(
    () => (root ? buildNodeIndex(root) : new Map<string, IndexedNode>()),
    [root],
  )

  if (!root) {
    return (
      <section className="panel">
        <h2 className="page-title">Node Details</h2>
        <p className="page-subtitle">No tree loaded yet.</p>
        <Link to="/" className="button">
          Go to Import
        </Link>
      </section>
    )
  }

  if (relativePath === null) {
    return (
      <section className="panel">
        <h2 className="page-title">Node Details</h2>
        <p>Missing node identifier in URL.</p>
        <Link to="/tree" className="button">
          Back to Tree
        </Link>
      </section>
    )
  }

  const currentNode = indexedTree.get(relativePath)

  if (!currentNode) {
    return (
      <section className="panel">
        <h2 className="page-title">Node Details</h2>
        <p>Node not found in the currently loaded tree.</p>
        <Link to="/tree" className="button">
          Back to Tree
        </Link>
      </section>
    )
  }

  return (
    <section className="stack">
      <div className="panel">
        <h2 className="page-title">Node Details</h2>
        <p className="page-subtitle">
          {buildDisplayPath(root.name, currentNode.path)}
        </p>
        <Link to="/tree" className="button">
          Back to Tree
        </Link>
      </div>

      {currentNode.node.type === 'file' ? (
        <article className="panel detail-grid">
          <h3>File</h3>
          <p>
            Name: <strong>{currentNode.node.name}</strong>
          </p>
          <p>
            Size: <strong>{formatBytes(currentNode.node.size)}</strong>
          </p>
          <p>
            Full path: {buildDisplayPath(root.name, currentNode.path)}
          </p>
        </article>
      ) : (
        <article className="panel detail-grid">
          <h3>Folder</h3>
          <p>
            Name: <strong>{currentNode.node.name}</strong>
          </p>
          <p>
            Direct children: <strong>{currentNode.node.children.length}</strong>
          </p>
          <p>
            Total subtree size: <strong>{formatBytes(getFolderTotalSize(currentNode.node))}</strong>
          </p>

          <div>
            <h4>Children</h4>
            {currentNode.node.children.length > 0 ? (
              <ul className="result-list">
                {currentNode.node.children.map((child) => {
                  const childPath = joinRelativePath(currentNode.path, child.name)
                  return (
                    <li key={childPath}>
                      <Link className="result-link" to={`/tree/${toNodeRouteSegment(childPath)}`}>
                        <span>{child.name}</span>
                        <span className="result-path">{buildDisplayPath(root.name, childPath)}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="hint-text">This folder has no children.</p>
            )}
          </div>
        </article>
      )}
    </section>
  )
}
