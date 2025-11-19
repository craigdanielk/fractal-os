#!/bin/bash

# FractalOS Seed Script
# Seeds the database with initial data from supabase/seed.sql

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the repo root (two levels up from scripts/setup/)
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

echo "Seeding database..."

# Try to load environment variables from .env file if it exists
if [ -f "$REPO_ROOT/.env.local" ]; then
  echo "Loading environment variables from .env.local file..."
  set -a
  source "$REPO_ROOT/.env.local"
  set +a
elif [ -f "$REPO_ROOT/.env" ]; then
  echo "Loading environment variables from .env file..."
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

# Check for required environment variables
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "Error: SUPABASE_DB_URL environment variable is not set."
  echo ""
  echo "Please set it using one of these methods:"
  echo "  1. Export it in your shell:"
  echo "     export SUPABASE_DB_URL='postgresql://user:password@host:port/database'"
  echo ""
  echo "  2. Add it to a .env file in the repo root:"
  echo "     SUPABASE_DB_URL='postgresql://user:password@host:port/database'"
  echo ""
  echo "  3. Get it from your Supabase dashboard:"
  echo "     Settings > Database > Connection string > URI"
  exit 1
fi

# Check if seed file exists
SEED_FILE="$REPO_ROOT/supabase/seed.sql"
if [ ! -f "$SEED_FILE" ]; then
  echo "Error: $SEED_FILE not found."
  exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed. Install PostgreSQL client tools."
  exit 1
fi

# Run seed file
echo "Running seed.sql from $SEED_FILE..."
cd "$REPO_ROOT"
psql "$SUPABASE_DB_URL" -f "$SEED_FILE"

echo "Database seeded successfully."

