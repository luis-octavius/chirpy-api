import { jwtDecode } from "jwt-decode";
import type { UserRequest } from "../types/users";
import type { UserProfile, AuthTokens, DecodedToken } from "../types/auth";

export class AuthProfile {
  private static instance: AuthProfile;
  private _user: UserProfile | null = null;
  private _tokens: AuthTokens | null = null;
  private _isAuthenticated = false;

  private constructor() {
    this.loadFromStorage();
  }

  // singleton
  public static getInstance(): AuthProfile {
    if (!AuthProfile.instance) {
      AuthProfile.instance = new AuthProfile();
    }
    return AuthProfile.instance;
  }

  get user(): UserProfile | null {
    return this._user;
  }

  get tokens(): AuthTokens | null {
    return this._tokens;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  async login(credentials: UserRequest): Promise<void> {
    try {
      const response = await this.authenticateUser(credentials);

      this.setSession(response.tokens, response.user);

      window.dispatchEvent(
        new CustomEvent("auth:login", {
          detail: { user: this._user },
        }),
      );
    } catch (err) {
      throw new Error("Authentication failed: ", err);
    }
  }

  logout(): void {
    this.clearSession();

    window.dispatchEvent(new CustomEvent("auth:logout"));

    window.location.href = "/login";
  }

  async refreshToken(): Promise<boolean> {
    if (!this._tokens?.refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await this.refreshAccessToken(this._tokens.refreshToken);

      this._tokens = {
        ...this._tokens,
        accessToken: response.accessToken,
        expiresIn: response.expiresIn,
      };

      this.saveToStorage();

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  private setSession(tokens: AuthTokens, user: UserProfile): void {
    this._tokens = tokens;
    this._user = user;
    this._isAuthenticated = true;
    this.saveToStorage();
  }

  private clearSession(): void {
    this._tokens = null;
    this._user = null;
    this._isAuthenticated = false;
    this.clearStorage();
  }

  private saveToStorage(): void {
    if (this._tokens && this._user) {
      localStorage.setItem("auth_tokens", JSON.stringify(this._tokens));
      localStorage.setItem("auth_user", JSON.stringify(this._user));
      localStorage.setItem("auth_isAuthenticated", "true");
    }
  }

  private loadFromStorage(): void {
    try {
      const tokensStr = localStorage.getItem("auth_tokens");
      const userStr = localStorage.getItem("auth_user");
      const isAuthenticated = localStorage.getItem("auth_isAuthenticated");

      if (tokensStr && userStr && isAuthenticated === "true") {
        this._tokens = JSON.parse(tokensStr);
        this._user = JSON.parse(userStr);
        this._isAuthenticated = true;
      }

      this.checkTokenValidity();
    } catch {
      this.clearSession();
    }
  }

  private clearStorage(): void {
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_isAuthenticated");
  }

  private checkTokenValidity(): void {
    if (!this._tokens) return;

    try {
      const decoded: DecodedToken = jwtDecode(this._tokens.accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        this.refreshToken();
      }
    } catch {
      this.logout();
    }
  }

  private async authenticateUser(
    credentials: UserRequest,
  ): Promise<{ tokens: AuthTokens; user: UserProfile }> {
    // TODO: Terminar apiClient para forjar esse método

    // Mock temporário
    return {
      tokens: {
        accessToken: "mock" + Date.now(),
        refreshToken: "mock_refresh_token" + Date.now(),
        expiresIn: 3600,
      },
      user: {
        id: "1",
        email: credentials.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        isChirpRed: false,
      },
    };
  }

  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    // TODO: Implementar chamada à endpoint correspondente em apiClient
    // const response = await api.post
    return {
      accessToken: "refreshed_token" + Date.now(),
      expiresIn: 3600,
    };
  }

  getAuthHeader(): Record<string, string> {
    if (!this._tokens?.accessToken) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this._tokens.accessToken}`;
    }
  }
}
