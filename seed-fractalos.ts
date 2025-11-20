import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

// Load env vars
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url) {
  console.error("Error: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is not set")
  process.exit(1)
}

if (!service) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not set")
  process.exit(1)
}

const db = createClient(url, service, {
  auth: { persistSession: false }
})

async function main() {
  console.log("🚀 FractalOS SEED INITIATED")

  // 1. Ensure schema exists
  const tenantsCheck = await db.from('tenants').select('id').limit(1)
  if (tenantsCheck.error) {
    console.error("❌ Database schema missing:", tenantsCheck.error)
    console.error("\n⚠️  Migrations have not been run yet.")
    console.error("\n📋 To fix this:")
    console.error("   1. Run migrations: npm run migrate")
    console.error("   2. Or apply migrations via Supabase Dashboard SQL Editor")
    console.error("   3. Then run: npm run seed")
    process.exit(1)
  }
  console.log("✓ Database schema validated")

  // 2. Create tenant
  const { data: tenant, error: tenantErr } = await db
    .from('tenants')
    .insert([{ name: 'FractalOS Master', slug: 'fractal-master' }])
    .select()
    .single()

  if (tenantErr) {
    // If tenant already exists, fetch it
    if (tenantErr.code === '23505') { // Unique violation
      const { data: existing } = await db
        .from('tenants')
        .select('*')
        .eq('slug', 'fractal-master')
        .single()
      if (existing) {
        console.log("✓ Tenant already exists, using existing tenant")
        const tenant_id = existing.id
        
        // Continue with seeding using existing tenant
        await seedData(tenant_id)
        return
      }
    }
    console.error("❌ Failed to create tenant:", tenantErr)
    process.exit(1)
  }

  console.log("✓ Tenant created")
  const tenant_id = tenant.id

  await seedData(tenant_id)
}

async function seedData(tenant_id: string) {
  // 3. Seed clients (matches baseline schema)
  const clients = [
    { name: 'R17 Ventures', tenant_id },
    { name: 'Champion Grip', tenant_id },
    { name: 'WCT Pay', tenant_id }
  ]

  for (const client of clients) {
    const { error } = await db.from('clients').upsert(client, {
      onConflict: 'id',
      ignoreDuplicates: true
    })
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error(`Error creating client ${client.name}:`, error)
      process.exit(1)
    }
  }

  console.log("✓ Clients seeded")

  // 4. Economics defaults
  const { error: econErr } = await db.from('economics').upsert({
    tenant_id,
    name: "Default Economics Model",
    base_rate: 450,
    direct_expenses: 5000,
    margin_targets: 0.30,
    overhead_pct: 0.15
  }, {
    onConflict: 'id',
    ignoreDuplicates: true
  })

  if (econErr && econErr.code !== '23505') {
    console.error("❌ Economics seed failed:", econErr)
    process.exit(1)
  }

  console.log("✓ Economics model seeded")
  console.log("🎉 SEED COMPLETE — FractalOS is ready.")
}

main().catch((e) => {
  console.error("SEED FAILED:", e)
  process.exit(1)
})
