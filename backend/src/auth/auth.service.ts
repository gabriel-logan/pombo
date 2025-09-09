import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  GithubAuthRequestDto,
  GithubAuthResponseDto,
} from "./dto/github-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async githubSignIn(
    githubAuthDto: GithubAuthRequestDto,
  ): Promise<GithubAuthResponseDto> {
    const { code } = githubAuthDto;

    const githubOauthEndpoint = this.configService.get<string>(
      "GITHUB_OAUTH_ENDPOINT",
    )!;
    const githubClientId = this.configService.get<string>("GITHUB_CLIENT_ID");
    const githubClientSecret = this.configService.get<string>(
      "GITHUB_CLIENT_SECRET",
    );
    const githubRedirectUri = this.configService.get<string>(
      "GITHUB_REDIRECT_URI",
    );

    const githubGetUserEndpoint = "https://api.github.com/user";

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
