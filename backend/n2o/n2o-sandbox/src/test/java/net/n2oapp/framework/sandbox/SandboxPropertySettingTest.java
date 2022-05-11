package net.n2oapp.framework.sandbox;

import com.github.tomakehurst.wiremock.WireMockServer;
import lombok.SneakyThrows;
import net.n2oapp.framework.api.metadata.meta.page.Page;
import net.n2oapp.framework.api.metadata.meta.page.SimplePage;
import net.n2oapp.framework.sandbox.client.SandboxRestClientImpl;
import net.n2oapp.framework.sandbox.resource.XsdSchemaParser;
import net.n2oapp.framework.sandbox.view.SandboxContext;
import net.n2oapp.framework.sandbox.view.SandboxPropertyResolver;
import net.n2oapp.framework.sandbox.view.ViewController;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.util.StreamUtils;

import java.nio.charset.Charset;
import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Тест на проверку установки свойств
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {ViewController.class, SandboxPropertyResolver.class, SandboxRestClientImpl.class,
                SandboxContext.class, XsdSchemaParser.class})
@PropertySource("classpath:test.properties")
@EnableAutoConfiguration
public class SandboxPropertySettingTest {

    private static final MockHttpServletRequest request = new MockHttpServletRequest();
    private static final WireMockServer wireMockServer = new WireMockServer();

    @Autowired
    private ViewController viewController;

    @BeforeAll
    static void setUp() {
        request.setRequestURI("/sandbox/view/myProjectId/n2o/page/");
        wireMockServer.start();
    }

    @AfterAll
    static void tearDown() {
        wireMockServer.stop();
    }

    @SneakyThrows
    @Test
    public void testApplicationProperties() {
        stubFor(get(urlMatching("/sandbox/api/project/myProjectId/application.properties")).willReturn(aResponse().withBody("n2o.api.header.src=CustomHeader\n" +
                "n2o.api.footer.src=CustomFooter\n" +
                "n2o.api.page.simple.src=CustomPage\n" +
                "n2o.api.widget.form.src=CustomForm")));
        stubFor(get(urlMatching("/sandbox/api/project/myProjectId/user.properties")).willReturn(aResponse()));

        JSONObject config = new JSONObject(viewController.getConfig("myProjectId", null));
        assertThat(config.getJSONObject("menu").getJSONObject("header").getString("src"), is("CustomHeader"));
        assertThat(config.getJSONObject("menu").getJSONObject("footer").getString("src"), is("CustomFooter"));

        Page page = viewController.getPage("myProjectId", request, null);
        assertThat(page.getSrc(), is("CustomPage"));
        assertThat(((SimplePage) page).getWidget().getSrc(), is("CustomForm"));
    }

    @SneakyThrows
    @Test
    public void testUserProperties() {
        stubFor(get(urlMatching("/sandbox/api/project/myProjectId")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody(
                StreamUtils.copyToString(new ClassPathResource("data/testPropertySetting.json").getInputStream(), Charset.defaultCharset()))));
        stubFor(get(urlMatching("/sandbox/api/project/myProjectId/application.properties")).willReturn(aResponse()));
        stubFor(get(urlMatching("/sandbox/api/project/myProjectId/user.properties")).willReturn(aResponse().withBody("email=test@example.com\n" +
                "username=Joe\n" +
                "roles=[USER,ADMIN]")));

        JSONObject config = new JSONObject(viewController.getConfig("myProjectId", null));
        assertThat(config.getJSONObject("user").getString("email"), is("test@example.com"));
        assertThat(config.getJSONObject("user").getString("name"), is("null"));
        assertThat(config.getJSONObject("user").getString("permissions"), is("null"));
        assertThat(config.getJSONObject("user").getJSONArray("roles").get(0), is("USER"));
        assertThat(config.getJSONObject("user").getJSONArray("roles").get(1), is("ADMIN"));
        assertThat(config.getJSONObject("user").getString("surname"), is("null"));
        assertThat(config.getJSONObject("user").getString("username"), is("Joe"));

        Page page = viewController.getPage("myProjectId", request, null);
        assertThat(page.getModels().get("resolve['main'].email").getValue(), is("test@example.com"));
        assertThat(((List) page.getModels().get("resolve['main'].roles").getValue()).get(0), is("USER"));
        assertThat(((List) page.getModels().get("resolve['main'].roles").getValue()).get(1), is("ADMIN"));
    }
}
