# FRACTΛL Launch Checklist

## Pre-Launch

### 1. Database
- [ ] Deploy all Supabase migrations (`0010_performance_indexes.sql` and prior)
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test tenant isolation with multiple test accounts
- [ ] Verify economics model is globally visible (read-only for clients)
- [ ] Create test data for all modules (projects, tasks, time, economics, vendors)

### 2. Security
- [ ] Rotate Supabase service role key
- [ ] Rotate Supabase anon key
- [ ] Verify CORS is locked to production domain
- [ ] Enable HTTPS redirects (Next.js config)
- [ ] Verify HMAC validation for MCP listener (if applicable)
- [ ] Test tenant scoping on all queries
- [ ] Verify RLS policies prevent cross-tenant access

### 3. Environment Variables
- [ ] Set `NEXT_PUBLIC_ENV=production`
- [ ] Verify all required env vars are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_DB_URL`
  - `SUPABASE_JWT_SECRET`
- [ ] Remove unused environment variables
- [ ] Test environment validation on boot

### 4. Access Control
- [ ] Create admin role test user
- [ ] Create agency role test user
- [ ] Create client role test user
- [ ] Create contributor role test user
- [ ] Test "client with their own clients" workflow
- [ ] Verify multi-tenant isolation with impersonation tests
- [ ] Test economics model visibility (admin/agency can modify, client read-only)

### 5. Performance
- [ ] Verify database indexes are created
- [ ] Test pagination on all list endpoints
- [ ] Verify client-side caching is working
- [ ] Test offline mode (IndexedDB sync)
- [ ] Verify realtime subscriptions are working
- [ ] Test conflict resolution for concurrent edits

### 6. UI/UX
- [ ] Verify "FRACTΛL" branding is consistent
- [ ] Test loading skeletons on all pages
- [ ] Test empty states on all pages
- [ ] Verify mobile responsive design
- [ ] Test dark/light theme toggle
- [ ] Verify glass panel consistency
- [ ] Test sync banner when going online/offline

### 7. Stability
- [ ] Test IndexedDB sync loop
- [ ] Verify offline time logging
- [ ] Test conflict resolver for tasks
- [ ] Verify "resume sync" banner appears when online
- [ ] Test error boundary catches errors
- [ ] Verify telemetry logging is working

### 8. Telemetry
- [ ] Verify Pulse logging for actions
- [ ] Test error boundary error logging
- [ ] Verify usage heartbeat (every 60s)
- [ ] Confirm clientId + tenantId in logs (no PII)

## Deployment

### 9. Infrastructure
- [ ] Deploy Supabase migrations
- [ ] Deploy Fly.io kernel (if applicable)
- [ ] Deploy Cockpit-Lite to Vercel
- [ ] Point domain (Cloudflare) to Vercel
- [ ] Set up SSL certificate
- [ ] Verify DNS propagation

### 10. Authentication
- [ ] Set up email/password auth in Supabase
- [ ] Set up Google OAuth in Supabase
- [ ] Test user signup flow
- [ ] Test user login flow
- [ ] Test password reset flow
- [ ] Verify JWT tokens include tenant_id and role

## Post-Launch

### 11. Smoke Tests
- [ ] Create a project
- [ ] Create a task
- [ ] Log time entry
- [ ] View economics model
- [ ] Create/edit vendor
- [ ] Test tenant switching (if applicable)
- [ ] Test realtime updates (open in two browsers)
- [ ] Test offline mode (disable network, make changes, re-enable)

### 12. Monitoring
- [ ] Set up error tracking (Sentry or similar)
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring
- [ ] Verify telemetry is flowing
- [ ] Set up alerts for critical errors

### 13. Documentation
- [ ] Update README with production setup
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Create user guide (if applicable)

## Rollback Plan
- [ ] Document rollback steps
- [ ] Test rollback procedure
- [ ] Have database backup ready
- [ ] Have previous version ready to deploy

