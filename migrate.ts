import { config } from 'dotenv'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'
import { execSync } from 'child_process'

// Load environment variables from .env file
config()

let dbUrl = process.env.SUPABASE_DB_URL!

// Clean up connection string - remove shell command substitutions
// Some Supabase connection strings include $(dig ...) which Node.js can't execute
if (dbUrl && dbUrl.includes('hostaddr=$')) {
  // Remove the hostaddr parameter with shell command
  dbUrl = dbUrl.replace(/[?&]hostaddr=\$[^&]*/, '')
  // Also remove any other problematic parameters
  dbUrl = dbUrl.replace(/[?&]options=[^&]*/, '')
  console.log("⚠️  Cleaned connection string (removed shell commands)")
}

// Extract hostname and resolve to IPv4 if needed
function resolveIPv4(hostname: string): string | null {
  try {
    // Try to resolve to IPv4 using dig
    const result = execSync(`dig +short ${hostname} | grep -E '^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+$' | head -1`, { encoding: 'utf-8' }).trim()
    return result || null
  } catch {
    return null
  }
}

// Force IPv4 connection if possible
if (dbUrl) {
  const hostMatch = dbUrl.match(/@([^:]+):/)
  if (hostMatch) {
    const hostname = hostMatch[1]
    const ipv4 = resolveIPv4(hostname)
    if (ipv4) {
      // Replace hostname with IPv4 address
      dbUrl = dbUrl.replace(`@${hostname}:`, `@${ipv4}:`)
      console.log(`✓ Resolved ${hostname} to IPv4: ${ipv4}`)
    }
  }
}

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

  // Parse and validate connection string
  console.log(`\nConnecting to database...`)
  console.log(`Connection string: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`) // Hide password
  
  const client = new Client({
    connectionString: dbUrl,
    // Add connection timeout and retry options
    connectionTimeoutMillis: 10000,
    // Ensure SSL is enabled for Supabase
    ssl: {
      rejectUnauthorized: false, // Supabase uses valid certificates
    },
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
    console.error("\n💡 Troubleshooting:")
    console.error("   1. Check your SUPABASE_DB_URL in .env file")
    console.error("   2. Verify your Supabase project is active")
    console.error("   3. Check your network connection")
    console.error("   4. Ensure your IP is allowed in Supabase dashboard (Settings > Database)")
    console.error("\n   Connection string format:")
    console.error("   SUPABASE_DB_URL='postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres'")
    process.exit(1)
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error("MIGRATION FAILED:", e)
  process.exit(1)
})

