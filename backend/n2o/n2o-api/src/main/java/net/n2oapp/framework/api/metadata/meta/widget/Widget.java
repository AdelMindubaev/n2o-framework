package net.n2oapp.framework.api.metadata.meta.widget;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.data.validation.Validation;
import net.n2oapp.framework.api.exception.N2oException;
import net.n2oapp.framework.api.metadata.Component;
import net.n2oapp.framework.api.metadata.event.action.UploadType;
import net.n2oapp.framework.api.metadata.meta.Filter;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import net.n2oapp.framework.api.metadata.meta.action.Action;
import net.n2oapp.framework.api.metadata.meta.toolbar.Toolbar;

import java.util.*;

/**
 * Клиентская модель виджета
 */
@Getter
@Setter
public abstract class Widget<T extends WidgetComponent> extends Component {
    private String id;
    private String route;
    /**
     * Наименование path параметра идентификатора родительского виджета
     */
    private String masterParam;
    /**
     * Ссылка на идентификатор родительского виджета
     */
    private ModelLink masterLink;
    private Boolean opened;
    private String name;
    @JsonProperty
    private String icon;
    private UploadType upload;
    private String objectId;
    private String queryId;
    private List<Filter> filters;
    protected T component;
    private Set<String> notCopiedFields;
    private List<Validation> validations = new ArrayList<>();
    @JsonProperty
    private WidgetDataProvider dataProvider;
    @JsonProperty
    private Toolbar toolbar;
    @JsonProperty
    private Map<String, Action> actions;
    @JsonProperty
    private WidgetDependency dependency;
    @JsonProperty
    private Boolean visible;

    public Widget() {
    }

    public Widget(T component) {
        this.component = component;
    }

    public Filter getFilter(String filterId) {
        if (filters == null)
            return null;
        return filters.stream().filter(f -> f.getFilterId().equals(filterId)).findFirst()
                .orElseThrow(() -> new N2oException("Filter " + filterId + " not found"));
    }

}
