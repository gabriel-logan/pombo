import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { EnvSecretConfig } from "src/configs/types";

import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [
    ConfigModule,
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
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
