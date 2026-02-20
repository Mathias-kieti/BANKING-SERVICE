# Stage 1: Build the Spring Boot jar with Java 21
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Run with Java 21 runtime
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /app/target/banking-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]