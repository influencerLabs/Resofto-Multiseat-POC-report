import { get, put } from '@vercel/blob';

export const DB_BLOB = 'aster-multiseat-poc/database.xlsx';

export async function getDatabaseBlob() {
  return get(DB_BLOB, {
    access: 'private',
    useCache: false,
  });
}

export async function saveDatabase(buffer) {
  return put(DB_BLOB, buffer, {
    access: 'private',
    addRandomSuffix: false,
    contentType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    allowOverwrite: true,
  });
}
