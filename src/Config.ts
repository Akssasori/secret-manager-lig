import { SecretManagerService } from './SecretManagerService';

export async function initializeSecrets(
  projectId: string,
  appName: string,
  options?: { printSecrets?: boolean; enable?: boolean }
): Promise<void> {
  const { printSecrets = false, enable = true } = options || {};

  if (!enable) {
    console.log('Secret Manager is disabled');
    return;
  }

  const secretManagerService = new SecretManagerService();

  try {
    const secrets = await secretManagerService.getSecrets(projectId, appName);

    if (printSecrets) {
      console.log('Secrets found:', JSON.stringify(secrets, null, 2));
    }

    secretManagerService.setEnvironmentVariables(secrets);
    console.log('Secrets loaded and environment variables configured.');
  } catch (error) {
    console.error('Error loading secrets: ', error);
    throw error;
  }
}