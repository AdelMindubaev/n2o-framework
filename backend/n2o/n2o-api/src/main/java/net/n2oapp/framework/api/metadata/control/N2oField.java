package net.n2oapp.framework.api.metadata.control;

import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.aware.IdAware;
import net.n2oapp.framework.api.metadata.global.dao.N2oParam;
import net.n2oapp.framework.api.metadata.global.dao.N2oPreFilter;
import net.n2oapp.framework.api.metadata.global.dao.validation.N2oValidation;
import net.n2oapp.framework.api.metadata.global.view.widget.toolbar.N2oToolbar;

import java.util.Arrays;


/**
 * Исходная модель поля
 */
@Getter
@Setter
public abstract class N2oField extends N2oComponent implements IdAware {
    private String id;
    private Boolean visible;
    private Boolean required;
    private Boolean enabled;
    private String[] dependsOn;
    @Deprecated
    private String style;
    private String label;
    private String labelClass;
    @Deprecated
    private String labelStyle;
    private String description;
    private String help;
    private String domain;
    private Boolean noLabel;
    private String param;

    private N2oToolbar toolbar;
    private Dependency[] dependencies;

    public void addDependency(Dependency d) {
        if (d == null) return;
        if (dependencies == null) {
            dependencies = new Dependency[1];
            dependencies[0] = d;
        } else {
            dependencies = Arrays.copyOf(dependencies, dependencies.length + 1);
            dependencies[dependencies.length - 1] = d;
        }
    }

    /**
     * @param clazz - Тип зависимости
     * @return содержит ли поле зависимость типа clazz
     */
    public boolean containsDependency(Class<? extends Dependency> clazz) {
        if (dependencies == null) return false;

        for (Dependency dependency : dependencies) {
            if (dependency.getClass().equals(clazz))
                return true;
        }

        return false;
    }

    @Getter
    @Setter
    public static class Validations implements Source {
        private N2oValidation[] inlineValidations;
        private String[] whiteList;

    }

    @Getter
    @Setter
    public static class Submit implements Source {
        private String operationId;
        private Boolean messageOnSuccess;
        private Boolean messageOnFail;
        private String route;
        private N2oParam[] pathParams;
        private N2oParam[] queryParams;
        private N2oParam[] headerParams;
        private N2oParam[] formParams;
    }

    @Getter
    @Setter
    public static class Dependency implements Source {
        private String[] on;
        private String value;
        private Boolean applyOnInit;
    }

    public static class EnablingDependency extends Dependency {
    }

    public static class RequiringDependency extends Dependency {
    }

    public static class SetValueDependency extends Dependency {
    }

    public static class FetchDependency extends Dependency {
    }

    public static class ResetDependency extends Dependency {
    }

    @Getter
    @Setter
    public static class FetchValueDependency extends Dependency {
        private String queryId;
        private String valueFieldId;
        private N2oPreFilter[] preFilters;
    }

    @Getter
    @Setter
    public static class VisibilityDependency extends Dependency {
        private Boolean reset;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + getId() + ")";
    }
}
