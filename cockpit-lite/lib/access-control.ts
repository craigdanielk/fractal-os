/**
 * Access Control Helpers
 * Role-based access control and tenant membership validation
 */

export type Role = "admin" | "agency" | "client" | "contributor";

export interface UserContext {
  userId: string;
  tenantId: string;
  role: Role;
  accessibleTenantIds: string[];
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: Role, requiredRole: Role | Role[]): boolean {
  const roles: Role[] = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  const roleHierarchy: Record<Role, number> = {
    admin: 4,
    agency: 3,
    client: 2,
    contributor: 1,
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  
  return roles.some((role) => {
    const requiredLevel = roleHierarchy[role] || 0;
    return userLevel >= requiredLevel;
  });
}

/**
 * Check if user can access economics model
 * Economics is globally visible (read-only for clients)
 */
export function canAccessEconomics(userRole: Role): boolean {
  return hasRole(userRole, ["admin", "agency", "client"]);
}

/**
 * Check if user can modify economics model
 * Only admins and agencies can modify
 */
export function canModifyEconomics(userRole: Role): boolean {
  return hasRole(userRole, ["admin", "agency"]);
}

/**
 * Check if user can create tenants
 * Only admins can create tenants
 */
export function canCreateTenants(userRole: Role): boolean {
  return hasRole(userRole, ["admin"]);
}

/**
 * Check if user can view tenant
 */
export function canViewTenant(
  userContext: UserContext,
  targetTenantId: string
): boolean {
  // Admins can view all tenants
  if (userContext.role === "admin") {
    return true;
  }
  
  // Users can view their own tenant and accessible sub-tenants
  return userContext.accessibleTenantIds.includes(targetTenantId);
}

