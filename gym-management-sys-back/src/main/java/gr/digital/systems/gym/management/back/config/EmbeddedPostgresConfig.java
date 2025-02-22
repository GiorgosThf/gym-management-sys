package gr.digital.systems.gym.management.back.config;

import com.zaxxer.hikari.HikariDataSource;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Objects;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("dev")
public class EmbeddedPostgresConfig {

	private static final Logger LOG = LoggerFactory.getLogger(EmbeddedPostgresConfig.class);

	@Bean(destroyMethod = "close")
	public EmbeddedPostgres embeddedPostgres() throws IOException {
		EmbeddedPostgres pg = EmbeddedPostgres.start();
		LOG.info("Embedded Postgres started at port: {} ", pg.getPort());
		return pg;
	}

	@Bean
	public DataSource dataSource(
			EmbeddedPostgres embeddedPostgres,
			@Value("${spring.datasource.username}") String username,
			@Value("${spring.datasource.password}") String password,
			@Value("${spring.datasource.database.default}") String defaultDatabase,
			@Value("${spring.datasource.database}") String database
	) {

		final String defaultJdbcUrl = embeddedPostgres.getJdbcUrl(username, defaultDatabase);

		this.executeSql(defaultJdbcUrl, username, password, "create-db.sql");

		String gymdbJdbcUrl = embeddedPostgres.getJdbcUrl(username, database);

		this.executeSql(gymdbJdbcUrl, username, password, "init-db.sql");

		HikariDataSource dataSource = new HikariDataSource();
		dataSource.setJdbcUrl(gymdbJdbcUrl);
		dataSource.setUsername(username);
		dataSource.setPassword(password);
		return dataSource;
	}

	private void executeSql(final String jdbcUrl, final String username, final String password, final String sqlFile) {
		try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
			 Statement statement = connection.createStatement()) {

			String sql = Files.readString(Paths.get(
					Objects.requireNonNull(getClass().getClassLoader().getResource(sqlFile)).toURI())
			);

			statement.execute(sql);

			LOG.info("Full database setup executed from {} URL: {}", sqlFile, jdbcUrl);
		} catch (SQLException | URISyntaxException | IOException e) {
			LOG.error("Failed to execute embedded-init.sql: {}", e.getMessage(), e);
		}
	}
}
