# Postman Site Generator

This generator creates a complete validation bundle for the Adventurers Guild API:

- Postman collection
- Postman environment
- Static HTML strategy page
- README with execution guidance

## Usage

```bash
node scripts/generate-postman-site.mjs \
  --base-url https://adventurers-guild-api.vercel.app/api \
  --output-dir generated/postman-prod
```

## Output

The script writes:

- `adventurers-guild.postman_collection.json`
- `adventurers-guild.postman_environment.json`
- `index.html`
- `README.md`

## Notes

- The collection is designed for end-to-end API validation in Postman or Newman.
- It assumes a standard JWT auth flow through `POST /api/auth/token`.
- It focuses on stable catalog and character lifecycle coverage.
- The generator accepts either the site root or the `/api` URL and normalizes it automatically.
