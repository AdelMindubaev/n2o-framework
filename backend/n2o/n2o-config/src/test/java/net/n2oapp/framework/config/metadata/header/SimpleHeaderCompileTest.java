package net.n2oapp.framework.config.metadata.header;

import net.n2oapp.framework.api.metadata.global.view.action.control.Target;
import net.n2oapp.framework.api.metadata.header.CompiledHeader;
import net.n2oapp.framework.api.metadata.header.HeaderItem;
import net.n2oapp.framework.api.metadata.header.SimpleMenu;
import net.n2oapp.framework.api.metadata.header.SearchBar;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.context.HeaderContext;
import net.n2oapp.framework.config.metadata.pack.N2oHeaderPack;
import net.n2oapp.framework.config.metadata.pack.N2oPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oRegionsPack;
import net.n2oapp.framework.config.metadata.pack.N2oQueriesPack;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.notNullValue;

/**
 * Тестирование компиляции простого хедера
 */
public class SimpleHeaderCompileTest extends SourceCompileTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        builder.getEnvironment().getContextProcessor().set("username", "test");
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oRegionsPack(), new N2oHeaderPack(), new N2oQueriesPack());
    }

    @Test
    public void inlineMenu() {
        CompiledHeader header = (CompiledHeader) compile("net/n2oapp/framework/config/metadata/menu/pageWithoutLabel.page.xml",
                "net/n2oapp/framework/config/metadata/header/testPage.page.xml",
                "net/n2oapp/framework/config/metadata/header/headerWithMenu.header.xml")
                .get(new HeaderContext("headerWithMenu"));

        assertThat(header.getBrand(), is("N2O"));
        assertThat(header.getSrc(), is("test"));
        assertThat(header.getClassName(), is("class"));
        assertThat(header.getHomePageUrl(), is("/pageRoute"));
        assertThat(header.getStyle().size(), is(1));
        assertThat(header.getStyle().get("marginLeft"),is("10px"));

        assertThat(header.getItems().size(), is(3));
        SimpleMenu headerItems = header.getItems();
        // sub-menu
        assertThat(headerItems.get(0).getLabel(), is("test"));
        assertThat(headerItems.get(0).getHref(), is("/page1"));
        assertThat(headerItems.get(0).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(headerItems.get(0).getSubItems().size(), is(3));
        assertThat(headerItems.get(0).getType(), is("dropdown"));
        // page
        assertThat(headerItems.get(1).getLabel(), is("headerLabel"));
        assertThat(headerItems.get(1).getHref(), is("/pageWithoutLabel"));
        assertThat(headerItems.get(1).getPageId(), is("pageWithoutLabel"));
        assertThat(headerItems.get(1).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(headerItems.get(1).getSubItems(), nullValue());
        assertThat(headerItems.get(1).getType(), is("link"));
        // a
        assertThat(headerItems.get(2).getLabel(), is("hrefLabel"));
        assertThat(headerItems.get(2).getHref(), is("http://test.com"));
        assertThat(headerItems.get(2).getLinkType(), is(HeaderItem.LinkType.outer));
        assertThat(headerItems.get(2).getSubItems(), nullValue());
        assertThat(headerItems.get(2).getType(), is("link"));

        SimpleMenu subItems = headerItems.get(0).getSubItems();
        // sub-menu page
        assertThat(subItems.get(0).getLabel(), is("test2"));
        assertThat(subItems.get(0).getHref(), is("/page1"));
        assertThat(subItems.get(0).getPageId(), is("pageWithoutLabel"));
        assertThat(subItems.get(0).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(subItems.get(0).getSubItems(), nullValue());
        assertThat(subItems.get(0).getType(), is("link"));
        assertThat(subItems.get(0).getProperties().size(), is(1));
        assertThat(subItems.get(0).getProperties().get("testAttr"), is("testAttribute"));
        // sub-menu a
        assertThat(subItems.get(1).getLabel(), is("hrefLabel"));
        assertThat(subItems.get(1).getHref(), is("http://test.com"));
        assertThat(subItems.get(1).getLinkType(), is(HeaderItem.LinkType.outer));
        assertThat(subItems.get(1).getSubItems(), nullValue());
        assertThat(subItems.get(1).getType(), is("link"));
        // sub-menu sub-menu
        assertThat(subItems.get(2).getLabel(), is("sub1"));
        assertThat(subItems.get(2).getHref(), is("/pageWithoutLabel"));
        assertThat(subItems.get(2).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(subItems.get(2).getSubItems().size(), is(1));
        assertThat(subItems.get(2).getType(), is("dropdown"));
        // sub-menu sub-menu page
        assertThat(subItems.get(2).getSubItems().get(0).getLabel(), is("test2"));
        assertThat(subItems.get(2).getSubItems().get(0).getPageId(), is("pageWithoutLabel"));
        assertThat(subItems.get(2).getSubItems().get(0).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(subItems.get(2).getSubItems().get(0).getType(), is("link"));

        assertThat(header.getExtraItems().size(), is(1));
        HeaderItem extraItem = header.getExtraItems().get(0);
        // sub-menu
        assertThat(extraItem.getLabel(), is("#{username}"));
        assertThat(extraItem.getHref(), is("https://ya.ru/"));
        assertThat(extraItem.getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(extraItem.getSubItems().size(), is(2));
        assertThat(extraItem.getType(), is("dropdown"));
        subItems = extraItem.getSubItems();
        // sub-menu a
        assertThat(subItems.get(0).getLabel(), is("Test"));
        assertThat(subItems.get(0).getHref(), is("https://ya.ru/"));
        assertThat(subItems.get(0).getLinkType(), is(HeaderItem.LinkType.outer));
        assertThat(subItems.get(0).getIcon(), is("test-icon"));
        assertThat(subItems.get(0).getTarget(), is(Target.newWindow));
        assertThat(subItems.get(0).getSubItems(), nullValue());
        assertThat(subItems.get(0).getType(), is("link"));
        // sub-menu sub-menu
        assertThat(subItems.get(1).getLabel(), is("sub2"));
        assertThat(subItems.get(1).getHref(), is("/pageWithoutLabel"));
        assertThat(subItems.get(1).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(subItems.get(1).getSubItems().size(), is(1));
        assertThat(subItems.get(1).getType(), is("dropdown"));
        // sub-menu sub-menu page
        assertThat(subItems.get(1).getSubItems().get(0).getLabel(), is("test2"));
        assertThat(subItems.get(1).getSubItems().get(0).getPageId(), is("pageWithoutLabel"));
        assertThat(subItems.get(1).getSubItems().get(0).getLinkType(), is(HeaderItem.LinkType.inner));
        assertThat(subItems.get(1).getSubItems().get(0).getType(), is("link"));
    }

    @Test
    public void externalMenu() {
        CompiledHeader header = (CompiledHeader) compile("net/n2oapp/framework/config/metadata/menu/pageWithoutLabel.page.xml",
                "net/n2oapp/framework/config/metadata/header/headerWithExternalMenu.header.xml",
                "net/n2oapp/framework/config/metadata/header/testPage.page.xml",
                "net/n2oapp/framework/config/metadata/header/testMenu.menu.xml")
                .get(new HeaderContext("headerWithExternalMenu"));

        assertThat(header.getHomePageUrl(), is("http://google.com/"));
        assertThat(header.getItems().size(), is(3));
        assertThat(header.getItems().get(0).getSubItems().size(), is(2));
        assertThat(header.getItems().get(0).getSubItems().get(0).getLabel(), is("test2"));
        assertThat(header.getItems().get(0).getSubItems().get(0).getProperties().get("testAttr"), is("testAttribute"));
        assertThat(header.getItems().get(0).getSubItems().get(0).getJsonProperties().get("testAttr"), is("testAttribute"));
        assertThat(header.getItems().get(1).getLabel(), is("headerLabel"));
    }

    @Test
    public void testBind() {
        CompiledHeader header = (CompiledHeader) compile("net/n2oapp/framework/config/metadata/menu/pageWithoutLabel.page.xml",
                "net/n2oapp/framework/config/metadata/header/testPage.page.xml",
                "net/n2oapp/framework/config/metadata/header/headerWithMenu.header.xml")
                .bind().get(new HeaderContext("headerWithMenu"), null);

        assertThat(header.getExtraItems().get(0).getLabel(), is("test"));
    }

    @Test
    public void searchBarTest() {
        CompiledHeader header = (CompiledHeader) compile("net/n2oapp/framework/config/metadata/menu/pageWithoutLabel.page.xml",
                "net/n2oapp/framework/config/metadata/header/testPage.page.xml",
                "net/n2oapp/framework/config/metadata/header/headerWithSearch.header.xml",
                "net/n2oapp/framework/config/metadata/header/search.query.xml")
                .bind().get(new HeaderContext("headerWithSearch"), null);
        SearchBar searchBar = header.getSearch();
        assertThat(searchBar, notNullValue());
        assertThat("urlId", is(searchBar.getUrlFieldId()));
        assertThat("labelId", is(searchBar.getLabelFieldId()));
        assertThat("iconId", is(searchBar.getIconFieldId()));
        assertThat("descriptionId", is(searchBar.getDescrFieldId()));

        assertThat(searchBar.getSearchPageLocation(), notNullValue());
        assertThat("advancedUrl", is(searchBar.getSearchPageLocation().getUrl()));
        assertThat("param", is(searchBar.getSearchPageLocation().getSearchQueryName()));
        assertThat(SearchBar.LinkType.inner, is(searchBar.getSearchPageLocation().getLinkType()));

        assertThat(searchBar.getDataProvider(), notNullValue());
        assertThat("n2o/data/search", is(searchBar.getDataProvider().getUrl()));
        assertThat("filterId", is(searchBar.getDataProvider().getQuickSearchParam()));
    }
}
