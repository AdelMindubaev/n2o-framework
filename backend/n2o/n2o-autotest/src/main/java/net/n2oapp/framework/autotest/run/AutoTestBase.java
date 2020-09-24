package net.n2oapp.framework.autotest.run;

import com.codeborne.selenide.logevents.SelenideLogger;
import io.qameta.allure.selenide.AllureSelenide;
import net.n2oapp.framework.autotest.N2oSelenide;
import net.n2oapp.framework.autotest.api.component.page.Page;
import net.n2oapp.framework.config.test.N2oTestBase;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Map;

import static com.codeborne.selenide.Configuration.headless;

/**
 * Базовый класс для автотестов
 */
@SpringBootTest(classes = AutoTestApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
public class AutoTestBase extends N2oTestBase {
    @LocalServerPort
    protected int port;

    private N2oController n2oController;

    public static void configureSelenide() {
        SelenideLogger.addListener("AllureSelenide", new AllureSelenide());
        System.setProperty("chromeoptions.args", "--no-sandbox,--verbose,--whitelisted-ips=''");
        headless = false;
    }

    @Override
    public void setUp() throws Exception {
        super.setUp();
        n2oController.setUp(builder);
    }

    protected String getBaseUrl() {
        return "http://localhost:" + port;
    }

    protected <T extends Page> T open(Class<T> clazz) {
        return N2oSelenide.open(getBaseUrl(), clazz);
    }

    protected void setUserInfo(Map<String, Object> user) {
        n2oController.addConfigProperty("user", user);
    }

    @Autowired
    public void setN2oController(N2oController n2oController) {
        this.n2oController = n2oController;
    }
}
