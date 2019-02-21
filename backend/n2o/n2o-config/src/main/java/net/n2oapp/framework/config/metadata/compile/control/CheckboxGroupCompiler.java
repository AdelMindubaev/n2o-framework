package net.n2oapp.framework.config.metadata.compile.control;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.control.multi.N2oCheckboxGroup;
import net.n2oapp.framework.api.metadata.meta.control.CheckboxGroup;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция группы чекбоксов
 */
@Component
public class CheckboxGroupCompiler extends ListControlCompiler<CheckboxGroup, N2oCheckboxGroup> {
    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oCheckboxGroup.class;
    }

    @Override
    public StandardField<CheckboxGroup> compile(N2oCheckboxGroup source, CompileContext<?,?> context, CompileProcessor p) {
        CheckboxGroup checkboxGroup = new CheckboxGroup();
        checkboxGroup.setInline(source.getInline());
        checkboxGroup.setType(p.cast(source.getType(), p.resolve(property("n2o.api.control.alt.type"), String.class)));
        return compileFetchDependencies(checkboxGroup, source, context, p);
    }

    @Override
    protected String getControlSrcProperty() {
        return "n2o.api.control.checkbox_group.src";
    }
}
