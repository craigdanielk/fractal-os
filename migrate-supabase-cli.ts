import { config } from 'dotenv'
import { execSync } from 'child_process'
import { readdirSync } from 'fs'
import { join } from 'path'

// Load environment variables
config()

const dbUrl = process.env.SUPABASE_DB_URL!

if (!dbUrl) {
  console.error("Error: SUPABASE_DB_URL is not set in .env file")
  process.exit(1)
}

// Clean connection string (remove shell commands)
let cleanUrl = dbUrl
if (cleanUrl.includes('hostaddr=$')) {
  cleanUrl = cleanUrl.replace(/[?&]hostaddr=\$[^&]*/, '')
  cleanUrl = cleanUrl.replace(/[?&]options=[^&]*/, '')
}

console.log("🚀 Pushing migrations to Supabase using CLI...")
console.log(`Connection: ${cleanUrl.replace(/:[^:@]+@/, ':****@')}\n`)

const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
const files = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()

console.log(`Found ${files.length} migration file(s)\n`)

try {
  // Use Supabase CLI to push migrations (connection string should NOT be URL-encoded)
  execSync(
    `supabase db push --db-url "${cleanUrl}"`,
    {
      stdio: 'inherit',
      cwd: process.cwd(),
    }
  )
  console.log("\n🎉 Migrations pushed successfully!")
} catch (error: any) {
  console.error("\n❌ Migration failed")
  console.error("\n💡 Alternative: Use Supabase Dashboard SQL Editor")
  console.error("   1. Go to https://supabase.com/dashboard")
  console.error("   2. Select your project → SQL Editor")
  console.error("   3. Copy/paste each migration file from supabase/migrations/")
  process.exit(1)
}

