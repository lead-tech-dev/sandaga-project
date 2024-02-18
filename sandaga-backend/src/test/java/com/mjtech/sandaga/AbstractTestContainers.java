package com.mjtech.sandaga;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
public abstract class AbstractTestContainers {
    private static DockerImageName IMAGE = DockerImageName.parse("postgis/postgis:15-3.4")
            .asCompatibleSubstituteFor("postgres:15");

    @BeforeAll
    static void beforeAll() {
        Flyway flyway = Flyway
                .configure()
                .dataSource(
                        postgreSqlContainer.getJdbcUrl(),
                        postgreSqlContainer.getUsername(),
                        postgreSqlContainer.getPassword()
                ).load();

        flyway.migrate();
    }
    @Container
    protected static final PostgreSQLContainer<?> postgreSqlContainer =
            new PostgreSQLContainer<>(IMAGE)
                    .withDatabaseName("maximancode-dao-unit-test")
                    .withUsername("maximan")
                    .withPassword("Makong57");

    @DynamicPropertySource
    protected static void registerDataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add(
                "spring.datasource.url",
                postgreSqlContainer::getJdbcUrl
        );

        registry.add(
                "spring.datasource.username",
                postgreSqlContainer::getUsername
        );

        registry.add(
                "spring.datasource.password",
                postgreSqlContainer::getPassword
        );
    }
}
