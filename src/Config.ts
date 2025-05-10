import { SecretManagerService } from './SecretManagerService';

export async function initializeSecrets(
  projectId: string,
  appName: string,
  options?: { printSecrets?: boolean; enable?: boolean }
): Promise<void> {

  // Detecta a versão do Node e avisa sobre a dependência correta
  const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  if (nodeMajor < 18) {
    console.warn(
      '[secret-manager-lig] Atenção: Para versões do Node menor que 18, use @google-cloud/secret-manager@5.x. ' +
      'Para versões do Node maior que 18+, use @google-cloud/secret-manager@6.x ou superior.'
    );
  }
  
  const printSecrets = options && options.printSecrets !== undefined ? options.printSecrets : false;
  const enable = options && options.enable !== undefined ? options.enable : true;

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