# backend

Here's a bunch of wrangler commands that helped initialize the codebase.

```
npx wrangler init storyboard-app
npx wrangler d1 create storyboard-app-db
npx wrangler d1 execute storyboard-app-db --file schemas/schema.sql
npx wrangler whoami
npx wrangler publish
echo "value" | npx wrangler secret put "name"
```

## setup

Be sure to `npm install`.
