package net.n2oapp.framework.config.persister.widget;

import net.n2oapp.framework.api.metadata.global.view.widget.N2oTree;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.springframework.stereotype.Component;

/**
 * User: operhod
 * Date: 10.01.14
 * Time: 10:22
 */

@Component
public class TreeXmlPersister extends WidgetXmlPersister<N2oTree> {
    @Override
    public Element getWidget(N2oTree n2o, Namespace namespace) {
        Element rootElement = new Element(getElementName(), namespace);
        persistWidget(rootElement, n2o, namespace);
        if (n2o.getAjax() != null) {
            Element ajax = new Element("ajax", namespace);
            ajax.addContent(n2o.getAjax().toString());
            rootElement.addContent(ajax);
        }
        if (n2o.getCheckboxes() != null) {
            Element checkboxes = new Element("checkboxes", namespace);
            checkboxes.addContent(n2o.getCheckboxes().toString());
            rootElement.addContent(checkboxes);
        }

        Element inheritanceNodes = new Element("inheritance-nodes", namespace);
        inheritanceNodes.setAttribute("parent-field-id", n2o.getParentFieldId());
        inheritanceNodes.setAttribute("label-field-id", n2o.getLabelFieldId());
        if (n2o.getHasChildrenFieldId() != null)
            inheritanceNodes.setAttribute("has-children-field-id", n2o.getHasChildrenFieldId());
        if (n2o.getIconFieldId() != null)
            inheritanceNodes.setAttribute("icon-field-id", n2o.getIconFieldId());
        rootElement.addContent(inheritanceNodes);
        return rootElement;
    }

    @Override
    public Class<N2oTree> getElementClass() {
        return N2oTree.class;
    }

    @Override
    public String getElementName() {
        return "tree";
    }
}
