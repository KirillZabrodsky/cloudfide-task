import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { TreeDataProvider } from './context/TreeDataContext'
import { HomePage } from './pages/HomePage'
import { NodeDetailsPage } from './pages/NodeDetailsPage'
import { TreePage } from './pages/TreePage'

function App() {
  return (
    <TreeDataProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>FileTree Explorer</h1>
          </div>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              Import
            </NavLink>
            <NavLink
              to="/tree"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              Tree
            </NavLink>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/tree/:nodePath" element={<NodeDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </TreeDataProvider>
  )
}

export default App
