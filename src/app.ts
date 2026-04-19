import { Database } from './configs/database';
import { envs } from './configs/envs';
import { AppRoutes } from './routes';
import { Server } from './server';

(async () => {
  await main();
})();

async function main() {
  await Database.connect();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}