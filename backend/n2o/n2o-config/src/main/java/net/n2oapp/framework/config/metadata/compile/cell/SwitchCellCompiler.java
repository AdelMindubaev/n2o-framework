package net.n2oapp.framework.config.metadata.compile.cell;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oAbstractCell;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oSwitchCell;
import net.n2oapp.framework.api.metadata.meta.cell.SwitchCell;
import net.n2oapp.framework.config.metadata.compile.BaseSourceCompiler;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция переключателя ячеек
 */
@Component
public class SwitchCellCompiler implements BaseSourceCompiler<SwitchCell, N2oSwitchCell, CompileContext<?, ?>> {
    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oSwitchCell.class;
    }

    @Override
    public SwitchCell compile(N2oSwitchCell source, CompileContext<?, ?> context, CompileProcessor p) {
        SwitchCell cell = new SwitchCell();
        cell.setSrc(p.resolve(property("n2o.api.cell.switch.src"), String.class));
        cell.setId(source.getValueFieldId());
        cell.setSwitchFieldId(source.getValueFieldId());
        for (N2oSwitchCell.Case c : source.getCases()) {
            N2oAbstractCell compile = p.compile(c.getItem(), context, p);
            cell.getSwitchList().put(c.getValue(), compile);
        }
        cell.setSwitchDefault(p.compile(source.getDefaultCase(), context, p));
        return cell;
    }
}
