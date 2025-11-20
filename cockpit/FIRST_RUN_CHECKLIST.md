# First-Run Checklist

## Pre-Launch Verification

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (server-side only)
- [ ] `SUPABASE_DB_URL` is set (for migrations)
- [ ] `SUPABASE_JWT_SECRET` is set (for token minting)

### 2. Database Setup
- [ ] Run migrations: `npm run migrate`
- [ ] Verify RLS policies are enabled on all tables
- [ ] Seed initial data: `npm run seed`
- [ ] Verify tenant isolation works

### 3. Authentication
- [ ] Supabase Auth is configured
- [ ] OAuth providers configured (if using)
- [ ] Email/password auth enabled
- [ ] Test login flow works

### 4. Build Verification
- [ ] `npm run build` completes successfully
- [ ] `npm run start` boots without errors
- [ ] Dashboard loads correctly
- [ ] No console errors in browser

### 5. Core Features
- [ ] Projects CRUD works
- [ ] Tasks CRUD works
- [ ] Time entries can be logged
- [ ] Economics models accessible (admin/agency only)
- [ ] Clients can be created/managed

### 6. Realtime Features
- [ ] Presence indicators show active users
- [ ] Real-time updates work (create/edit/delete)
- [ ] Locking system prevents concurrent edits
- [ ] Broadcast channels work

### 7. Offline Support
- [ ] IndexedDB cache initializes
- [ ] Offline mode queues mutations
- [ ] Sync resumes when online
- [ ] No data loss during offline period

### 8. Security
- [ ] RLS policies enforce tenant isolation
- [ ] No cross-tenant data leakage
- [ ] Admin/agency/client roles work correctly
- [ ] Audit logs are being written

### 9. Performance
- [ ] Page load times acceptable
- [ ] No memory leaks in realtime connections
- [ ] Cache invalidation works correctly
- [ ] Database queries are optimized

### 10. Monitoring
- [ ] Telemetry endpoint responds
- [ ] Error logging works
- [ ] Heartbeat sends regularly
- [ ] Audit logs accessible

## Post-Launch Monitoring

- Monitor error rates in Supabase dashboard
- Check audit_logs table for anomalies
- Verify tenant isolation in production
- Monitor realtime connection counts
- Check sync queue for stuck items

