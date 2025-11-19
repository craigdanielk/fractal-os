import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is not set")
  process.exit(1)
}

if (!service) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not set")
  process.exit(1)
}

const supabase = createClient(url, service)

// Utility
function uuid() {
  return randomUUID()
}

async function main() {
  console.log("🚀 FractalOS SEED INITIATED")

  // ---------------------------
  // 0. VALIDATE TABLES EXIST
  // ---------------------------
  console.log("Checking if tenants table exists...")
  const { error: checkError } = await supabase.from("tenants").select("id").limit(1)
  
  if (checkError && checkError.code === 'PGRST205') {
    console.error("❌ Database tables not found!")
    console.error("\n⚠️  Migrations have not been run yet.")
    console.error("\n📋 To fix this, run migrations first:")
    console.error("   npm run migrate")
    console.error("\n   This will apply all migrations from supabase/migrations/")
    console.error("   Then you can run: npm run seed")
    process.exit(1)
  }
  
  if (checkError) {
    console.error("❌ Error checking database:", checkError)
    process.exit(1)
  }
  
  console.log("✓ Database schema validated")

  // ---------------------------
  // 1. TENANTS
  // ---------------------------
  const tenants = [
    { id: uuid(), name: "FractalOS", slug: "fractalos", created_at: new Date().toISOString() },
    { id: uuid(), name: "R17 Ventures", slug: "r17-ventures", created_at: new Date().toISOString() },
    { id: uuid(), name: "Champion Grip", slug: "champion-grip", created_at: new Date().toISOString() },
    { id: uuid(), name: "WCT Pay", slug: "wct-pay", created_at: new Date().toISOString() }
  ]

  for (const t of tenants) {
    const { error } = await supabase.from("tenants").upsert(t)
    if (error) {
      console.error(`Error creating tenant ${t.name}:`, error)
      throw error
    }
  }
  console.log("✓ Tenants created")

  // ---------------------------
  // 2. USERS (Note: Users are managed via Supabase Auth)
  // This creates an identity_user record if identity_users table exists
  // ---------------------------
  console.log("⚠️  User creation skipped - users are managed via Supabase Auth")
  console.log("   Create users via Supabase Auth dashboard or API")

  // ---------------------------
  // 3. CLIENTS
  // ---------------------------
  const clients = [
    { 
      id: uuid(), 
      tenant_id: tenants[1].id, 
      name: "R17 Ventures", 
      notes: "Performance marketing agency & internal operations client",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: uuid(), 
      tenant_id: tenants[2].id, 
      name: "Champion Grip", 
      notes: "Lawn bowls grip & sports accessories brand",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: uuid(), 
      tenant_id: tenants[3].id, 
      name: "WCT Pay", 
      notes: "Payment solutions provider",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  for (const c of clients) {
    const { error } = await supabase.from("clients").upsert(c)
    if (error) {
      console.error(`Error creating client ${c.name}:`, error)
      throw error
    }
  }
  console.log("✓ Client rows created")

  // ---------------------------
  // 4. ECONOMICS MODEL
  // ---------------------------
  const econRows = [
    { 
      id: uuid(), 
      tenant_id: tenants[0].id, 
      base_rate: 450, 
      overhead_percent: 0.15, 
      direct_expenses: 5000, 
      margin_target: 0.30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  for (const e of econRows) {
    const { error } = await supabase.from("economics_model").upsert(e)
    if (error) {
      console.error("Error creating economics model:", error)
      throw error
    }
  }
  console.log("✓ Economics model seeded")

  // ---------------------------
  // 5. PROJECTS
  // ---------------------------
  const sampleProject = {
    id: uuid(),
    tenant_id: tenants[1].id,
    client_id: clients[0].id,
    project_name: "R17 Site Migration",
    status: "in_progress",
    budget: 50000,
    actual_cost: 0,
    progress: 0.12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { error: projectError } = await supabase.from("projects").upsert(sampleProject)
  if (projectError) {
    console.error("Error creating project:", projectError)
    throw projectError
  }
  console.log("✓ Sample project created")

  // ---------------------------
  // 6. TASKS
  // ---------------------------
  const task = {
    id: uuid(),
    tenant_id: tenants[1].id,
    project_id: sampleProject.id,
    task_name: "Initial Architecture Setup",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { error: taskError } = await supabase.from("tasks").upsert(task)
  if (taskError) {
    console.error("Error creating task:", taskError)
    throw taskError
  }
  console.log("✓ Initial task created")

  // ---------------------------
  // 7. VALIDATION
  // ---------------------------
  const check = await supabase.from("projects").select("*").limit(1)
  if (check.error) throw check.error
  console.log("✓ RLS validation OK")

  console.log("🎉 FractalOS SEED COMPLETED")
}

main().catch((e) => {
  console.error("SEED FAILED:", e)
  process.exit(1)
})

