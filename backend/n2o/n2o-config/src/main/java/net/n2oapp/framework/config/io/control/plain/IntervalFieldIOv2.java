package net.n2oapp.framework.config.io.control.plain;

import net.n2oapp.framework.api.metadata.control.N2oField;
import net.n2oapp.framework.api.metadata.control.plain.N2oIntervalField;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import net.n2oapp.framework.config.io.control.ControlIOv2;
import net.n2oapp.framework.config.io.control.StandardFieldIOv2;
import org.jdom.Element;
import org.jdom.Namespace;
import org.springframework.stereotype.Component;

@Component
public class IntervalFieldIOv2 extends StandardFieldIOv2<N2oIntervalField> {

    private Namespace controlNamespace = ControlIOv2.NAMESPACE;

    @Override
    public void io(Element e, N2oIntervalField m, IOProcessor p) {
        super.io(e, m, p);
        p.anyChild(e, "begin", m::getBegin, m::setBegin, p.anyOf(N2oField.class),
                controlNamespace);
        p.anyChild(e, "end", m::getEnd, m::setEnd, p.anyOf(N2oField.class), controlNamespace);
    }

    @Override
    public Class<N2oIntervalField> getElementClass() {
        return N2oIntervalField.class;
    }

    @Override
    public String getElementName() {
        return "interval-field";
    }
}
