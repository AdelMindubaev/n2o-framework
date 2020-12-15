package net.n2oapp.framework.config.metadata.compile.header;

import net.n2oapp.framework.api.metadata.aware.SourceClassAware;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.header.CompiledHeader;
import net.n2oapp.framework.api.metadata.header.N2oSimpleHeader;
import net.n2oapp.framework.api.metadata.header.SimpleMenu;
import net.n2oapp.framework.config.metadata.compile.BaseSourceCompiler;
import net.n2oapp.framework.config.metadata.compile.context.HeaderContext;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.util.StylesResolver;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция простого хедера
 */
@Component
public class SimpleHeaderCompiler implements BaseSourceCompiler<CompiledHeader, N2oSimpleHeader, HeaderContext>, SourceClassAware {

    @Override
    public CompiledHeader compile(N2oSimpleHeader source, HeaderContext context, CompileProcessor p) {
        CompiledHeader header = new CompiledHeader();
        header.setSrc(source.getSrc());
        header.setBrand(p.cast(source.getProjectName(),
                p.resolve(property("n2o.header.title"), String.class), "N<sub>2</sub>O"));
        header.setBrandImage(source.getProjectImageSrc());
        header.setColor(p.cast(source.getColor(), "default"));
        header.setFixed(p.resolve(property("n2o.header.fixed"), Boolean.class));
        header.setCollapsed(p.resolve(property("n2o.header.collapsed"), Boolean.class));
        header.setClassName(source.getCssClass());
        header.setStyle(StylesResolver.resolveStyles(source.getStyle()));
        initWelcomePage(source, p);
        header.setHomePageUrl(source.getHomePageUrl());
        header.setItems(source.getMenu() != null ? p.compile(source.getMenu(), context) : new SimpleMenu());
        header.setExtraItems(source.getExtraMenu() != null ? p.compile(source.getExtraMenu(), context) : new SimpleMenu());
        header.setSearch(source.getSearchBar() != null ? p.compile(source.getSearchBar(), context) : null);
        return header;
    }

    private void initWelcomePage(N2oSimpleHeader source, CompileProcessor p) {
        String welcomePageId;
        if (source.getMenu() != null && source.getWelcomePageId() != null)
            welcomePageId = source.getWelcomePageId();
        else
            welcomePageId = p.resolve(property("n2o.header.homepage.id"), String.class);

        PageContext context = new PageContext(welcomePageId, "/");
        p.addRoute(context);
    }

    @Override
    public Class<N2oSimpleHeader> getSourceClass() {
        return N2oSimpleHeader.class;
    }
}
