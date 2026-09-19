import { list, put } from '@vercel/blob';

export const DB_BLOB = 'aster-multiseat-poc/database.xlsx';

export async function getDatabaseBlob() {
  const result = await list({ prefix: DB_BLOB, limit: 1 });
  return result.blobs?.[0] || null;
}

export async function saveDatabase(buffer) {
  return put(DB_BLOB, buffer, { access: 'private', addRandomSuffix: false, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', allowOverwrite: true });
}
