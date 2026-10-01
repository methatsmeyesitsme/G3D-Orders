---
name: GitHub import permissions
description: Separates public repository cloning from the app's runtime GitHub write access.
---

A successful public clone only grants access to repository contents; it does not authorize the running app to write orders or catalog changes back to GitHub.

**Why:** The imported storefront could read public catalog data without a connector, but its order and admin mutations require a separate GitHub credential.

**How to apply:** Keep public preview reads independent from write authorization. Enable mutations only after setting up the needed provider access through Replit's integration or secrets flow.