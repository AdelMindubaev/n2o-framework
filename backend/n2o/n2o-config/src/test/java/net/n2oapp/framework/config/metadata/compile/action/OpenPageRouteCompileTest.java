package net.n2oapp.framework.config.metadata.compile.action;

import net.n2oapp.framework.api.metadata.local.CompiledQuery;
import net.n2oapp.framework.api.metadata.meta.action.link.LinkActionImpl;
import net.n2oapp.framework.api.metadata.meta.page.Page;
import net.n2oapp.framework.api.metadata.meta.page.StandardPage;
import net.n2oapp.framework.api.metadata.meta.widget.Widget;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.compile.context.QueryContext;
import net.n2oapp.framework.config.metadata.pack.N2oAllDataPack;
import net.n2oapp.framework.config.metadata.pack.N2oAllPagesPack;
import net.n2oapp.framework.config.selective.CompileInfo;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

/**
 * Тест формирования маршрутов при открытии страницы
 */
public class OpenPageRouteCompileTest extends SourceCompileTestBase {

    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oAllPagesPack(), new N2oAllDataPack());
        builder.sources(new CompileInfo("net/n2oapp/framework/config/metadata/compile/action/route/testOpenPageRoute.query.xml"),
                new CompileInfo("net/n2oapp/framework/config/metadata/compile/action/route/testOpenPageRoute.page.xml"));
    }

    /**
     * Тест фильтрации master/detail при открытии страницы при наличии параметра в пути маршрута.
     * Фильтр должен попасть в pathMapping
     */
    @Test
    public void masterDetailWithPathParam() {
        StandardPage page = (StandardPage) compile("net/n2oapp/framework/config/metadata/compile/action/route/testOpenPageRouteMasterDetail.page.xml")
                .get(new PageContext("testOpenPageRouteMasterDetail", "/test"));

        LinkActionImpl action = (LinkActionImpl) ((Widget) page.getRegions().get("single").get(0).getContent().get(1))
                .getActions().get("withParam");
        assertThat(action.getUrl(), is("/test/master/:masterId/detail/:detailId/open1"));
        assertThat(action.getPathMapping().get("detailId"), notNullValue());
        assertThat(action.getQueryMapping().isEmpty(), is(true));

    }

    /**
     * Тест фильтрации master/detail при открытии страницы при отсутствии параметра в пути маршрута.
     * Фильтр должен попасть в queryMapping
     */
    @Test
    public void masterDetailWithoutPathParam() {
        StandardPage page = (StandardPage) compile("net/n2oapp/framework/config/metadata/compile/action/route/testOpenPageRouteMasterDetail.page.xml")
                .get(new PageContext("testOpenPageRouteMasterDetail", "/test"));

        LinkActionImpl action = (LinkActionImpl) ((Widget) page.getRegions().get("single").get(0).getContent().get(1))
                .getActions().get("withoutParam");
        assertThat(action.getUrl(), is("/test/master/:masterId/detail/open2"));
        assertThat(action.getQueryMapping().get("test_detail_detailId"), notNullValue());
    }

    /**
     * Тест открытия страницы при наличии параметра в пути маршрута и отсутствии master/detail фильтрации.
     * Параметр должен быть, фильтра не должно быть.
     */
    @Test
    public void masterDetailWithPathParamWithoutMasterDetail() {
        StandardPage page = (StandardPage) compile("net/n2oapp/framework/config/metadata/compile/action/route/testOpenPageRouteMasterDetail.page.xml")
                .get(new PageContext("testOpenPageRouteMasterDetail", "/test"));

        LinkActionImpl action = (LinkActionImpl) ((Widget) page.getRegions().get("single").get(0).getContent().get(1))
                .getActions().get("withParamWithoutMasterDetail");
        assertThat(action.getUrl(), is("/test/master/:masterId/detail/:detailId/open3"));
        assertThat(action.getPathMapping().get("detailId"), notNullValue());
        assertThat(action.getQueryMapping().isEmpty(), is(true));
        routeAndGet("/test/master/1/detail/2/open3", Page.class);
        QueryContext queryContext = (QueryContext) route("/test/master/1/detail/2/open3/main", CompiledQuery.class);
        assertThat(queryContext.getFilters().isEmpty(), is(true));
    }
}
