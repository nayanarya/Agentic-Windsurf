import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editedProjects, setEditedProjects] = useState({})
  const [saving, setSaving] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState({})
  const [selectedCoach, setSelectedCoach] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState({ show: false, projectId: null, changes: [] })

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    setExpandedProjects({})
  }, [selectedCoach])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/projects`)
      setProjects(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load projects. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const projectCoaches = useMemo(() => {
    const coaches = new Set(projects.map(p => p.coach).filter(c => c && c.trim()))
    return ['All', ...Array.from(coaches).sort()]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (selectedCoach === 'All') return projects
    return projects.filter(p => p.coach === selectedCoach)
  }, [projects, selectedCoach])

  const handleMonthlyChange = (projectId, month, field, value) => {
    setEditedProjects(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        monthly: {
          ...(prev[projectId]?.monthly || projects.find(p => p.id === projectId)?.monthly || {}),
          [month]: {
            ...(prev[projectId]?.monthly?.[month] || projects.find(p => p.id === projectId)?.monthly[month] || {}),
            [field]: parseFloat(value) || 0
          }
        },
        quarterly: prev[projectId]?.quarterly || projects.find(p => p.id === projectId)?.quarterly || {}
      }
    }))
  }

  const calculateQuarterlyTotal = (projectData, quarter, field) => {
    const quarterMonths = {
      'OND': ['Oct', 'Nov', 'Dec'],
      'JFM': ['Jan', 'Feb', 'Mar'],
      'AMJ': ['Apr', 'May', 'Jun'],
      'JAS': ['Jul', 'Aug', 'Sep']
    }
    
    const months = quarterMonths[quarter] || []
    return months.reduce((sum, month) => {
      return sum + (projectData.monthly[month]?.[field] || 0)
    }, 0)
  }

  const getChangeSummary = (projectId) => {
    const edited = editedProjects[projectId]
    const original = projects.find(p => p.id === projectId)
    if (!edited || !original) return []

    const changes = []
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    const fields = [
      { key: 'on_rev', label: 'On Rev' },
      { key: 'on_hc', label: 'On HC' },
      { key: 'off_rev', label: 'Off Rev' },
      { key: 'off_hc', label: 'Off HC' }
    ]

    months.forEach(month => {
      fields.forEach(field => {
        const oldValue = original.monthly[month]?.[field.key] || 0
        const newValue = edited.monthly?.[month]?.[field.key]
        if (newValue !== undefined && newValue !== oldValue) {
          changes.push({
            month,
            field: field.label,
            oldValue,
            newValue
          })
        }
      })
    })

    return changes
  }

  const handleSubmit = (projectId) => {
    if (!editedProjects[projectId]) return

    const changes = getChangeSummary(projectId)
    if (changes.length === 0) {
      alert('No changes detected')
      return
    }

    const project = projects.find(p => p.id === projectId)
    setConfirmDialog({
      show: true,
      projectId,
      projectName: project.project,
      changes
    })
  }

  const handleConfirmSave = async () => {
    const { projectId } = confirmDialog
    setConfirmDialog({ show: false, projectId: null, changes: [] })

    try {
      setSaving(true)
      await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, editedProjects[projectId])
      
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, ...editedProjects[projectId] }
          : p
      ))
      
      setEditedProjects(prev => {
        const newEdited = { ...prev }
        delete newEdited[projectId]
        return newEdited
      })
      
      alert('Project updated successfully!')
    } catch (err) {
      alert('Failed to update project: ' + err.message)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelSave = () => {
    setConfirmDialog({ show: false, projectId: null, changes: [] })
  }

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  const getProjectData = (project) => {
    return editedProjects[project.id] || project
  }

  const quarterGroups = [
    { quarter: 'OND', months: ['Oct', 'Nov', 'Dec'], label: "OND'25" },
    { quarter: 'JFM', months: ['Jan', 'Feb', 'Mar'], label: "JFM'26" },
    { quarter: 'AMJ', months: ['Apr', 'May', 'Jun'], label: "AMJ'26" },
    { quarter: 'JAS', months: ['Jul', 'Aug', 'Sep'], label: "JAS'26" }
  ]

  if (loading) return <div className="container"><h2>Loading projects...</h2></div>
  if (error) return <div className="container error"><h2>{error}</h2></div>

  return (
    <div className="container">
      <h1>Forecast Management System</h1>
      <p className="subtitle">Manage monthly and quarterly forecasts for all projects</p>
      
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="coach-filter">Project Coach:</label>
          <select 
            id="coach-filter"
            value={selectedCoach} 
            onChange={(e) => setSelectedCoach(e.target.value)}
            className="coach-filter"
          >
            {projectCoaches.map(coach => (
              <option key={coach} value={coach}>{coach}</option>
            ))}
          </select>
        </div>
        <button 
          className="dashboard-btn"
          onClick={() => window.open('/dashboard.html', '_blank')}
        >
          📊 Dashboard
        </button>
      </div>
      
      {filteredProjects.map(project => {
        const projectData = getProjectData(project)
        const isExpanded = expandedProjects[project.id]
        const hasChanges = !!editedProjects[project.id]

        return (
          <div key={project.id} className="project-card">
            <div className="project-header" onClick={() => toggleProject(project.id)}>
              <div className="project-info">
                <h3>{project.project}</h3>
                <div className="project-meta">
                  <span><strong>Client:</strong> {project.client}</span>
                  <span><strong>Division:</strong> {project.division}</span>
                  <span><strong>BU:</strong> {project.bu}</span>
                  <span><strong>Coach:</strong> {project.coach}</span>
                  <span><strong>Type:</strong> {project.project_type}</span>
                </div>
              </div>
              <button className="expand-btn">{isExpanded ? '▼' : '▶'}</button>
            </div>

            {isExpanded && (
              <div className="project-details">
                {quarterGroups.map(({ quarter, months, label }) => (
                  <div key={quarter} className="quarter-section">
                    <h4 className="quarter-title">{label}</h4>
                    <div className="quarter-row">
                      {months.map((month, idx) => (
                        <div key={month} className="month-column">
                          <h5>{month}'25</h5>
                          <div className="metric-group">
                            <label>ON Rev</label>
                            <input
                              type="number"
                              step="0.01"
                              value={projectData.monthly[month]?.on_rev || 0}
                              onChange={(e) => handleMonthlyChange(project.id, month, 'on_rev', e.target.value)}
                            />
                          </div>
                          <div className="metric-group">
                            <label>ON HC</label>
                            <input
                              type="number"
                              step="0.01"
                              value={projectData.monthly[month]?.on_hc || 0}
                              onChange={(e) => handleMonthlyChange(project.id, month, 'on_hc', e.target.value)}
                            />
                          </div>
                          <div className="metric-group">
                            <label>OFF Rev</label>
                            <input
                              type="number"
                              step="0.01"
                              value={projectData.monthly[month]?.off_rev || 0}
                              onChange={(e) => handleMonthlyChange(project.id, month, 'off_rev', e.target.value)}
                            />
                          </div>
                          <div className="metric-group">
                            <label>OFF HC</label>
                            <input
                              type="number"
                              step="0.01"
                              value={projectData.monthly[month]?.off_hc || 0}
                              onChange={(e) => handleMonthlyChange(project.id, month, 'off_hc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="quarter-column">
                        <h5>{label}</h5>
                        <div className="metric-group">
                          <label>ON Rev</label>
                          <input
                            type="number"
                            step="0.01"
                            value={calculateQuarterlyTotal(projectData, quarter, 'on_rev').toFixed(2)}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                        <div className="metric-group">
                          <label>ON HC</label>
                          <input
                            type="number"
                            step="0.01"
                            value={calculateQuarterlyTotal(projectData, quarter, 'on_hc').toFixed(2)}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                        <div className="metric-group">
                          <label>OFF Rev</label>
                          <input
                            type="number"
                            step="0.01"
                            value={calculateQuarterlyTotal(projectData, quarter, 'off_rev').toFixed(2)}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                        <div className="metric-group">
                          <label>OFF HC</label>
                          <input
                            type="number"
                            step="0.01"
                            value={calculateQuarterlyTotal(projectData, quarter, 'off_hc').toFixed(2)}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="actions">
                  <button 
                    className={`submit-btn ${hasChanges ? 'has-changes' : ''}`}
                    onClick={() => handleSubmit(project.id)}
                    disabled={!hasChanges || saving}
                  >
                    {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {confirmDialog.show && (
        <div className="modal-overlay" onClick={handleCancelSave}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Changes</h2>
            <div className="modal-body">
              <div className="project-name-section">
                <strong>Project:</strong> {confirmDialog.projectName}
              </div>
              
              <div className="changes-section">
                <h3>Changes Made:</h3>
                <ul className="changes-list">
                  {confirmDialog.changes.map((change, index) => (
                    <li key={index}>
                      <strong>{change.month} - {change.field}:</strong> {change.oldValue.toFixed(2)} → {change.newValue.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-save" onClick={handleConfirmSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn-cancel" onClick={handleCancelSave} disabled={saving}>
                Don't Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
