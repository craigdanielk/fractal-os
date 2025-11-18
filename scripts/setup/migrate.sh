#!/bin/bash

# FractalOS Migration Script
# Applies database migrations using Drizzle.
# Designed to be deterministic and safe — no destructive operations.

set -e

echo "Running FractalOS migrations..."

# Check if drizzle-cli is installed
if ! command -v drizzle-kit &> /dev/null; then
  echo "Error: drizzle-kit is not installed. Install with:"
  echo "  npm install -g drizzle-kit"
  exit 1
fi

# Ensure migrations directory exists
if [ ! -d "kernel/drizzle/migrations" ]; then
  echo "Creating migrations directory..."
  mkdir -p kernel/drizzle/migrations
fi

# Run migrations
echo "Applying migrations..."
drizzle-kit migrate \
  --config kernel/drizzle/schema.ts

echo "Migrations applied successfully."
