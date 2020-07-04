package net.n2oapp.framework.config.io.control.plain;

import net.n2oapp.framework.api.metadata.control.plain.N2oAlert;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import org.jdom2.Element;
import org.springframework.stereotype.Component;

@Component
public class AlertIOv2 extends PlainFieldIOv2<N2oAlert> {

    @Override
    public void io(Element e, N2oAlert m, IOProcessor p) {
        super.io(e, m, p);
        p.text(e, m::getText, m::setText);
        p.attribute(e, "header", m::getHeader, m::setHeader);
        p.attribute(e, "footer", m::getFooter, m::setFooter);
        p.attribute(e, "color", m::getColor, m::setColor);
        p.attributeBoolean(e, "fade", m::getFade, m::setFade);
        p.attribute(e, "tag", m::getTag, m::setTag);
    }

    @Override
    public Class<N2oAlert> getElementClass() {
        return N2oAlert.class;
    }

    @Override
    public String getElementName() {
        return "alert";
    }
}
