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
echo "Applying Drizzle migrations..."
drizzle-kit migrate \
  --config kernel/drizzle/schema.ts

echo "Drizzle migrations applied successfully."

# If Supabase migrations exist, offer to run them
if [ -d "supabase/migrations" ] && [ "$(ls -A supabase/migrations/*.sql 2>/dev/null)" ]; then
  echo ""
  echo "Note: Supabase migrations found in supabase/migrations/"
  echo "To apply Supabase migrations, run:"
  echo "  ./scripts/setup/migrate-supabase.sh"
  echo "  or"
  echo "  supabase migration up --schema public"
fi
