import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import {
  GithubAuthRequestDto,
  GithubAuthResponseDto,
} from "./dto/github-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("github/sign-in")
  async githubSignIn(
    @Body() githubAuthDto: GithubAuthRequestDto,
  ): Promise<GithubAuthResponseDto> {
    return await this.authService.githubSignIn(githubAuthDto);
  }
}
