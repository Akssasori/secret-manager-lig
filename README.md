# Secret Manager Lib (English)

This library helps Node.js applications securely and automatically load environment variables from **Google Secret Manager**. It also supports programmatically updating secrets stored in GCP.

---

## 🚀 Installation

### 1. Install the library:

```bash
npm install secret-manager-lig
```

### 2. Install Google Cloud SDK:

For **macOS**:
```bash
brew install --cask google-cloud-sdk
```

For **Windows**:  
[Go to the installer](https://cloud.google.com/sdk/docs/install?hl=en#windows)

### 3. Authenticate and configure:

```bash
gcloud auth login
gcloud config set project abcinc-operation-ab-hdg-prd
gcloud auth application-default login
```

> Replace `abcinc-operation-ab-hdg-prd` with your actual GCP project ID.

---

## ⚙️ Project Configuration

Create a `.env` file and add:

```env
GCP_PROJECT_ID=your-project-id
SECRET_NAME=xx-operation-gcp-prd
```

---

## 🛠️ How to Use in Your App

### Automatically load secrets on startup:

```ts
import { initializeSecrets } from 'secret-manager-lig';

async function main() {
  await initializeSecrets('your-project-id', 'your-secret-name', {
    printSecrets: true, // Print secrets to console
    enable: true, // Controlled via env variable
  });

  console.log('App started!');
}

main();
```

### Update or create secrets:

```ts
import { SecretManagerService } from './SecretManagerService';

const secretManagerService = new SecretManagerService();

async function updateSecrets() {
  const projectId = process.env.GCP_PROJECT_ID || 'your-project-id';
  const secretName = process.env.SECRET_NAME || 'your-secret-name';

  const newVariables = {
    NEW_VARIABLE: 'NEW_VALUE',
    ANOTHER_VARIABLE: 'ANOTHER_VALUE',
  };

  await secretManagerService.updateSecretJson(projectId, secretName, newVariables);
  console.log('Secrets updated successfully!');
}
```

---

## 📌 Benefits

- No need to manually manage `.env` files;
- Secure and centralized secret management;
- Simplifies onboarding in team environments.

## Compatibility

This library is compatible with:
- Node.js ≥ 16.0.0
- TypeScript ≥ 4.5.0
---

# Secret Manager Lib(BR)

Esta biblioteca facilita o uso do **Google Secret Manager** em aplicações Node.js. Com ela, você consegue carregar automaticamente variáveis de ambiente a partir de um segredo armazenado no Google Cloud, além de atualizá-lo sempre que necessário.

---

## 🚀 Instalação

### 1. Instale a biblioteca:

```bash
npm install secret-manager-lig
```

### 2. Instale o SDK do Google Cloud:

Para **macOS**:
```bash
brew install --cask google-cloud-sdk
```

Para **Windows**:  
[Acesse o instalador aqui](https://cloud.google.com/sdk/docs/install?hl=pt-br#windows)

### 3. Autenticação e configuração

Autentique-se com o Google Cloud:

```bash
gcloud auth login
gcloud config set project abcinc-operation-ab-hdg-prd
gcloud auth application-default login
```

> Substitua `abcinc-operation-ab-hdg-prd` pelo ID do seu projeto.

---

## ⚙️ Configuração do projeto

Adicione as variáveis no seu `.env`:

```env
projectId=seu-project-id
appName=xx-operation-gcp-prd
```

---

## 🛠️ Como usar na aplicação

### Inicialização automática dos secrets:

```ts
import { initializeSecrets } from 'secret-manager-lig';

async function main() {
  await initializeSecrets('seu-project-id', 'seu-secret-name', {
    printSecrets: true, // Imprime os segredos no console
    enable: true, // Controla via variável de ambiente
  });

  console.log('Aplicação iniciada!');
}

main();
```

### Atualizar ou criar segredos:

```ts
import { SecretManagerService } from './SecretManagerService';

const secretManagerService = new SecretManagerService();

async function updateSecrets() {
  const projectId = process.env.GCP_PROJECT_ID || 'seu-project-id';
  const secretName = process.env.SECRET_NAME || 'seu-secret-name';

  const newVariables = {
    NEW_VARIABLE: 'NEW_VALUE',
    ANOTHER_VARIABLE: 'ANOTHER_VALUE',
  };

  await secretManagerService.updateSecretJson(projectId, secretName, newVariables);
  console.log('Segredo atualizado com sucesso!');
}
```

---

## 📌 Benefícios

- Elimina a necessidade de manter `.env` manual;
- Garante maior segurança com os dados sensíveis;
- Ideal para projetos com múltiplos desenvolvedores.

## Compatibilidade

Esta biblioteca é compatível com:
- Node.js ≥ 16.0.0
- TypeScript ≥ 4.5.0

---