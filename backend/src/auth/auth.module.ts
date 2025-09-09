import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envSecrets from "src/configs/env.secrets";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [ConfigModule.forFeature(envSecrets), HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
