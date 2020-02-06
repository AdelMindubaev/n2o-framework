package net.n2oapp.framework.boot;

import net.n2oapp.framework.boot.sql.SqlDataProviderEngine;
import net.n2oapp.framework.boot.sql.SqlInvocationEngine;
import net.n2oapp.framework.boot.sql.rowmapper.PostgresIndexRowMapper;
import org.junit.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

public class N2oAutoConfigurationTest {

    @Test
    public void sql() {
        new ApplicationContextRunner()
                .withPropertyValues("spring.datasource.driver-class-name=org.h2.Driver",
                        "spring.datasource.url=jdbc:h2:mem:test",
                        "spring.datasource.username=sa",
                        "spring.datasource.password=sa")
//                .withClassLoader(new FilteredClassLoader(JdbcTemplate.class))
                .withConfiguration(AutoConfigurations.of(
                        DataSourceAutoConfiguration.class,
                        JdbcTemplateAutoConfiguration.class,
                        N2oSqlAutoConfiguration.class)).run(ctx -> {
            assertThat(ctx).hasSingleBean(SqlInvocationEngine.class);
            assertThat(ctx).hasSingleBean(SqlDataProviderEngine.class);
            assertThat(ctx).hasSingleBean(PostgresIndexRowMapper.class);
        });
    }
}
