package net.n2oapp.framework.config.metadata.compile.fieldset;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.fieldset.N2oLineFieldSet;
import net.n2oapp.framework.api.metadata.meta.fieldset.LineFieldSet;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция полей для филдсета с горизонтальной линией
 */
@Component
public class LineFieldSetCompiler extends AbstractFieldSetCompiler<LineFieldSet, N2oLineFieldSet> {

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oLineFieldSet.class;
    }

    @Override
    public LineFieldSet compile(N2oLineFieldSet source, CompileContext<?, ?> context, CompileProcessor p) {
        LineFieldSet fieldSet = new LineFieldSet();
        compileFieldSet(fieldSet, source, context, p);

        fieldSet.setCollapsible(p.cast(source.getCollapsible(), false));
        fieldSet.setExpand(p.cast(source.getExpand(), true));
        fieldSet.setLabel(source.getLabel());
        fieldSet.setSrc(p.cast(fieldSet.getSrc(), p.resolve(property("n2o.api.fieldset.line.src"), String.class)));

        return fieldSet;
    }
}
