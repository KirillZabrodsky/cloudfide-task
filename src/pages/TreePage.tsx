import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TreeNodeItem } from '../components/TreeNodeItem'
import { useTreeData } from '../context/useTreeData'
import { buildDisplayPath, searchTreeByName, toNodeRouteSegment } from '../utils/tree'

export function TreePage() {
  const { root } = useTreeData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['']))

  const query = searchParams.get('q') ?? ''

  const onSearchChange = (nextQuery: string): void => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextQuery.trim()) {
      nextParams.set('q', nextQuery)
    } else {
      nextParams.delete('q')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const toggleFolder = useCallback((path: string) => {
    setExpandedPaths((current) => {
      const next = new Set(current)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const matches = useMemo(() => {
    if (!root) {
      return []
    }

    return searchTreeByName(root, query)
  }, [root, query])

  if (!root) {
    return (
      <section className="panel">
        <h2 className="page-title">Tree View</h2>
        <p className="page-subtitle">No tree loaded yet.</p>
        <Link to="/" className="button">
          Go to Import
        </Link>
      </section>
    )
  }

  return (
    <section className="stack">
      <div className="panel">
        <h2 className="page-title">Tree View</h2>
        <div className="toolbar">
          <label htmlFor="search" className="search-label">
            Search by node name:
          </label>
          <input
            id="search"
            value={query}
            onChange={(event) => onSearchChange(event.target.value)}
            className="search-input"
            placeholder="e.g. button"
          />
        </div>
      </div>

      <div className="tree-grid">
        <article className="panel">
          <h3>Explorer</h3>
          <ul className="tree-list">
            <TreeNodeItem
              node={root}
              path=""
              depth={0}
              expandedPaths={expandedPaths}
              onToggleFolder={toggleFolder}
            />
          </ul>
        </article>

        <article className="panel">
          <h3>Search Results</h3>
          {query.trim() ? (
            matches.length > 0 ? (
              <ul className="result-list">
                {matches.map((match) => (
                  <li key={match.path || '__root__'}>
                    <Link to={`/tree/${toNodeRouteSegment(match.path)}`} className="result-link">
                      <span>{match.node.name}</span>
                      <span className="result-path">
                        {buildDisplayPath(root.name, match.path)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="hint-text">No nodes matched your query.</p>
            )
          ) : (
            <p className="hint-text">Type in the search field to scan the entire tree.</p>
          )}
        </article>
      </div>
    </section>
  )
}
