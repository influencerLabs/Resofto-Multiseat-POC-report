import { get, put } from '@vercel/blob';

export const DB_BLOB = 'aster-multiseat-poc/database.xlsx';

export async function getDatabaseBlob() {
  try {
    return await get(DB_BLOB, {
      access: 'private',
      useCache: false,
    });
  } catch (error) {
    if (error?.code === 'blob_not_found') {
      return null;
    }

    throw error;
  }
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
