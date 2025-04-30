export declare class SecretManagerService {
    private client;
    constructor();
    /**
     * Fetch a secret from Google Secret Manager.
     * @param projectId ID project in Google Cloud, in case is name for app.
     * @param appName Name of secret.
     * @returns An object containing the environment variables.
     */
    getSecrets(projectId: string, appName: string): Promise<Record<string, string>>;
    /**
     * Define the environment variables in process.env.
     * @param secrets Object containing the environment variables.
     */
    setEnvironmentVariables(secrets: Record<string, string>): void;
    /**
     * Update or create a secret in Google Secret Manager.
     * @param projectId ID project in Google Cloud, in case is name for app.
     * @param secretName Name of secret.
     * @param newVariables New variables to be added or updated in the JSON.
     */
    updateSecretJson(projectId: string, secretName: string, newVariables: Record<string, string>): Promise<void>;
}
