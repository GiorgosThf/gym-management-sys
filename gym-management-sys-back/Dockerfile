FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

COPY pom.xml ./

RUN mvn dependency:go-offline --fail-never

COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:17

WORKDIR /app
# Copy the built jar from target folder to container
COPY  --from=build app/target/*.jar /app/app.jar

# Expose the port of the Spring Boot app
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]