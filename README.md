### Install

```bash
npm install -g typescript
```

### Scripts

```bash
npm run start
npm run build
npm run test
npm run lint
npm run typeorm
npm run migration:run
npm run migration:revert
```


### Migrations

Generate a migration

```bash
npm run typeorm migration:generate -- src/migration/CreateUserTable -d src/data-source.ts
npm run build
```

Run migrations
```bash
npm run typeorm migration:run -- -d src/data-source.ts
```

Rollback migrations
```bash
npm run typeorm migration:revert -- -d src/data-source.ts
```
