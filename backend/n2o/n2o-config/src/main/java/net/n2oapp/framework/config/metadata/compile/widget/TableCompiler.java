package net.n2oapp.framework.config.metadata.compile.widget;

import net.n2oapp.framework.api.StringUtils;
import net.n2oapp.framework.api.data.validation.Validation;
import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.SourceComponent;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.compile.building.Placeholders;
import net.n2oapp.framework.api.metadata.control.N2oSearchButtons;
import net.n2oapp.framework.api.metadata.event.action.UploadType;
import net.n2oapp.framework.api.metadata.global.dao.validation.N2oValidation;
import net.n2oapp.framework.api.metadata.global.view.widget.table.N2oTable;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.AbstractColumn;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.N2oFilterColumn;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.local.CompiledQuery;
import net.n2oapp.framework.api.metadata.local.util.StrictMap;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import net.n2oapp.framework.api.metadata.meta.Models;
import net.n2oapp.framework.api.metadata.meta.control.SearchButtons;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import net.n2oapp.framework.api.metadata.meta.control.ValidationType;
import net.n2oapp.framework.api.metadata.meta.fieldset.FieldSet;
import net.n2oapp.framework.api.metadata.meta.widget.Rows;
import net.n2oapp.framework.api.metadata.meta.widget.Widget;
import net.n2oapp.framework.api.metadata.meta.widget.table.*;
import net.n2oapp.framework.api.metadata.meta.widget.toolbar.Condition;
import net.n2oapp.framework.api.script.ScriptProcessor;
import net.n2oapp.framework.config.metadata.compile.*;
import net.n2oapp.framework.config.metadata.compile.context.QueryContext;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;
import static net.n2oapp.framework.api.script.ScriptProcessor.buildSwitchExpression;

/**
 * Компиляция таблицы
 */
@Component
public class TableCompiler extends BaseListWidgetCompiler<Table, N2oTable> {

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oTable.class;
    }

    @Override
    protected String getPropertyWidgetSrc() {
        return "n2o.api.widget.table.src";
    }

    @Override
    public Table compile(N2oTable source, CompileContext<?, ?> context, CompileProcessor p) {
        Table table = new Table();
        TableWidgetComponent component = table.getComponent();
        CompiledQuery query = getQuery(source, p);
        CompiledObject object = getObject(source, p);
        compileWidget(table, source, context, p, object);
        WidgetScope widgetScope = new WidgetScope();
        widgetScope.setClientWidgetId(table.getId());
        widgetScope.setWidgetId(source.getId());
        widgetScope.setQueryId(source.getQueryId());
        Models models = p.getScope(Models.class);
        SubModelsScope subModelsScope = new SubModelsScope();
        UploadScope uploadScope = new UploadScope();
        uploadScope.setUpload(UploadType.defaults);
        table.setFilter(createFilter(source, context, p, widgetScope, query, object,
                new ModelsScope(ReduxModel.FILTER, table.getId(), models), new FiltersScope(table.getFilters()), subModelsScope, uploadScope,
                new MomentScope(N2oValidation.ServerMoment.beforeQuery)));
        ValidationList validationList = p.getScope(ValidationList.class) == null ? new ValidationList(new EnumMap<>(ReduxModel.class)) : p.getScope(ValidationList.class);
        ValidationScope validationScope = new ValidationScope(table.getId(), ReduxModel.FILTER, validationList);
        //порядок вызова compileValidation и compileDataProviderAndRoutes важен
        compileValidation(table, source, validationScope);
        ParentRouteScope widgetRouteScope = initWidgetRouteScope(table, context, p);
        PageRoutesScope pageRoutesScope = p.getScope(PageRoutesScope.class);
        if (pageRoutesScope != null) {
            pageRoutesScope.put(table.getId(), widgetRouteScope);
        }
        compileDataProviderAndRoutes(table, source, context, p, validationList, widgetRouteScope, null, null, object);
        component.setSize(source.getSize() != null ? source.getSize() : p.resolve("${n2o.api.default.widget.table.size}", Integer.class));
        component.setClassName(source.getCssClass());
        component.setTableSize(source.getTableSize() != null ? source.getTableSize().name().toLowerCase() : null);
        if (source.getScrollX() != null || source.getScrollY() != null) {
            component.setScroll(new Scroll());
            component.getScroll().setX(source.getScrollX());
            component.getScroll().setY(source.getScrollY());
        }
        MetaActions widgetActions = new MetaActions();
        compileToolbarAndAction(table, source, context, p, widgetScope, widgetRouteScope, widgetActions, object, null);
        if (source.getRows() != null) {
            component.setRows(new Rows());
            if (source.getRows().getRowClass() != null) {
                component.setRowClass(p.resolveJS(source.getRows().getRowClass()));
            } else {
                if (source.getRows().getColor() != null) {
                    Map<Object, String> resolvedCases = new HashMap<>();
                    for (String key : source.getRows().getColor().getCases().keySet()) {
                        resolvedCases.put(p.resolve(key), source.getRows().getColor().getCases().get(key));
                    }
                    source.getRows().getColor().setResolvedCases(resolvedCases);
                    component.setRowClass(buildSwitchExpression(source.getRows().getColor()));
                }
            }
            component.setRowClick(compileRowClick(source, context, p, widgetScope, widgetRouteScope, object, widgetActions));
        }
        compileColumns(source, context, p, component, query, object, widgetScope, widgetRouteScope, widgetActions);
        table.setPaging(compilePaging(source, p.resolve(Placeholders.property("n2o.api.default.widget.table.size"), Integer.class)));
        table.setChildren(p.cast(source.getChildren(),
                p.resolve(property("n2o.api.default.widget.table.children.toggle"), N2oTable.ChildrenToggle.class))
        );
        return table;
    }

    @Override
    protected QueryContext getQueryContext(Table widget, N2oTable source, CompileContext<?, ?> context, String route, CompiledQuery query,
                                           ValidationList validationList, SubModelsScope subModelsScope,
                                           CopiedFieldScope copiedFieldScope, CompileProcessor p, CompiledObject object) {
        QueryContext queryContext = super.getQueryContext(widget, source, context, route, query, validationList,
                subModelsScope, copiedFieldScope, p, object);
        queryContext.setSortingMap(new StrictMap<>());
        if (source.getColumns() != null) {
            for (AbstractColumn column : source.getColumns()) {
                String id = column.getId() != null ? column.getId() : column.getTextFieldId();
                String sortingFieldId = column.getSortingFieldId() != null ? column.getSortingFieldId() : column.getTextFieldId();
                queryContext.getSortingMap().put(id, sortingFieldId);
            }
        }
        return queryContext;
    }

    @Override
    protected String getMessagesForm(Widget widget) {
        return widget.getId() + "_filter";
    }

    private void compileValidation(Table table, N2oTable source, ValidationScope validationScope) {
        if (source.getFilters() == null)
            return;
        Map<String, List<Validation>> clientValidations = new HashMap<>();
        table.getFilter().getFilterFieldsets().forEach(fs -> collectValidation(fs, clientValidations, validationScope));
        table.getFilter().setValidation(clientValidations);
    }

    private void compileColumns(N2oTable source, CompileContext<?, ?> context, CompileProcessor p,
                                TableWidgetComponent component, CompiledQuery query, CompiledObject object,
                                WidgetScope widgetScope, ParentRouteScope widgetRouteScope, MetaActions widgetActions) {
        if (source.getColumns() != null) {
            List<ColumnHeader> headers = new ArrayList<>();
            Map<String, String> sortings = new HashMap<>();
            IndexScope columnIndex = new IndexScope();
            ColumnHeaderScope columnHeaderScope = new ColumnHeaderScope(source, new ArrayList<>(), query);
            for (AbstractColumn column : source.getColumns()) {
                headers.add(p.compile(column, context, p, new ComponentScope(column), object, columnIndex, columnHeaderScope,
                        widgetScope, widgetRouteScope, widgetActions));
                if (column.getSortingDirection() != null) {
                    sortings.put(column.getTextFieldId(), column.getSortingDirection().toString().toUpperCase());
                }
            }
            component.setHeaders(headers);
            component.setCells(columnHeaderScope.getCells());
            component.setSorting(sortings);
            Boolean hasSelect = p.cast(source.getSelected(), p.resolve(property("n2o.api.widget.table.selected"), Boolean.class));
            component.setHasSelect(hasSelect);
            component.setHasFocus(hasSelect);
        }
    }

    private AbstractTable.Filter createFilter(N2oTable source, CompileContext<?, ?> context, CompileProcessor p,
                                              WidgetScope widgetScope, CompiledQuery widgetQuery, CompiledObject object,
                                              ModelsScope modelsScope, FiltersScope filtersScope,
                                              SubModelsScope subModelsScope, UploadScope uploadScope, MomentScope momentScope) {
        List<FieldSet> fieldSets = initFieldSets(source.getFilters(), context, p, widgetScope,
                widgetQuery, object, modelsScope, filtersScope, subModelsScope, uploadScope, momentScope);
        if (source.getColumns() != null) {
            SourceComponent[] filterColumnsFilters = Arrays.stream(source.getColumns()).filter(c -> c instanceof N2oFilterColumn)
                    .map(c -> ((N2oFilterColumn) c).getFilter())
                    .toArray(SourceComponent[]::new);
            initFieldSets(filterColumnsFilters, context, p, widgetScope, widgetQuery, object, modelsScope,
                    filtersScope, subModelsScope, uploadScope, momentScope);
        }

        if (fieldSets.isEmpty())
            return null;
        AbstractTable.Filter filter = new AbstractTable.Filter();
        filter.setFilterFieldsets(fieldSets);
        filter.setFilterButtonId("filter");
        filter.setBlackResetList(new ArrayList<>(Arrays.stream(source.getFilters())
                .filter(f -> f instanceof N2oSearchButtons && ((N2oSearchButtons) f).getClearIgnore() != null)
                .flatMap(f -> Arrays.stream(((N2oSearchButtons) f).getClearIgnore().split(",")))
                .map(s -> s.trim())
                .collect(Collectors.toSet())
        ));
        filter.setFilterPlace(p.cast(source.getFilterPosition(), N2oTable.FilterPosition.top));
        boolean hasSearchButtons = fieldSets.stream()
                .flatMap(fs -> fs.getRows() != null ? fs.getRows().stream() : Stream.empty())
                .flatMap(r -> r.getCols() != null ? r.getCols().stream() : Stream.empty())
                .flatMap(c -> c.getFields() != null ? c.getFields().stream() : Stream.empty())
                .filter(f -> f instanceof StandardField)
                .map(f -> ((StandardField) f).getControl())
                .anyMatch(c -> c instanceof SearchButtons);
        filter.setSearchOnChange(source.getSearchOnChange());
        if (hasSearchButtons || (filter.getSearchOnChange() != null && filter.getSearchOnChange()))
            filter.setHideButtons(true);
        return filter;
    }
}

