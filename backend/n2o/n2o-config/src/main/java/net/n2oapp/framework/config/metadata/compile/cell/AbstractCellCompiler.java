package net.n2oapp.framework.config.metadata.compile.cell;

import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.widget.table.N2oSwitch;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.AbstractColumn;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oAbstractCell;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oActionCell;
import net.n2oapp.framework.api.metadata.meta.action.Action;
import net.n2oapp.framework.api.script.ScriptProcessor;
import net.n2oapp.framework.config.metadata.compile.BaseSourceCompiler;
import net.n2oapp.framework.config.metadata.compile.ComponentScope;
import net.n2oapp.framework.config.metadata.compile.widget.MetaActions;
import net.n2oapp.framework.config.util.StylesResolver;

import java.util.HashMap;
import java.util.Map;


/**
 * Компиляция абстрактной ячейки
 */
public abstract class AbstractCellCompiler<D extends N2oAbstractCell, S extends N2oAbstractCell>
        implements BaseSourceCompiler<D, S, CompileContext<?, ?>> {

    protected D build(D compiled, S source, CompileContext<?, ?> context, CompileProcessor p, String defaultSrc) {
        ComponentScope columnScope = p.getScope(ComponentScope.class);
        if (columnScope != null) {
            AbstractColumn column = columnScope.unwrap(AbstractColumn.class);
            source.setId(column.getId());
            compiled.setId(column.getId());
            compiled.setFieldKey(column.getTextFieldId());
            compiled.setTooltipFieldId(column.getTooltipFieldId());
        }
        compiled.setSrc(p.cast(source.getSrc(), p.resolve(defaultSrc, String.class)));
        compiled.setCssClass(p.resolveJS(source.getCssClass()));
        compiled.setReactStyle(StylesResolver.resolveStyles(source.getStyle()));
        compiled.setJsonVisible(p.resolveJS(source.getVisible(), Boolean.class));
        compiled.setProperties(p.mapAttributes(source));
        return compiled;
    }

    protected void compileAction(N2oActionCell compiled, N2oActionCell source, CompileContext<?, ?> context, CompileProcessor p) {
        if (source.getActionId() != null || source.getAction() != null) {
            Action action;
            if (source.getActionId() != null) {
                MetaActions actions = p.getScope(MetaActions.class);
                action = actions.get(source.getActionId());
                compiled.setActionId(source.getActionId());
            } else {
                action = p.compile(source.getAction(), context, new ComponentScope(source));
                compiled.setActionId(source.getAction().getId());
            }
            compiled.setCompiledAction(action);
        }
    }

    protected String compileSwitch(N2oSwitch n2oSwitch, CompileProcessor p) {
        if (n2oSwitch == null) return null;
        Map<Object, String> resolvedCases = new HashMap<>();
        if (n2oSwitch.getCases() != null) {
            for (String key : n2oSwitch.getCases().keySet()) {
                resolvedCases.put(p.resolve(key), n2oSwitch.getCases().get(key));
            }
        }
        n2oSwitch.setResolvedCases(resolvedCases);
        return ScriptProcessor.buildSwitchExpression(n2oSwitch);
    }
}
