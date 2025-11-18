

#!/bin/bash

# FractalOS Deployment Script
# Pushes local changes to the remote Git repository.
# This script performs NO build steps and NO environment modifications.
# It exists purely to standardise git push operations.

set -e

echo "FractalOS: Preparing to push changes..."

# Ensure we are inside a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Error: Not inside a git repository."
  exit 1
fi

# Add all changes
echo "Staging changes..."
git add .

# Commit using timestamp if no message provided
if [ -z "$1" ]; then
  COMMIT_MSG="FractalOS update: $(date '+%Y-%m-%d %H:%M:%S')"
else
  COMMIT_MSG="$1"
fi

echo "Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || {
  echo "Nothing to commit."
}

# Push to current branch
echo "Pushing to remote..."
git push

echo "FractalOS: Push complete."