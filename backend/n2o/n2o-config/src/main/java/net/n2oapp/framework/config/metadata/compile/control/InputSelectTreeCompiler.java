package net.n2oapp.framework.config.metadata.compile.control;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.control.list.N2oInputSelectTree;
import net.n2oapp.framework.api.metadata.meta.control.InputSelectTree;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import org.springframework.stereotype.Component;


@Component
public class InputSelectTreeCompiler extends ListControlCompiler<InputSelectTree, N2oInputSelectTree> {

    @Override
    protected String getControlSrcProperty() {
        return "n2o.api.control.input.select.tree.src";
    }

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oInputSelectTree.class;
    }

    @Override
    public StandardField<InputSelectTree> compile(N2oInputSelectTree source, CompileContext<?,?> context, CompileProcessor p) {
        InputSelectTree control = new InputSelectTree();
        control.setPlaceholder(p.resolveJS(source.getPlaceholder()));
        control.setParentFieldId(p.resolveJS(source.getInheritanceNodes().getParentFieldId()));
        control.setHasChildrenFieldId(p.resolveJS(source.getInheritanceNodes().getHasChildrenFieldId()));
        control.setHasCheckboxes(p.cast(source.getCheckboxes(), false));
        control.setMultiSelect(control.isHasCheckboxes());
        control.setClosePopupOnSelect(!control.isHasCheckboxes());
        control.setAjax(p.cast(source.getAjax(), false));
        control.setSize(p.cast(source.getSize(), 30));
        control.setCheckingStrategy(source.getCheckingStrategy());
        control.setMaxTagCount(source.getMaxTagCount());
        source.setQueryId(p.resolveJS(source.getInheritanceNodes().getQueryId()));
        source.setLabelFieldId(p.cast(p.resolveJS(source.getInheritanceNodes().getLabelFieldId()), "name"));
        source.setIconFieldId(p.resolveJS(source.getInheritanceNodes().getIconFieldId()));
        return compileListControl(control, source, context, p);
    }


}
