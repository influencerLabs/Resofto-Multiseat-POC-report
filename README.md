# Resofto Aster Multiseat POC Manager

A simple Next.js application based on the Resofto Aster Multiseat POC Excel workbook.

## Architecture
- Frontend: Next.js + React
- Database: Excel `.xlsx` workbook
- Persistent storage: Vercel Blob
- Excel processing: SheetJS (`xlsx`)
- Hosting: Vercel

The deployed Vercel filesystem is ephemeral, so the application stores the Excel database in Vercel Blob. The workbook remains the source of truth and can be downloaded at any time.

## Deploy to Vercel
1. Create a GitHub repository and upload this project.
2. In Vercel, import the GitHub repository.
3. In Vercel Storage, create a Blob store and connect it to this project.
4. Confirm the `BLOB_READ_WRITE_TOKEN` environment variable is available to the deployment.
5. Deploy.
6. Open the app. The first visit initializes the Excel database from `public/seed.xlsx` into Vercel Blob.

## Local development
```bash
npm install
npm run dev
```

## Important
This is intentionally a lightweight internal POC application. Excel is not a multi-user transactional database. For multiple simultaneous users, audit history, authentication, role-based access and high-volume records, move the storage layer to PostgreSQL/Supabase while retaining Excel export.
