# FRACTΛL Schema Version Lock

## Current Schema Version: 0009_editing_locks

### Migration History
- `0001_initial_supabase` - Initial schema
- `0002_tenanting` - Multi-tenant structure
- `0003_rls_policies` - Row Level Security
- `0004_auth_jwt_claims` - JWT claims
- `0005_model_x_tenanting` - Model-X tenant hierarchy
- `0006_model_x_rls_policies` - Model-X RLS
- `0007_phase17_rls` - Simplified owner-based RLS
- `0008_phase18_identity_graph` - Identity graph tables
- `0009_editing_locks` - Document locking

### Tables (Frozen)
- `tenants`
- `clients`
- `projects`
- `tasks`
- `time_entries`
- `economics_model`
- `vendors`
- `identity_users`
- `tenant_members`
- `tenant_links`
- `editing_locks`

### DO NOT MODIFY WITHOUT:
1. Creating new migration
2. Updating version number
3. Updating this file
4. Testing migration rollback

