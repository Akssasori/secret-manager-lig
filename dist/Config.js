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
exports.initializeSecrets = initializeSecrets;
const SecretManagerService_1 = require("./SecretManagerService");
function initializeSecrets(projectId, appName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { printSecrets = false, enable = true } = options || {};
        if (!enable) {
            console.log('Secret Manager is disabled');
            return;
        }
        const secretManagerService = new SecretManagerService_1.SecretManagerService();
        try {
            const secrets = yield secretManagerService.getSecrets(projectId, appName);
            if (printSecrets) {
                console.log('Secrets found:', JSON.stringify(secrets, null, 2));
            }
            secretManagerService.setEnvironmentVariables(secrets);
            console.log('Secrets loaded and environment variables configured.');
        }
        catch (error) {
            console.error('Error loading secrets: ', error);
            throw error;
        }
    });
}
