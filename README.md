## Install

```bash
npm install -g typescript
npm install
```

## Scripts

```bash
npm run start
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
<<<<<<< HEAD
npm run migration:run
```

### Rollback migrations
```bash
npm run migration:revert
```
=======
npm run typeorm migration:revert -- -d src/data-source.ts
```
>>>>>>> 9c7bc236fc7aca93f165b7de6ca74eced748c1f1
