package net.n2oapp.framework.config.metadata.compile.widget;

import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.compile.BindProcessor;
import net.n2oapp.framework.api.metadata.meta.BindLink;
import net.n2oapp.framework.api.metadata.meta.Filter;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import net.n2oapp.framework.api.metadata.meta.action.Action;
import net.n2oapp.framework.api.metadata.meta.widget.Widget;
import net.n2oapp.framework.api.metadata.meta.widget.toolbar.Group;
import net.n2oapp.framework.config.metadata.compile.BaseMetadataBinder;
import net.n2oapp.framework.config.util.BindUtil;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Базовое связывание виджета с данными
 */
@Component
public class WidgetBinder implements BaseMetadataBinder<Widget> {
    @Override
    public Widget bind(Widget widget, BindProcessor p) {
        if (widget.getActions() != null)
            ((Map<String, Action>) widget.getActions()).values().forEach(p::bind);
        if (widget.getToolbar() != null) {
            for (List<Group> grp : widget.getToolbar().values()) {
                grp.forEach(g -> {if (g.getButtons() != null) g.getButtons().forEach(p::bind);});
            }
        }
        BindUtil.bindDataProvider(widget.getDataProvider(), p);
        if (widget.getFilters() != null) {
            ((List<Filter>) widget.getFilters()).forEach(f -> f.setLink((ModelLink) p.resolveLink(f.getLink())));
        }
        return widget;
    }

    @Override
    public Class<? extends Compiled> getCompiledClass() {
        return Widget.class;
    }
}
