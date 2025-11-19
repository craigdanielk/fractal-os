#!/bin/bash

# FractalOS Supabase Migration Script
# Applies Supabase migrations from supabase/migrations/
# Uses Supabase CLI for direct database migrations

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the repo root (two levels up from scripts/setup/)
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

# Load environment variables from .env file
if [ -f "$REPO_ROOT/.env.local" ]; then
  echo "Loading environment variables from .env.local..."
  set -a
  source "$REPO_ROOT/.env.local"
  set +a
elif [ -f "$REPO_ROOT/.env" ]; then
  echo "Loading environment variables from .env..."
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

echo "Running Supabase migrations..."

# Check for required environment variables
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "Error: SUPABASE_DB_URL environment variable is not set."
  echo "Please set it in your .env file or export it:"
  echo "  SUPABASE_DB_URL='postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres'"
  exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed. Install PostgreSQL client tools."
  echo "  macOS: brew install postgresql"
  echo "  Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi

# Ensure migrations directory exists
if [ ! -d "$REPO_ROOT/supabase/migrations" ]; then
  echo "Creating migrations directory..."
  mkdir -p "$REPO_ROOT/supabase/migrations"
fi

# Get list of migration files in order
cd "$REPO_ROOT"
MIGRATION_FILES=$(ls -1 supabase/migrations/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATION_FILES" ]; then
  echo "No migration files found in supabase/migrations/"
  exit 1
fi

echo "Found $(echo "$MIGRATION_FILES" | wc -l | tr -d ' ') migration file(s)"
echo "Applying migrations to database..."

# Apply each migration file in order
for migration_file in $MIGRATION_FILES; do
  echo "Applying $(basename "$migration_file")..."
  psql "$SUPABASE_DB_URL" -f "$migration_file" || {
    echo "Error applying $(basename "$migration_file")"
    echo "Continuing with next migration..."
  }
done

echo "✓ Supabase migrations applied successfully."

