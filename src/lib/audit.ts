import { appendAuditLog } from "./queries";

export function logAudit(
  action: string,
  entity: string,
  adminUser: string,
  entityId?: string,
  detail?: string,
) {
  appendAuditLog({
    action,
    entity,
    entityId: entityId ?? null,
    detail: detail ?? null,
    adminUser,
  });
}
