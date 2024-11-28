# Usa a imagem base do Eclipse Temurin JDK 21 com Alpine Linux para a fase de build
FROM eclipse-temurin:21-jdk-alpine as build
# Define o diretório de trabalho dentro do container
WORKDIR /workspace/app

# Copia os arquivos necessários do Maven para o container
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
# Copia o código fonte da aplicação
COPY src src

# Concede permissão de execução ao script Maven wrapper
RUN chmod +x mvnw
# Executa o build do projeto, pulando os testes
RUN ./mvnw install -DskipTests

# Inicia a segunda fase do build com uma nova imagem base
FROM eclipse-temurin:21-jdk-alpine
# Cria um volume para armazenamento temporário
VOLUME /tmp
# Copia o arquivo JAR gerado na fase anterior para a imagem final
COPY --from=build /workspace/app/target/*.jar app.jar
# Define o comando para executar a aplicação
ENTRYPOINT ["java","-jar","/app.jar"]
