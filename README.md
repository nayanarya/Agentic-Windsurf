# Python Project

A modern Python project with proper structure and tooling.

## Project Structure

```
.
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── main.py        # Entry point
├── requirements.txt  # Dependencies
└── README.md      # This file
```

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the main script:
```bash
python main.py
```

## Development

- Run tests: `pytest`
- Format code: `black .`
- Lint code: `flake8`
- Type checking: `mypy .`

## License

MIT License
