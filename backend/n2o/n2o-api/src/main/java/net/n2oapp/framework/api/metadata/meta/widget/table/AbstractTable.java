package net.n2oapp.framework.api.metadata.meta.widget.table;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.data.validation.Validation;
import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.global.view.widget.table.N2oTable;
import net.n2oapp.framework.api.metadata.meta.widget.Widget;
import net.n2oapp.framework.api.metadata.meta.fieldset.FieldSet;

import java.util.List;
import java.util.Map;

/**
 * Абстрактная реализация клиентской модели таблицы
 */
@Getter
@Setter
public abstract class AbstractTable<T extends TableWidgetComponent> extends Widget<T> {
    @JsonProperty
    private Pagination paging;
    @JsonProperty
    private Filter filter;

    @JsonProperty("table")
    @Override
    public T getComponent() {
        return component;
    }

    public AbstractTable(T component) {
        super(component);
    }

    /**
     * Клиентская модель фильтрации
     */
    @Getter
    @Setter
    public static class Filter implements Compiled {
        @JsonProperty
        private List<FieldSet> filterFieldsets;
        @JsonProperty
        private String filterButtonId;
        @JsonProperty
        private List<String> blackResetList;
        @JsonProperty
        private N2oTable.FilterPosition filterPlace;
        @JsonProperty
        private Map<String, List<Validation>> validation;
        @JsonProperty
        @Deprecated
        private Boolean hideButtons;
    }
}
