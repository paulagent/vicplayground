# Deployment Notes

- Deploy `apps/web` and `apps/api` independently.
- Put both behind Cloudflare with WAF + rate limiting.
- Use managed PostgreSQL and enable automatic backups.
- Configure object storage credentials via secret manager.
