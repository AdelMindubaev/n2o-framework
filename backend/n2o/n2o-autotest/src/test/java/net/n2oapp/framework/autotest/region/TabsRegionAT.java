package net.n2oapp.framework.autotest.region;

import net.n2oapp.framework.autotest.api.component.page.StandardPage;
import net.n2oapp.framework.autotest.api.component.region.*;
import net.n2oapp.framework.autotest.api.component.widget.FormWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.N2oAllPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oHeaderPack;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Автотест для региона в виде вкладок
 */
public class TabsRegionAT extends AutoTestBase {
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
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"));
    }

    @Test
    public void testTabsRegion() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/region/tabs/index.page.xml"));
        StandardPage page = open(StandardPage.class);
        page.shouldExists();

        TabsRegion tabs = page.regions().region(0, TabsRegion.class);
        tabs.shouldHaveSize(3);
        tabs.tab(0).shouldBeActive();
        tabs.tab(1).shouldNotBeActive();
        tabs.tab(2).shouldNotBeActive();
        tabs.tab(0).shouldHaveName("Tab1");
        tabs.tab(1).shouldHaveName("Tab2");
        tabs.tab(2).shouldNotHaveTitle();

        tabs.tab(1).click();
        tabs.tab(0).shouldNotBeActive();
        tabs.tab(1).shouldBeActive();
        tabs.tab(2).shouldNotBeActive();

        tabs.tab(2).click();
        tabs.tab(0).shouldNotBeActive();
        tabs.tab(1).shouldNotBeActive();
        tabs.tab(2).shouldBeActive();

        TabsRegion tabs2 = page.regions().region(1, TabsRegion.class);
        // hiding single tab
        tabs2.shouldHaveSize(0);

        TabsRegion tabs3 = page.regions().region(2, TabsRegion.class);
        tabs3.shouldHaveSize(1);
        tabs3.tab(0).shouldHaveName("SingleTab");
        tabs3.tab(0).content().widget(FormWidget.class).shouldExists();
    }

    @Test
    public void testContent() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/region/tabs/nesting/index.page.xml"));
        StandardPage page = open(StandardPage.class);
        page.shouldExists();
        TabsRegion tabsRegion = page.regions().region(0, TabsRegion.class);
        RegionItems content = tabsRegion.tab(0).content();

        content.widget(0, FormWidget.class).fields().field("field1").shouldExists();

        SimpleRegion custom = content.region(1, SimpleRegion.class);
        custom.content().widget(FormWidget.class).fields().field("field2").shouldExists();

        PanelRegion panel = content.region(2, PanelRegion.class);
        panel.shouldExists();
        panel.shouldHaveTitle("Panel");

        LineRegion line = content.region(3, LineRegion.class);
        line.shouldExists();
        line.shouldHaveLabel("Line");

        TabsRegion tabs = content.region(4, TabsRegion.class);
        tabs.shouldExists();
        tabs.shouldHaveSize(2);
        tabs.tab(1).shouldHaveName("Tab2");

        content.widget(5, FormWidget.class).fields().field("field3").shouldExists();

        // testing collapse/expand state of nesting regions
        // after switch between tabs in global region
        panel.collapseContent();
        line.collapseContent();
        tabs.tab(1).click();

        tabsRegion.tab(1).click();
        tabsRegion.tab(1).shouldBeActive();
        tabsRegion.tab(0).click();

        panel.shouldBeCollapsed();
        line.shouldBeCollapsed();
        tabs.tab(1).shouldBeActive();
    }
}
