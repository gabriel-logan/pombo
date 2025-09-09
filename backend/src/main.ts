import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import type { EnvGlobalConfig } from "./configs/types";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService =
    app.get<ConfigService<EnvGlobalConfig, true>>(ConfigService);

  const { nodeEnv, port } =
    configService.get<EnvGlobalConfig["server"]>("server");

  app.enableCors({
    origin: "*",
  });

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${nodeEnv}`);
}

void bootstrap();
