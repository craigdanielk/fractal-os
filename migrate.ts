import { config } from 'dotenv'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'

// Load environment variables from .env file
config()

const dbUrl = process.env.SUPABASE_DB_URL!

if (!dbUrl) {
  console.error("Error: SUPABASE_DB_URL is not set in .env file")
  console.error("   Format: SUPABASE_DB_URL='postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres'")
  process.exit(1)
}

async function main() {
  console.log("🚀 Running Supabase Migrations")

  const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
  
  // Get all migration files sorted by name
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  if (files.length === 0) {
    console.error("No migration files found in supabase/migrations/")
    process.exit(1)
  }

  console.log(`Found ${files.length} migration file(s)`)

  const client = new Client({
    connectionString: dbUrl,
  })

  try {
    await client.connect()
    console.log("✓ Connected to database")

    // Apply each migration
    for (const file of files) {
      const filePath = join(migrationsDir, file)
      const sql = readFileSync(filePath, 'utf-8')
      
      console.log(`\nApplying ${file}...`)
      
      try {
        await client.query(sql)
        console.log(`✓ ${file} applied successfully`)
      } catch (error: any) {
        // Check if error is because table/column already exists (idempotent)
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log(`⚠️  ${file} - Some objects already exist (skipping)`)
        } else {
          console.error(`❌ Error applying ${file}:`, error.message)
          throw error
        }
      }
    }

    console.log("\n🎉 All migrations applied successfully!")
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error("MIGRATION FAILED:", e)
  process.exit(1)
})

