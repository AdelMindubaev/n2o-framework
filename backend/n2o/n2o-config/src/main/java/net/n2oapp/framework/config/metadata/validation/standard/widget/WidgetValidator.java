package net.n2oapp.framework.config.metadata.validation.standard.widget;

import net.n2oapp.framework.api.StringUtils;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.aware.SourceClassAware;
import net.n2oapp.framework.api.metadata.global.dao.N2oPreFilter;
import net.n2oapp.framework.api.metadata.global.dao.N2oQuery;
import net.n2oapp.framework.api.metadata.global.dao.object.N2oObject;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oWidget;
import net.n2oapp.framework.api.metadata.global.view.widget.toolbar.*;
import net.n2oapp.framework.api.metadata.validate.SourceValidator;
import net.n2oapp.framework.api.metadata.validate.ValidateProcessor;
import net.n2oapp.framework.api.metadata.validation.exception.N2oMetadataValidationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Валидатор виджета
 */
@Component
public class WidgetValidator implements SourceValidator<N2oWidget>, SourceClassAware {

    @Override
    public void validate(N2oWidget n2oWidget, ValidateProcessor p) {
        N2oQuery query = null;
        if (n2oWidget.getQueryId() != null) {
            p.checkForExists(n2oWidget.getQueryId(), N2oQuery.class,
                    "Виджет \'" + n2oWidget.getId() + "\' ссылается на несуществующую выборку \'" + n2oWidget.getQueryId() + "\'");
            query = p.getOrThrow(n2oWidget.getQueryId(), N2oQuery.class);
        }
        if (n2oWidget.getDefaultValuesQueryId() != null) {
            p.checkForExists(n2oWidget.getDefaultValuesQueryId(), N2oQuery.class,
                    "Виджет \'" + n2oWidget.getId() + "\' ссылается на несуществующую выборку \'" + n2oWidget.getDefaultValuesQueryId() + "\'");
            query = p.getOrThrow(n2oWidget.getDefaultValuesQueryId(), N2oQuery.class);
        }
        N2oObject object = null;
        if (n2oWidget.getObjectId() != null) {
            p.checkForExists(n2oWidget.getObjectId(), N2oObject.class,
                    "Виджет \'" + n2oWidget.getId() + "\' ссылается на несуществующий объект \'" + n2oWidget.getObjectId() + "\'");
            object = p.getOrThrow(n2oWidget.getObjectId(), N2oObject.class);
        }
        if (n2oWidget.getToolbars() != null) {
            List<N2oButton> menuItems = new ArrayList<>();
            for (N2oToolbar toolbar : n2oWidget.getToolbars()) {
                if (toolbar.getItems() != null) {
                    for (ToolbarItem item : toolbar.getItems()) {
                        if (item instanceof N2oButton) {
                            menuItems.add((N2oButton) item);
                        } else if (item instanceof N2oSubmenu) {
                            menuItems.addAll(Arrays.asList(((N2oSubmenu) item).getMenuItems()));
                        }
                    }
                }
            }
            p.safeStreamOf(menuItems).forEach(menuItem -> p.validate(menuItem.getAction()));
            p.checkIdsUnique(menuItems, "MenuItem '%s' встречается более чем один раз в виджете '" + n2oWidget.getId() + "'!");
        }
        if (n2oWidget.getPreFilters() != null) {
            if (query == null)
                throw new N2oMetadataValidationException("Виджет \'" + n2oWidget.getId() + "\' имеет префильтры, но не задана выборка");
            if (query.getFields() == null)
                throw new N2oMetadataValidationException("Виджет \'" + n2oWidget.getId() + "\' имеет префильтры, но в выборке \'" + query.getId()+ "\' нет fields!");
            for (N2oPreFilter preFilter : n2oWidget.getPreFilters()) {
                if (preFilter.getValue() != null && preFilter.getParam() != null && (preFilter.getRoutable() == null || !preFilter.getRoutable())) {
                    throw new N2oMetadataValidationException("В префильтре по полю \'" + (preFilter.getFieldId() == null ? "" : preFilter.getFieldId()) + "\' указан value и param, но при этом routable=false, что противоречит логике работы префильтров!");
                }
                N2oQuery.Field exField = null;
                for (N2oQuery.Field field : query.getFields()) {
                    if (preFilter.getFieldId().equals(field.getId())) {
                        exField = field;
                        break;
                    }
                }
                if (exField == null)
                    throw new N2oMetadataValidationException("В выборке \'" + (query.getId() == null ? "" : query.getId()) + "\' нет field \'"+preFilter.getFieldId()+"\'!");

                if (exField.getFilterList() == null)
                    throw new N2oMetadataValidationException("В выборке \'" + (query.getId() == null ? "" : query.getId()) + "\' field \'"+preFilter.getFieldId()+"\' не содержит фильтров!");

                N2oQuery.Filter exFilter = null;
                for(N2oQuery.Filter filter : exField.getFilterList()) {
                    if(preFilter.getType() == filter.getType()) {
                        exFilter = filter;
                        break;
                    }
                }
                if (exFilter == null)
                    throw new N2oMetadataValidationException("В выборке \'" + (query.getId() == null ? "" : query.getId()) +
                            "\' field \'"+preFilter.getFieldId()+"\' не содержит фильтр типа \'"+preFilter.getType()+"\'!");

                if (n2oWidget.getDependsOn() == null && n2oWidget.getDetailFieldId() == null && preFilter.getRefWidgetId() == null && StringUtils.hasLink(preFilter.getValue())) {
                    throw new N2oMetadataValidationException("В виджете \'" + (n2oWidget.getId() == null ? "" : n2oWidget.getId()) + "\' значение префильтра \'" + preFilter.getFieldId() + "\' является ссылкой, но зависимость для нее прописана!");
                }
            }
        }
        p.safeStreamOf(n2oWidget.getActions()).forEach(actionsBar -> p.validate(actionsBar.getAction()));
    }

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oWidget.class;
    }
}
