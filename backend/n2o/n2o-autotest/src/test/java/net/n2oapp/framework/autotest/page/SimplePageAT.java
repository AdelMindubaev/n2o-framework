package net.n2oapp.framework.autotest.page;

import net.n2oapp.framework.autotest.Colors;
import net.n2oapp.framework.autotest.api.component.button.StandardButton;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.impl.component.widget.N2oStandardWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.N2oAllPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oHeaderPack;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SimplePageAT extends AutoTestBase {
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
        builder.packs(new N2oAllPagesPack(), new N2oHeaderPack());
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/page/simplePage/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/simple/test.header.xml"));
    }

    @Test
    public void testSimplePage() {
        SimplePage page = open(SimplePage.class);
        page.breadcrumb().titleShouldHaveText("Простая страница");
        page.shouldExists();
        StandardButton button = page.widget(N2oStandardWidget.class).toolbar().topLeft().button("Вперед");
        button.shouldBeDisabled();

        button = page.widget(N2oStandardWidget.class).toolbar().topLeft().button("Кнопка с иконкой");
        button.shouldHaveIcon("fa-plus");

        button = page.widget(N2oStandardWidget.class).toolbar().topLeft().button("Опасная");
        button.shouldHaveColor(Colors.DANGER);
    }
}
