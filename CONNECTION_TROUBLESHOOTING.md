# Connection Troubleshooting Guide

## Current Status
- ✅ Project reference verified: `sjsafhcmlkkccxuchcdd`
- ❌ Database hostname not resolving: `db.sjsafhcmlkkccxuchcdd.supabase.co`

## Likely Cause
**Your Supabase project is paused** (common with free tier after inactivity).

## Solution Steps

### Step 1: Activate Your Project

1. Go to https://supabase.com/dashboard
2. Find your project (ref: `sjsafhcmlkkccxuchcdd`)
3. If it shows "Paused" or "Inactive", click **"Resume"** or **"Restore"**
4. Wait 2-3 minutes for the project to fully activate

### Step 2: Get Correct Connection String

Once the project is active:

1. Go to **Settings → Database**
2. Scroll to **Connection string** section
3. Copy the **URI** connection string (not the pooler)
4. It should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

5. Update your `.env` file:
   ```bash
   SUPABASE_DB_URL='[paste connection string here]'
   ```

### Step 3: Verify Connection

```bash
npm run verify-env
npm run migrate
```

### Step 4: Alternative - Use Dashboard SQL Editor

If connection issues persist, use the Supabase Dashboard:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file from `supabase/migrations/` in order
3. Then run: `npm run seed`

## Migration Files (in order)

1. `0002_tenanting.sql`
2. `0003_rls_policies.sql`
3. `0004_auth_jwt_claims.sql`
4. `0005_model_x_tenanting.sql`
5. `0006_model_x_rls_policies.sql`
6. `0007_phase17_rls.sql`
8. `0008_phase18_identity_graph.sql`
9. `0009_editing_locks.sql`
10. `0010_performance_indexes.sql`
11. `0011_phase10_rls.sql`
12. `0012_audit_logs.sql`

## After Migrations

Once migrations are complete:

```bash
npm run seed
```

This will populate initial data.

