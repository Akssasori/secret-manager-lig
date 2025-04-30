import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export class SecretManagerService {

  private client: SecretManagerServiceClient;

  constructor() {
    this.client = new SecretManagerServiceClient();
  }

  /**
   * Fetch a secret from Google Secret Manager.
   * @param projectId ID project in Google Cloud, in case is name for app.
   * @param appName Name of secret.
   * @returns An object containing the environment variables.
   */
  async getSecrets(projectId: string, appName: string): Promise<Record<string, string>> {
    const [accessResponse] = await this.client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${appName}/versions/latest`,
    });

    const payload = accessResponse.payload?.data?.toString();
    if (!payload) {
      throw new Error(`The secret ${appName} is empty or was not found.`);
    }

    return JSON.parse(payload);
  }

  /**
   * Define the environment variables in process.env.
   * @param secrets Object containing the environment variables.
   */
  setEnvironmentVariables(secrets: Record<string, string>): void {
    for (const [key, value] of Object.entries(secrets)) {
      process.env[key] = value;
    }
  }

  /**
   * Update or create a secret in Google Secret Manager.
   * @param projectId ID project in Google Cloud, in case is name for app.
   * @param secretName Name of secret.
   * @param newVariables New variables to be added or updated in the JSON.
   */
  async updateSecretJson(
    projectId: string,
    secretName: string,
    newVariables: Record<string, string>
  ): Promise<void> {
    const secretPath = `projects/${projectId}/secrets/${secretName}`;

    try {
      // Tenta buscar o segredo para verificar se ele existe
      await this.client.getSecret({ name: secretPath });

      console.log(`The secret "${secretName}" already exists. Updating...`);

      // Se o segredo existe, busca o JSON atual
      const currentSecrets = await this.getSecrets(projectId, secretName);

      // Mescla as novas variáveis com o JSON atual
      const updatedSecrets = { ...currentSecrets, ...newVariables };

      // Adiciona uma nova versão do segredo com o JSON atualizado
      await this.client.addSecretVersion({
        parent: secretPath,
        payload: {
          data: Buffer.from(JSON.stringify(updatedSecrets), 'utf8'),
        },
      });

      console.log(`The secret "${secretName}" was successfully updated.`);
    } catch (error: any) {
      if (error.code === 5) {
        // Se o segredo não existir, cria um novo
        console.log(`The secret "${secretName}" does not exist. Creating...`);

        await this.client.createSecret({
          parent: `projects/${projectId}`,
          secretId: secretName,
          secret: {
            replication: {
              // Especifica a localização permitida (exemplo: us-central1)
              userManaged: {
                replicas: [
                  {
                    location: 'us-central1', // Substitua pela região permitida
                  },
                ],
              },
            },
          },
        });

        // Adiciona a primeira versão do segredo com as novas variáveis
        await this.client.addSecretVersion({
          parent: secretPath,
          payload: {
            data: Buffer.from(JSON.stringify(newVariables), 'utf8'),
          },
        });

        console.log(`The secret "${secretName}" was successfully created.`);
      } else {
        console.error(`Error accessing or creating the secret "${secretName}":`, error);
        throw error;
      }
    }
  }
}