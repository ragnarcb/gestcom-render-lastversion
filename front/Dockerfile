# Define a imagem base para o estágio de build usando Node.js 18 Alpine
FROM node:18-alpine as build
# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do npm para instalar dependências de forma eficiente
COPY package*.json ./
# Instala as dependências usando npm ci para garantir instalações consistentes
RUN npm ci

# Copia todo o código fonte do projeto para o container
COPY . .
# Executa o script de build definido no package.json
RUN npm run build

# Inicia o estágio de produção usando nginx Alpine como base
FROM nginx:alpine
# Copia os arquivos buildados do estágio anterior para o diretório do nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia o arquivo de configuração personalizado do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configura as permissões corretas para os arquivos estáticos
RUN chmod -R 755 /usr/share/nginx/html

# Define a porta que o container vai expor
EXPOSE 80

# Comando para iniciar o nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
