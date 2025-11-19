#!/bin/bash

# FractalOS Supabase Migration Script
# Applies Supabase migrations from supabase/migrations/
# Uses Supabase CLI for direct database migrations

set -e

echo "Running Supabase migrations..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Error: Supabase CLI is not installed. Install with:"
  echo "  npm install -g supabase"
  echo "  or visit: https://supabase.com/docs/guides/cli"
  exit 1
fi

# Check for required environment variables
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "Error: SUPABASE_DB_URL environment variable is not set."
  echo "Please set it to your Supabase database connection string."
  exit 1
fi

# Ensure migrations directory exists
if [ ! -d "supabase/migrations" ]; then
  echo "Creating migrations directory..."
  mkdir -p supabase/migrations
fi

# Run migrations using Supabase CLI
echo "Applying Supabase migrations..."
supabase migration up --schema public --db-url "$SUPABASE_DB_URL"

echo "Supabase migrations applied successfully."

