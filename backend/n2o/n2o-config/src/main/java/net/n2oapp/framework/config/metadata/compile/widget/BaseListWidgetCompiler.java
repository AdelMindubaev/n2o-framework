package net.n2oapp.framework.config.metadata.compile.widget;

import net.n2oapp.framework.api.StringUtils;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oAbstractListWidget;
import net.n2oapp.framework.api.metadata.global.view.widget.table.N2oRowClick;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.meta.action.Action;
import net.n2oapp.framework.api.metadata.meta.widget.Widget;
import net.n2oapp.framework.api.metadata.meta.widget.table.Pagination;
import net.n2oapp.framework.api.metadata.meta.widget.table.RowClick;
import net.n2oapp.framework.api.script.ScriptProcessor;
import net.n2oapp.framework.config.metadata.compile.ComponentScope;
import net.n2oapp.framework.config.metadata.compile.ParentRouteScope;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция абстрактного спискового виджета
 */
public abstract class BaseListWidgetCompiler<D extends Widget, S extends N2oAbstractListWidget> extends BaseWidgetCompiler<D, S> {

    /**
     * Компиляция паджинации
     */
    protected Pagination compilePaging(N2oAbstractListWidget source, Integer size, CompileProcessor p) {
        Pagination pagination = new Pagination();
        pagination.setSize(source.getSize() != null ? source.getSize() : size);
        if (source.getPagination() != null) {
            pagination.setPrev(p.cast(source.getPagination().getPrev(), p.resolve(property("n2o.api.widget.list.paging.prev"), Boolean.class)));
            pagination.setNext(p.cast(source.getPagination().getNext(), p.resolve(property("n2o.api.widget.list.paging.next"), Boolean.class)));
            pagination.setFirst(p.cast(source.getPagination().getFirst(), p.resolve(property("n2o.api.widget.list.paging.first"), Boolean.class)));
            pagination.setLast(p.cast(source.getPagination().getLast(), p.resolve(property("n2o.api.widget.list.paging.last"), Boolean.class)));
            pagination.setHideSinglePage(p.cast(source.getPagination().getHideSinglePage(), p.resolve(property("n2o.api.widget.list.paging.hide_single_page"), Boolean.class)));
            pagination.setShowCountRecords(p.cast(source.getPagination().getShowCount(), p.resolve(property("n2o.api.widget.list.paging.show_count"), Boolean.class)));
            pagination.setSrc(source.getPagination().getSrc());
        }
        return pagination;
    }


    /**
     * Компиляция действия клика по строке
     */
    protected RowClick compileRowClick(N2oAbstractListWidget source, CompileContext<?, ?> context,
                                       CompileProcessor p, WidgetScope widgetScope,
                                       ParentRouteScope widgetRouteScope, CompiledObject object, MetaActions widgetActions) {
        RowClick rc = null;
        if (source.getRows() != null && source.getRows().getRowClick() != null) {
            N2oRowClick rowClick = source.getRows().getRowClick();
            Object enabledCondition = ScriptProcessor.resolveExpression(rowClick.getEnabled());
            if (enabledCondition == null || enabledCondition instanceof String || Boolean.TRUE.equals(enabledCondition)) {
                Action action = null;
                if (rowClick.getActionId() != null) {
                    action = widgetActions.get(rowClick.getActionId());
                } else if (rowClick.getAction() != null) {
                    action = p.compile(rowClick.getAction(), context, widgetScope,
                            widgetRouteScope, new ComponentScope(rowClick), object);
                }
                rc = new RowClick(action);
                if (action != null && StringUtils.isJs(enabledCondition)) {
                    rc.setEnablingCondition((String) ScriptProcessor.removeJsBraces(enabledCondition));
                }
            }
        }
        return rc;
    }
}
