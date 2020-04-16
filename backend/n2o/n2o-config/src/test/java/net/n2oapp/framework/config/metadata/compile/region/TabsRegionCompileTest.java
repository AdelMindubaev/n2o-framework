package net.n2oapp.framework.config.metadata.compile.region;

import net.n2oapp.framework.api.metadata.meta.action.SetActiveRegionEntityPayload;
import net.n2oapp.framework.api.metadata.meta.page.PageRoutes;
import net.n2oapp.framework.api.metadata.meta.page.StandardPage;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.pack.N2oPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oRegionsPack;
import net.n2oapp.framework.config.metadata.pack.N2oWidgetsPack;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class TabsRegionCompileTest extends SourceCompileTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oRegionsPack(), new N2oWidgetsPack());
    }

    @Test
    public void testTabsRegionRoute() {
        StandardPage page = (StandardPage) compile("net/n2oapp/framework/config/metadata/compile/region/testTabsRegion.page.xml")
                .get(new PageContext("testTabsRegion"));

        Map<String, PageRoutes.Query> queryMapping = page.getRoutes().getQueryMapping();
        assertThat(queryMapping.containsKey("tab_0"), is(true));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("tab_0").getOnGet().getPayload()).getRegionId(), is("tab_0"));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("tab_0").getOnGet().getPayload()).getActiveRegionParam(), is(":tab_0"));
        assertThat(queryMapping.get("tab_0").getOnSet().getBindLink(), is("regions.tab_0.activeEntity"));
        assertThat(queryMapping.containsKey("param1"), is(true));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("param1").getOnGet().getPayload()).getRegionId(), is("left_tab_1"));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("param1").getOnGet().getPayload()).getActiveRegionParam(), is(":param1"));
        assertThat(queryMapping.get("param1").getOnSet().getBindLink(), is("regions.left_tab_1.activeEntity"));
        assertThat(queryMapping.containsKey("param2"), is(true));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("param2").getOnGet().getPayload()).getRegionId(), is("tabId"));
        assertThat(((SetActiveRegionEntityPayload)queryMapping.get("param2").getOnGet().getPayload()).getActiveRegionParam(), is(":param2"));
        assertThat(queryMapping.get("param2").getOnSet().getBindLink(), is("regions.tabId.activeEntity"));
    }
}
