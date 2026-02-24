# Forecast Management Application

A full-stack application for managing project forecasts with monthly and quarterly data. Built with React (frontend) and FastAPI (backend), with data persistence in Excel format.

## Features

- 📊 View all projects with detailed information
- 📅 Edit monthly data (Oct-Sep) for each project
- 📈 Edit quarterly data (OND, JFM, AMJ, JAS)
- 💾 Save changes directly back to Excel spreadsheet
- 🎨 Modern, responsive UI with expandable project cards
- ✅ Real-time validation and change tracking

## Project Structure

```
forecast_app/
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── App.css         # Styles
│   └── package.json        # Node dependencies
└── README.md               # This file
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd forecast_app/backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd forecast_app/frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

From the `forecast_app/backend` directory:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Start the Frontend Development Server

From the `forecast_app/frontend` directory:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **View Projects**: The application loads all projects from `forecast_dummy.xlsx` on startup
2. **Expand Project**: Click on any project card to view detailed monthly and quarterly data
3. **Edit Data**: Modify any field in the monthly or quarterly sections
4. **Save Changes**: Click the "Save Changes" button (enabled when changes are detected)
5. **Verify**: Changes are immediately saved back to the Excel file

## API Endpoints

- `GET /api/projects` - Retrieve all projects with monthly/quarterly data
- `PUT /api/projects/{project_id}` - Update a specific project
- `GET /health` - Health check endpoint

## Data Structure

Each project contains:
- **Basic Info**: Division, Client, Project Name, BU, Coach, Type
- **Monthly Data**: 12 months (Oct-Sep) with ON/OFF Revenue and Headcount
- **Quarterly Data**: 4 quarters (OND, JFM, AMJ, JAS) with ON/OFF Revenue and Headcount

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- Pandas - Data manipulation
- OpenPyXL - Excel file handling
- Pydantic - Data validation

### Frontend
- React 18 - UI framework
- Vite - Build tool
- Axios - HTTP client
- CSS3 - Styling

## Troubleshooting

### Backend won't start
- Ensure Python virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check that port 8000 is not in use

### Frontend shows connection error
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure axios is installed: `npm install axios`

### Changes not saving
- Check backend logs for errors
- Verify Excel file is not open in another application
- Ensure you have write permissions for the Excel file

## Development

To modify the application:

1. **Add new fields**: Update the column mappings in `backend/main.py`
2. **Change styling**: Edit `frontend/src/App.css`
3. **Modify UI**: Update `frontend/src/App.jsx`

## License

MIT License
