import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvSecretConfig } from "src/configs/types";

import {
  GithubAuthRequestDto,
  GithubAuthResponseDto,
} from "./dto/github-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<EnvSecretConfig, true>,
    private readonly httpService: HttpService,
  ) {}

  async githubSignIn(
    githubAuthDto: GithubAuthRequestDto,
  ): Promise<GithubAuthResponseDto> {
    const { code } = githubAuthDto;

    const {
      oauthEndpoint: githubOauthEndpoint,
      clientId: githubClientId,
      redirectUri: githubRedirectUri,
      clientSecret: githubClientSecret,
      apiEndpoint: githubGetUserEndpoint,
    } = this.configService.get<EnvSecretConfig["github"]>("github");

    const response = await this.httpService.axiosRef.post<string>(
      githubOauthEndpoint,
      {
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
        redirect_uri: githubRedirectUri,
      },
    );

    const tokenResponse = response.data.split("&")[0].split("=")[1];

    const user = await this.httpService.axiosRef.get<GithubAuthResponseDto>(
      githubGetUserEndpoint,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      },
    );

    return user.data;
  }
}
