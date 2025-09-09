import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import envSecrets from "src/configs/env.secrets";
import { EnvSecretConfig } from "src/configs/types";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    ConfigModule.forFeature(envSecrets),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvSecretConfig, true>) => {
        const { secret, expiration } =
          configService.get<EnvSecretConfig["jwtToken"]>("jwtToken");

        return {
          secret,
          signOptions: { expiresIn: expiration },
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
