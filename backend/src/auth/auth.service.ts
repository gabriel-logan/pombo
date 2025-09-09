import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthPayload } from "src/common/types";
import { EnvSecretConfig } from "src/configs/types";

import {
  FollowerFollowingInfo,
  GithubAuthRequestDto,
  GithubAuthResponseDto,
  GithubAuthUserDataDto,
} from "./dto/github-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<EnvSecretConfig, true>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
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

    const user = await this.httpService.axiosRef.get<GithubAuthUserDataDto>(
      githubGetUserEndpoint,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
        },
      },
    );

    const followers = await this.httpService.axiosRef.get<
      Array<FollowerFollowingInfo>
    >(`https://api.github.com/users/${user.data.login}/followers`, {
      headers: { Authorization: `Bearer ${tokenResponse}` },
    });

    const following = await this.httpService.axiosRef.get<
      Array<FollowerFollowingInfo>
    >(`https://api.github.com/users/${user.data.login}/following`, {
      headers: { Authorization: `Bearer ${tokenResponse}` },
    });

    const payload: AuthPayload = {
      username: user.data.login,
      sub: user.data.id.toString(),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      id: user.data.id,
      username: user.data.login,
      avatar_url: user.data.avatar_url,
      url: user.data.html_url,
      followers: {
        quantity: followers.data.length,
        info: followers.data.map((follower) => ({
          login: follower.login,
          id: follower.id,
          avatar_url: follower.avatar_url,
          url: follower.url,
        })),
      },
      following: {
        quantity: following.data.length,
        info: following.data.map((followee) => ({
          login: followee.login,
          id: followee.id,
          avatar_url: followee.avatar_url,
          url: followee.url,
        })),
      },
    };
  }
}
