export class GithubAuthRequestDto {
  public code: string;
}

export class FollowerFollowingInfo {
  public readonly login: string;
  public readonly id: number;
  public readonly avatar_url: string;
  public readonly url: string;
}

export class GithubAuthResponseDto {
  public readonly accessToken: string;
  public readonly username: string;
  public readonly id: number;
  public readonly avatar_url: string;
  public readonly url: string;
  public readonly followers: {
    quantity: number;
    info: Array<FollowerFollowingInfo>;
  };
  public readonly following: {
    quantity: number;
    info: Array<FollowerFollowingInfo>;
  };
}

export class GithubAuthUserDataDto {
  public readonly login: string;
  public readonly id: number;
  public readonly node_id: string;
  public readonly avatar_url: string;
  public readonly gravatar_id: string;
  public readonly url: string;
  public readonly html_url: string;
  public readonly followers_url: string;
  public readonly following_url: string;
  public readonly gists_url: string;
  public readonly starred_url: string;
  public readonly subscriptions_url: string;
  public readonly organizations_url: string;
  public readonly repos_url: string;
  public readonly events_url: string;
  public readonly received_events_url: string;
  public readonly type: string;
  public readonly user_view_type: string;
  public readonly site_admin: boolean;
  public readonly name: string;
  public readonly company: string;
  public readonly blog: string;
  public readonly location: string | null;
  public readonly email: string;
  public readonly hireable: boolean;
  public readonly bio: string;
  public readonly twitter_username: string | null;
  public readonly notification_email: string;
  public readonly public_repos: number;
  public readonly public_gists: number;
  public readonly followers: number;
  public readonly following: number;
  public readonly created_at: string;
  public readonly updated_at: string;
}
