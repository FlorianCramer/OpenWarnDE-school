import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const packageRoot = process.cwd();
const nextCli = path.resolve(packageRoot, 'node_modules/next/dist/bin/next');

process.loadEnvFile(path.resolve(packageRoot, '../client/.env.local'));
process.argv.splice(1, 1, nextCli);
createRequire(import.meta.url)(nextCli);
