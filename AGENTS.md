# Repository Instructions

## Commit Guidelines
- Keep commit messages concise. Use the imperative mood (e.g., "Add feature" not "Added feature").

## Development Guidelines
- Use `yarn lint` to check code style.
- Use `yarn format` to automatically format code.
- Run `yarn test:unit` before committing.
- If you change any TypeScript code, run `yarn build` to ensure it compiles.

## Testing
- Unit tests can be run with `yarn test:unit`.
- Run `test:coverage` for coverage report.
- `run-tests.sh` spins up a PostgreSQL container for integration tests if needed.

These instructions apply to the entire repository.
