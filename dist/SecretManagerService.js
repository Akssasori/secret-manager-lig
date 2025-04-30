"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretManagerService = void 0;
const secret_manager_1 = require("@google-cloud/secret-manager");
class SecretManagerService {
    constructor() {
        this.client = new secret_manager_1.SecretManagerServiceClient();
    }
    /**
     * Fetch a secret from Google Secret Manager.
     * @param projectId ID project in Google Cloud, in case is name for app.
     * @param appName Name of secret.
     * @returns An object containing the environment variables.
     */
    getSecrets(projectId, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [accessResponse] = yield this.client.accessSecretVersion({
                name: `projects/${projectId}/secrets/${appName}/versions/latest`,
            });
            const payload = (_b = (_a = accessResponse.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
            if (!payload) {
                throw new Error(`The secret ${appName} is empty or was not found.`);
            }
            return JSON.parse(payload);
        });
    }
    /**
     * Define the environment variables in process.env.
     * @param secrets Object containing the environment variables.
     */
    setEnvironmentVariables(secrets) {
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
    updateSecretJson(projectId, secretName, newVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretPath = `projects/${projectId}/secrets/${secretName}`;
            try {
                // Tenta buscar o segredo para verificar se ele existe
                yield this.client.getSecret({ name: secretPath });
                console.log(`The secret "${secretName}" already exists. Updating...`);
                // Se o segredo existe, busca o JSON atual
                const currentSecrets = yield this.getSecrets(projectId, secretName);
                // Mescla as novas variáveis com o JSON atual
                const updatedSecrets = Object.assign(Object.assign({}, currentSecrets), newVariables);
                // Adiciona uma nova versão do segredo com o JSON atualizado
                yield this.client.addSecretVersion({
                    parent: secretPath,
                    payload: {
                        data: Buffer.from(JSON.stringify(updatedSecrets), 'utf8'),
                    },
                });
                console.log(`The secret "${secretName}" was successfully updated.`);
            }
            catch (error) {
                if (error.code === 5) {
                    // Se o segredo não existir, cria um novo
                    console.log(`The secret "${secretName}" does not exist. Creating...`);
                    yield this.client.createSecret({
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
                    yield this.client.addSecretVersion({
                        parent: secretPath,
                        payload: {
                            data: Buffer.from(JSON.stringify(newVariables), 'utf8'),
                        },
                    });
                    console.log(`The secret "${secretName}" was successfully created.`);
                }
                else {
                    console.error(`Error accessing or creating the secret "${secretName}":`, error);
                    throw error;
                }
            }
        });
    }
}
exports.SecretManagerService = SecretManagerService;
