### Migrations

```bash
npm run typeorm migration:generate -- src/migration/CreateUserTable -d src/data-source.ts
npm run build
```

```bash
npm run typeorm migration:run -- -d src/data-source.ts
```