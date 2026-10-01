---
name: G3D production runtime
description: Production configuration needed for G3D server functions and database access.
---

G3D Orders relies on server-only handlers for the access gate, catalog persistence, and order writes. Production must build and start the Nitro Node server through the artifact's nested process configuration (`[services.production.build] args` and `[services.production.run] args`); static serving cannot run those handlers.

**Why:** The app initially used static artifact publishing even though its store and database features require a server runtime.

**How to apply:** Before publishing server-function changes, confirm the artifact uses process-based production configuration and smoke-test the built Node server. Do not use static rewrites for this app.