# Architecture Notes

- Keep backend as authorization source of truth.
- Social auth identity is persisted to local `users` + `auth_accounts` tables.
- Content and moderation rely on explicit `status` fields for reversible actions.
- Upload binaries stay in object storage; DB keeps metadata and ownership.
