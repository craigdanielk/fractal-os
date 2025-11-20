# How to Get the Correct Database Connection String

Since your project is active but DNS isn't resolving, you need to get the **exact** connection string from your Supabase dashboard.

## Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (`sjsafhcmlkkccxuchcdd`)
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. You'll see several options:
   - **URI** (for direct connection)
   - **Connection pooling** (for connection pooler)

## Copy the Connection String:

Look for the **URI** format that looks like one of these:

**Option 1 - Direct Connection:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.sjsafhcmlkkccxuchcdd.supabase.co:5432/postgres
```

**Option 2 - Connection Pooler (might work better):**
```
postgresql://postgres.sjsafhcmlkkccxuchcdd:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Option 3 - Transaction Mode Pooler:**
```
postgresql://postgres.sjsafhcmlkkccxuchcdd:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Update Your .env File:

Replace the `SUPABASE_DB_URL` line with the exact connection string from your dashboard (including your actual password).

Then test:
```bash
npm run migrate
```

## Alternative: Use Connection Pooler

If direct connection doesn't work, try the **Connection pooling** option (port 6543) - it's often more reliable and doesn't require IP whitelisting.

