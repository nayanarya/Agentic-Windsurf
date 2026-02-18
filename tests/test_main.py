"""
Tests for main.py functionality.
"""

import unittest
from unittest.mock import patch
import io
import sys

# Import the main function from main.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import main


class TestMain(unittest.TestCase):
    """Test cases for the main function."""

    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_output(self, mock_stdout):
        """Test that main function prints expected output."""
        main()
        output = mock_stdout.getvalue()
        self.assertIn("Hello, Python Project!", output)
        self.assertIn("This is the main entry point.", output)


if __name__ == '__main__':
    unittest.main()
