package net.n2oapp.framework.config.io.control;

import net.n2oapp.framework.api.metadata.control.plain.CodeLanguageEnum;
import net.n2oapp.framework.api.metadata.control.plain.N2oCodeViewer;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import org.jdom.Element;
import org.springframework.stereotype.Component;

@Component
public class CodeViewerIOv2 extends StandardFieldIOv2<N2oCodeViewer>{

    @Override
    public void io(Element e, N2oCodeViewer m, IOProcessor p) {
        super.io(e, m, p);
        p.attribute(e, "title", m::getTitle, m::setTitle);
        p.attributeEnum(e, "language", m::getLanguage, m::setLanguage, CodeLanguageEnum.class);
        p.attribute(e, "theme", m::getTheme, m::setTheme);
        p.attributeBoolean(e, "hide", m::getHide, m::setHide);
        p.attributeBoolean(e, "show-line-numbers", m::getShowLineNumbers, m::setShowLineNumbers);
        p.attributeInteger(e, "starting-line-number", m::getStartingLineNumber, m::setStartingLineNumber);
    }

    @Override
    public Class<N2oCodeViewer> getElementClass() {
        return N2oCodeViewer.class;
    }

    @Override
    public String getElementName() {
        return "code-viewer";
    }
}
