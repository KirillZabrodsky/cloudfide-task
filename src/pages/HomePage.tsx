import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTreeData } from '../context/useTreeData'
import { parseTreeJson } from '../utils/tree'

const SAMPLE_JSON = `{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 },
        {
          "name": "components",
          "type": "folder",
          "children": [
            { "name": "Button.tsx", "type": "file", "size": 512 }
          ]
        }
      ]
    },
    { "name": "package.json", "type": "file", "size": 300 }
  ]
}`

export function HomePage() {
  const navigate = useNavigate()
  const { root, setRoot } = useTreeData()
  const [jsonInput, setJsonInput] = useState<string>(() =>
    root ? JSON.stringify(root, null, 2) : '',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadJson = (raw: string): void => {
    const parsedTree = parseTreeJson(raw)
    setRoot(parsedTree)
    setErrorMessage(null)
    navigate('/tree')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    try {
      loadJson(jsonInput)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid input data.')
    }
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const content = await file.text()
      setJsonInput(content)
      loadJson(content)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not read the uploaded file.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="panel">
      <h2 className="page-title">Import JSON Tree</h2>
      <p className="page-subtitle">
        Paste JSON directly or upload a file.
      </p>

      <form onSubmit={handleSubmit} className="stack">
        <textarea
          value={jsonInput}
          onChange={(event) => setJsonInput(event.target.value)}
          className="json-input"
          spellCheck={false}
          aria-label="JSON tree input"
        />

        <div className="actions-row">
          <button type="submit" className="button primary">
            Load Tree
          </button>
          <button type="button" className="button" onClick={() => setJsonInput(SAMPLE_JSON)}>
            Use Sample
          </button>
          <input type="file" accept=".json,application/json" onChange={handleFileUpload} />
        </div>
      </form>

      {errorMessage ? (
        <p role="alert">
          {errorMessage}
        </p>
      ) : null}
    </section>
  )
}
