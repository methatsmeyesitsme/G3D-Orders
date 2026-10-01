---
name: G3D storage boundary
description: Keeps imported GitHub data read-only and app-owned changes in persistent storage.
---

The G3D Orders GitHub repository is a read-only catalog seed. Catalog edits/deletions and order records/status changes belong in the app's PostgreSQL database; never write them back to the shared repository.

**Why:** The user chose app-owned persistent storage for catalog changes and orders, and wants the shared GitHub repository left unchanged.

**How to apply:** Read GitHub only to seed the catalog when no saved database snapshot exists. Keep all runtime mutations in PostgreSQL unless the user explicitly changes this decision.