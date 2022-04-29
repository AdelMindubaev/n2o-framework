package net.n2oapp.framework.config.metadata.compile.widget;

import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.page.N2oDatasource;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oHtmlWidget;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.meta.widget.HtmlWidget;
import net.n2oapp.framework.config.metadata.compile.page.PageScope;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.config.util.FileSystemUtil.getContentByUri;

/**
 * Компиляция html виджета
 */
@Component
public class HtmlWidgetCompiler extends BaseWidgetCompiler<HtmlWidget, N2oHtmlWidget> {

    @Override
    public HtmlWidget compile(N2oHtmlWidget source, CompileContext<?, ?> context, CompileProcessor p) {
        HtmlWidget widget = new HtmlWidget();
        N2oDatasource datasource = initInlineDatasource(widget, source, p);
        CompiledObject object = getObject(source, datasource, p);
        compileBaseWidget(widget, source, context, p, object);
        WidgetScope widgetScope = new WidgetScope(source.getId(), source.getDatasourceId(), ReduxModel.resolve, p.getScope(PageScope.class));
        MetaActions widgetActions = initMetaActions(source, p);
        if (source.getHtml() != null)
            widget.setHtml(p.resolveJS(source.getHtml().trim()));
        else if (source.getUrl() != null)
            widget.setHtml(p.resolveJS(getContentByUri(source.getUrl())));
        compileToolbarAndAction(widget, source, context, p, widgetScope, widgetActions, object, null);
        return widget;
    }

    @Override
    protected String getPropertyWidgetSrc() {
        return "n2o.api.widget.html.src";
    }

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oHtmlWidget.class;
    }
}
