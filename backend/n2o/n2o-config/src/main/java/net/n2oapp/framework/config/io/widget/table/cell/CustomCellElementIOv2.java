package net.n2oapp.framework.config.io.widget.table.cell;

import net.n2oapp.framework.api.metadata.event.action.N2oAction;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oCustomCell;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import net.n2oapp.framework.config.io.action.ActionIOv1;
import org.jdom.Element;
import org.jdom.Namespace;
import org.springframework.stereotype.Component;

/**
 * Чтение\запись настраиваемой ячейки
 */
@Component
public class CustomCellElementIOv2 extends AbstractCellElementIOv2<N2oCustomCell> {
    private Namespace actionDefaultNamespace = ActionIOv1.NAMESPACE;

    @Override
    public void io(Element e, N2oCustomCell c, IOProcessor p) {
        super.io(e, c, p);
        p.anyChild(e, null, c::getAction, c::setAction, p.anyOf(N2oAction.class), actionDefaultNamespace);
    }

    @Override
    public String getElementName() {
        return "cell";
    }

    @Override
    public Class<N2oCustomCell> getElementClass() {
        return N2oCustomCell.class;
    }
}
