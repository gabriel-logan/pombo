export interface FollowerFollowingInfo {
  readonly login: string;
  readonly id: number;
  readonly avatar_url: string;
  readonly url: string;
}

export interface AuthUser {
  readonly accessToken: string;
  readonly username: string;
  readonly id: number;
  readonly avatar_url: string;
  readonly url: string;
  readonly followers: {
    quantity: number;
    info: FollowerFollowingInfo[];
  };
  readonly following: {
    quantity: number;
    info: FollowerFollowingInfo[];
  };
}

export interface AuthPayload {
  sub: string;
  username: string;
}
