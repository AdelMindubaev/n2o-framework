package net.n2oapp.framework.config.metadata.compile.fieldset;

import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.aware.NamespaceUriAware;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.control.N2oField;
import net.n2oapp.framework.api.metadata.global.view.fieldset.N2oFieldsetColumn;
import net.n2oapp.framework.api.metadata.meta.control.Field;
import net.n2oapp.framework.api.metadata.meta.fieldset.FieldSet;
import net.n2oapp.framework.api.metadata.meta.fieldset.SetFieldSet;
import net.n2oapp.framework.api.script.ScriptProcessor;
import net.n2oapp.framework.config.metadata.compile.BaseSourceCompiler;
import net.n2oapp.framework.config.util.StylesResolver;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Компиляция колонки филдсета
 */
@Component
public class FieldSetColumnCompiler implements BaseSourceCompiler<FieldSet.Column, N2oFieldsetColumn, CompileContext<?, ?>> {

    @Override
    public FieldSet.Column compile(N2oFieldsetColumn source, CompileContext<?, ?> context, CompileProcessor p) {
        FieldSet.Column column = new FieldSet.Column();
        column.setClassName(source.getCssClass());
        column.setStyle(StylesResolver.resolveStyles(source.getStyle()));
        column.setSize(source.getSize());
        column.setVisible(ScriptProcessor.resolveExpression(source.getVisible()));

        if (source.getItems() != null && source.getItems().length > 0) {
            if (source.getItems()[0] instanceof N2oField) {
                List<Field> fields = new ArrayList<>();
                for (NamespaceUriAware item : source.getItems()) {
                    fields.add(p.compile(item, context));
                }
                if (fields.size() == 1)
                    column.setSize(column.getSize());
                column.setFields(fields);
            } else {
                List<FieldSet> fieldSets = new ArrayList<>();
                List<FieldSet.Row> rows = new ArrayList<>();
                for (NamespaceUriAware item : source.getItems()) {
                    Compiled compiled = p.compile(item, context);
                    if (compiled instanceof FieldSet) {
                        if (!rows.isEmpty())
                            fieldSets.add(createWrappingFieldset(rows));
                        fieldSets.add((FieldSet) compiled);
                    } else {
                        rows.add((FieldSet.Row) compiled);
                    }
                }
                if (!rows.isEmpty())
                    fieldSets.add(createWrappingFieldset(rows));
                column.setFieldsets(fieldSets);
            }
        }
        return column;
    }

    /**
     * Создание филдсета, который будет оборачивать одну или несколько подряд идущих строк,
     * лежащих вне филдсетов
     * @param rows Список строк филдсета
     * @return Филдсет, содержащий все входящие строки
     */
    private FieldSet createWrappingFieldset(List<FieldSet.Row> rows) {
        FieldSet fieldSet = new SetFieldSet();
        fieldSet.setRows(new ArrayList<>(rows));
        rows.clear();
        return fieldSet;
    }

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oFieldsetColumn.class;
    }
}
