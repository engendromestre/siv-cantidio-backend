# Ambiente de desenvolvimento

Após clonar o projeto para seu ambiente, 

# Rodar migrações

Criando uma gestão de mudanças nos esquemas de banco de dados
```
npm run migrate:ts create -- --name create-patients-table.ts --folder ./src/core/patient/infra/db/sequelize/migrations --skip-verify

npm run migrate:ts create -- --name create-category-patient-table.ts --folder ./src/core/patient/infra/db/sequelize/migrations --skip-verify

npm run migrate:ts create -- --name create-genre-patient-table.ts --folder ./src/core/patient/infra/db/sequelize/migrations --skip-verify

npm run migrate:ts create -- --name create-image-medias-table.ts --folder ./src/core/patient/infra/db/sequelize/migrations --skip-verify
```

Cada agregado possui uma mais migrações. 
Após criar o banco de dados, conforme definida nas variáveis de ambiente, rode as migrações para criar as tabelas de acordo com a sintaxe abaixo:
```
npm run migrate:ts up
```

Para reverter uma migração feita utilize o seguinte comando:
```
npm run migrate:ts down
```

# Cobertura de Código

OS tests runners das linguagens de progração conseguem passar um "pente fino" nas linhas de código e conseguem verificar quais linhas de código estão sendo contempladas, quais não estão.

Para rodar a cobertura de código:
```
npm run test:cov
```

# Autenticação - DEV

- Rodar o arquivo docker-compose.keycloak.yaml em uma nova sessão de terminal
```
docker compose -f docker-compose.keycloak.yaml up
```

- Criar um realm (reino) com o nome de siv-cantidio
- Criar um usuário: admin@admin.com
- Criar um e-mail: admin@admin.com
- Marcar Email verified
- First Name: Admin
- Last Name: Admin
- Credentials / Password: secret
- Criar um Client
    - Client /Create Client
    - Type: OpenID Connect
    - Client ID: siv-admin-frontend
- Testar geração do token no api.http

## Criando permissão administrativa no KeyCloak

Há muitas formas de se trabalhar com autorização (rbac, acl, authorization clients, etc). Aqui será relacionado o usuário a uma role (papel) administrativa.

- Realm Roles (papéis globais no Realm)
    - Role name: admin-catalog
    - Users in role: admin@admin.com
    - Gerar chave privada e pública a partir do arquivo create-rsa.js
    - Gerar um token a partir do arquivo generate-token.ts
    - Copiar token gerado no api.http
```
node create-rsa.js
node generate-token.ts
```

# Swagger
```
http://localhost:3000/api

# Test E2E
npm run test:e2e:watch -- --runInBand
```