install:
	pyenv install -s $(cat .python-version)
	pyenv local $(cat .python-version)
	poetry run python -m pip install --upgrade pip
	poetry install
	poetry run python download_model.py
	clear
	@echo "[+] Done! Usage: make scrape

scrape:
	poetry run python scraper.py

.PHONY: setup install test coverage
