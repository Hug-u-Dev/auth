export const accesSecret = process.env.ACCESS_TOKEN_SECRET_KEY || "default_secret_key";
export const refreshSecret = process.env.REFRESH_TOKEN_SECRET_KEY || "default_secret_key_2";
export const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION_IN_SECONDS || "30";
export const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS || "300";