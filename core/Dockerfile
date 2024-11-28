FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /workspace/app

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Dar permissão de execução ao mvnw e construir o projeto
RUN chmod +x mvnw
RUN ./mvnw install -DskipTests

# Segunda etapa - imagem final
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /workspace/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
