## Install

```bash
npm install -g typescript
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run cli
npm run test
npm run lint
npm run format
npm run typeorm
npm run migration:run:dev
npm run migration:revert:dev
```

## CLI

```bash
yarn cli help
yarn cli register -u vendor1 -p password123 -e vendor1@example.com --isVendor
```

## Migrations

### Generate a migration

```bash
npm run typeorm migration:generate -- src/infrastructure/persistence/migration/MigrationName -d src/infrastructure/persistence/data-source.ts
```

### Create a migration

```bash
npm run typeorm migration:create  src/infrastructure/persistence/migration/MigrationName
```

### Run migrations

```bash
npm run migration:run
```

or

```bash
npm run migration:run:dev
```

### Rollback migrations

```bash
npm run migration:revert:dev
```

or

```
npm run migration:revert
```
