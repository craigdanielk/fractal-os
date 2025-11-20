# Database Migration Guide

## Current Issue
Direct PostgreSQL connection is blocked (`EHOSTUNREACH` / `No route to host`).

## Solutions

### Option 1: Supabase Dashboard SQL Editor (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Run each migration file from `supabase/migrations/` in order:
   - `0002_tenanting.sql`
   - `0002_multi_tenant_structure.sql`
   - `0003_rls_policies.sql`
   - `0004_auth_jwt_claims.sql`
   - `0005_model_x_tenanting.sql`
   - `0006_model_x_rls_policies.sql`
   - `0007_phase17_rls.sql`
   - `0008_phase18_identity_graph.sql`
   - `0009_editing_locks.sql`
   - `0010_performance_indexes.sql`
   - `0011_phase10_rls.sql`
   - `0012_audit_logs.sql`

5. After migrations, run: `npm run seed`

### Option 2: Fix Connection Issues

1. **Check if project is paused:**
   - Go to Supabase Dashboard
   - If project shows "Paused", click "Resume"
   - Wait 2-3 minutes for project to activate

2. **Whitelist your IP:**
   - Go to Settings → Database
   - Add your current IP to allowed IPs
   - Or use "Allow all IPs" for development

3. **Try migration again:**
   ```bash
   npm run migrate
   ```

### Option 3: Use Supabase CLI

If you have Supabase CLI linked to your project:

```bash
# Link project (if not already linked)
supabase link --project-ref vjdwdwgdtpewoyakegix

# Push migrations
supabase db push
```

### Option 4: Connection Pooler (Alternative)

Try using the connection pooler URL instead:

1. Get connection pooler URL from Supabase Dashboard → Settings → Database
2. Update `.env`:
   ```
   SUPABASE_DB_URL='postgresql://postgres:[PASSWORD]@db.vjdwdwgdtpewoyakegix.supabase.co:6543/postgres?sslmode=require'
   ```
   (Note: port 6543 instead of 5432)

3. Run: `npm run migrate`

## After Migrations

Once migrations are complete, seed the database:

```bash
npm run seed
```

This will populate initial data (tenants, clients, projects, tasks).

