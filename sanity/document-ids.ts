// IDs determinísticos por tenant. Usam hífen porque IDs com ponto são privados no Sanity.
export const siteSettingsId = (tenantId: string) => `siteSettings-${tenantId}`;
export const lumeHomeId = (tenantId: string) => `lumeHome-${tenantId}`;
