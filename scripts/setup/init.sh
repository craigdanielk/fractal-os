#!/bin/bash

# FractalOS Init Script
# Bootstraps a fresh environment with deterministic steps only.
# No external calls, no destructive operations.

set -e

echo "Initializing FractalOS environment..."

# Ensure we're inside a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Error: This directory is not a git repository."
  exit 1
fi

# Create local environment file if missing
if [ ! -f ".env" ]; then
  echo "Creating .env from env.sample..."
  cp kernel/env/env.sample .env
else
  echo ".env file already exists, skipping."
fi

# Prepare drizzle directory
if [ ! -d "kernel/drizzle/migrations" ]; then
  echo "Creating migrations directory..."
  mkdir -p kernel/drizzle/migrations
fi

echo "FractalOS environment initialized successfully."
