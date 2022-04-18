package net.n2oapp.framework.autotest.control;

import net.n2oapp.framework.autotest.api.component.control.Html;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.api.component.widget.FormWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openjdk.nashorn.internal.ir.annotations.Ignore;

import java.util.HashMap;
import java.util.Map;

/**
 * Автотест для компонента ввода html
 */
public class HtmlAT extends AutoTestBase {

    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oApplicationPack(), new N2oWidgetsPack(), new N2oFieldSetsPack(), new N2oControlsPack());
    }

    //TODO: Пофиксить после изменений на фронте
    @Test
    @Ignore
    public void testHtml() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/html/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/blank.application.xml"));

        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        Html html = page.widget(FormWidget.class).fields().field("Html")
                .control(Html.class);
        html.shouldExists();

        Map<String, String> attributes = new HashMap<>();
        attributes.put("style", "margin: 10px;");
        html.shouldHaveElementWithAttributes("h3.class1", attributes);
    }
}
