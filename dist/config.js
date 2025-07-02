process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}
export const config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
};
