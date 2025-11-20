# Use Session Pooler Connection

The direct connection (`db.sjsafhcmlkkccxuchcdd.supabase.co:5432`) is **not IPv4 compatible**, which is why DNS lookups are failing.

## Solution: Use Session Pooler

1. In the "Connect to your project" modal, look for the **"Method"** dropdown
2. Change it from **"Direct connection"** to **"Session Pooler"** or **"Transaction Pooler"**
3. Copy the new connection string that appears (it will have a different hostname, likely `pooler.supabase.com` or `aws-0-[region].pooler.supabase.com`)
4. The port will be **6543** instead of 5432

## Expected Format:

The pooler connection string should look like:
```
postgresql://postgres.sjsafhcmlkkccxuchcdd:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Or:
```
postgresql://postgres.sjsafhcmlkkccxuchcdd:[YOUR_PASSWORD]@[REGION].pooler.supabase.com:6543/postgres
```

## After Getting the Pooler Connection String:

1. Update your `.env` file with the pooler connection string
2. Replace `[YOUR_PASSWORD]` with your actual database password
3. Run: `npm run migrate`

The pooler connection works on IPv4 networks and should resolve the connection issues!

