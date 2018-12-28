package net.n2oapp.framework.config.metadata.compile.menu;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.aware.SourceClassAware;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.page.N2oPage;
import net.n2oapp.framework.api.metadata.header.HeaderItem;
import net.n2oapp.framework.api.metadata.header.SimpleMenu;
import net.n2oapp.framework.api.metadata.menu.N2oSimpleMenu;
import net.n2oapp.framework.config.metadata.compile.BaseSourceCompiler;
import net.n2oapp.framework.config.metadata.compile.IndexScope;
import net.n2oapp.framework.config.metadata.compile.context.HeaderContext;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import org.springframework.stereotype.Component;

@Component
public class SimpleMenuCompiler implements BaseSourceCompiler<SimpleMenu, N2oSimpleMenu, HeaderContext>, SourceClassAware {

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oSimpleMenu.class;
    }

    @Override
    public SimpleMenu compile(N2oSimpleMenu source, HeaderContext context, CompileProcessor p) {
        SimpleMenu items = new SimpleMenu();
        IndexScope idx = p.getScope(IndexScope.class) != null ? p.getScope(IndexScope.class) : new IndexScope();
        if (source != null) {
            if (source.getMenuItems() != null) {
                for (N2oSimpleMenu.MenuItem mi : source.getMenuItems()) {
                    items.add(createMenuItem(mi, idx, p));
                }
            }
        }
        return items;
    }

    private HeaderItem createMenuItem(N2oSimpleMenu.MenuItem mi, IndexScope idx, CompileProcessor p) {
        HeaderItem item = new HeaderItem();
        item.setPageId(mi.getPageId());
        item.setId("menuItem" + idx.get());
        item.setLabel(mi.getLabel());
        item.setIcon(mi.getIcon());
        item.setLinkType(
                mi instanceof N2oSimpleMenu.AnchorItem ? HeaderItem.LinkType.outer : HeaderItem.LinkType.inner
        );
        if (mi.getSubMenu() == null || mi.getSubMenu().length == 0) {
            if (mi.getPageId() == null) {
                item.setHref(mi.getHref());
            } else {
                N2oPage page = p.getSource(mi.getPageId(), N2oPage.class);
                if (item.getLabel() == null) {
                    item.setLabel(page.getName() == null ? page.getId() : page.getName());
                }
                if (mi.getRoute() == null) {
                    item.setHref(page.getRoute() == null ? "/" + mi.getPageId() : page.getRoute());
                } else {
                    item.setHref(mi.getRoute());
                }
                PageContext pageContext = new PageContext(mi.getPageId(), item.getHref());
                p.addRoute(item.getHref(), pageContext);
            }
            item.setType("link");
        } else {
            SimpleMenu subItems = new SimpleMenu();
            for (N2oSimpleMenu.MenuItem subMenu : mi.getSubMenu()) {
                subItems.add(createMenuItem(subMenu, idx, p));
            }
            item.setSubItems(subItems);
            item.setHref(item.getSubItems().get(0).getHref());
            item.setType("dropdown");
        }
        item.setProperties(p.mapAttributes(mi));
        return item;
    }
}
