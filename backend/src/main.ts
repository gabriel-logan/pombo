import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
  });

  const port = 3000;

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
