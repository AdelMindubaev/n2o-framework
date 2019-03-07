package net.n2oapp.framework.api.metadata.global.view.widget;

import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.N2oNamespace;
import net.n2oapp.framework.api.metadata.aware.CssClassAware;
import net.n2oapp.framework.api.metadata.aware.ExtensionAttributesAware;
import net.n2oapp.framework.api.metadata.aware.NameAware;
import net.n2oapp.framework.api.metadata.aware.RefIdAware;
import net.n2oapp.framework.api.metadata.event.action.UploadType;
import net.n2oapp.framework.api.metadata.global.N2oMetadata;
import net.n2oapp.framework.api.metadata.global.dao.N2oPreField;
import net.n2oapp.framework.api.metadata.global.dao.N2oPreFilter;
import net.n2oapp.framework.api.metadata.global.view.ActionsBar;
import net.n2oapp.framework.api.metadata.global.view.action.control.RefreshPolity;
import net.n2oapp.framework.api.metadata.global.view.page.GenerateType;
import net.n2oapp.framework.api.metadata.global.view.tools.N2oCounter;
import net.n2oapp.framework.api.metadata.global.view.widget.toolbar.N2oToolbar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Исходная модель виджета
 */
@Getter
@Setter
public abstract class N2oWidget extends N2oMetadata
        implements NameAware, RefIdAware, CssClassAware, ExtensionAttributesAware {
    private String src;
    private String customize;
    private String name;
    private String route;
    private String queryId;
    private String defaultValuesQueryId;
    private String objectId;
    private Integer size;
    private String cssClass;
    private String style;
    private Boolean border;
    private String refId;
    private String masterParam;
    private Boolean fetchOnInit;

    /**
     * Источник данных виджета
     */
    private UploadType upload;
    @Deprecated
    private String containerId;
    private String dependsOn;
    private String dependencyCondition;
    private String result;
    private String icon;
    private Boolean opened;
    private String masterFieldId;
    private String detailFieldId;
    private String visible;
    private Boolean refreshDependentContainer;
    private N2oPreFilter[] preFilters;
    private N2oCounter counter;
    private RefreshPolity refreshPolity;
    private ActionsBar[] actions;
    private GenerateType actionGenerate;
    private N2oToolbar[] toolbars;
    private N2oPreField[] preFields;
    private Map<N2oNamespace, Map<String, String>> extAttributes;

    public Class getWidgetClass() {
        return this.getClass();
    }

    @Override
    public final String getPostfix() {
        return "widget";
    }

    @Override
    public final Class<? extends N2oMetadata> getSourceBaseClass() {
        return N2oWidget.class;
    }

    /**
     * Добавить предустановленные фильтры
     *
     * @param preFilters Список предустановленных фильтров
     */
    public void addPreFilters(List<N2oPreFilter> preFilters) {
        List<N2oPreFilter> list = new ArrayList<>();
        if (this.preFilters != null)
            list.addAll(Arrays.asList(this.preFilters));
        list.addAll(preFilters);
        this.preFilters = list.toArray(new N2oPreFilter[list.size()]);
    }
}
