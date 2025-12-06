.PHONY: help install install-dev clean lint lint-check format test test-coverage check repair all

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)AgentFoundry-instantly Makefile$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install production dependencies
	@echo "$(BLUE)Installing production dependencies...$(NC)"
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	@echo "$(BLUE)Installing development dependencies...$(NC)"
	pip install -e .[dev]
	pip install -r requirements.txt

clean: ## Clean build artifacts and cache files
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.pyo' -delete
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

lint: ## Run all linters (flake8, pylint, mypy)
	@echo "$(BLUE)Running linters...$(NC)"
	@echo "$(YELLOW)Running flake8...$(NC)"
	-flake8 src/ tests/ || true
	@echo "$(YELLOW)Running pylint...$(NC)"
	-pylint src/ tests/ || true
	@echo "$(YELLOW)Running mypy...$(NC)"
	-mypy src/ tests/ || true
	@echo "$(GREEN)✓ Linting complete$(NC)"

lint-check: ## Run linters and fail on any issues (for CI)
	@echo "$(BLUE)Running strict linting...$(NC)"
	flake8 src/ tests/
	pylint src/ tests/
	mypy src/ tests/
	@echo "$(GREEN)✓ All linters passed$(NC)"

format: ## Format code with black
	@echo "$(BLUE)Formatting code...$(NC)"
	black src/ tests/
	@echo "$(GREEN)✓ Formatting complete$(NC)"

test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	pytest tests/ -v
	@echo "$(GREEN)✓ Tests complete$(NC)"

test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	pytest tests/ -v --cov=src --cov-report=html --cov-report=term
	@echo "$(GREEN)✓ Coverage report generated$(NC)"

check: ## Run all checks (lint + test)
	@echo "$(BLUE)Running all checks...$(NC)"
	@$(MAKE) lint-check
	@$(MAKE) test
	@echo "$(GREEN)✓ All checks complete$(NC)"

repair: ## Auto-repair issues (format code)
	@echo "$(BLUE)Repairing code issues...$(NC)"
	@$(MAKE) format
	@echo "$(GREEN)✓ Repair complete$(NC)"

all: clean install-dev lint test ## Clean, install, lint, and test everything
	@echo "$(GREEN)✓ All operations complete$(NC)"
