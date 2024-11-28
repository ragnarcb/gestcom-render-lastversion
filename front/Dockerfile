# Etapa de build
FROM node:18-alpine as build
WORKDIR /app

# Copiar apenas arquivos necessários para instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar o resto dos arquivos e buildar
COPY . .
RUN npm run build

# Etapa de produção
FROM nginx:alpine
# Copiar a build
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configurar permissões
RUN chmod -R 755 /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
