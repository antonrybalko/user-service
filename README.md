## Install

```bash
npm install -g typescript
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run typeorm
npm run migration:run
npm run migration:revert
```


## Migrations

### Generate a migration

```bash
npm run typeorm migration:generate -- src/migration/MigrationName -d src/data-source.ts
```

### Run migrations
```bash
npm run build
npm run typeorm migration:run -- -d src/data-source.ts
```

or

```bash
npm run migration:run
```

### Rollback migrations
```bash
npm run migration:revert
```

or

```
npm run typeorm migration:revert -- -d src/data-source.ts
```
