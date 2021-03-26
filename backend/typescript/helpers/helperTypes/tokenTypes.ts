export abstract class TokenControllerObject {
    public abstract invalidToken(token: string): Promise<boolean>;
    public abstract getPayload(token: string): Promise<TokenPayload | null>;
    public abstract invalidateToken(token: string): Promise<boolean>;
}

export type TokenPayload = {
    user_id: string,
}