package net.n2oapp.framework.config.reader.page;

import net.n2oapp.framework.api.metadata.global.view.action.control.RefreshPolity;
import net.n2oapp.framework.api.metadata.global.view.page.N2oStandardPage;
import net.n2oapp.framework.api.metadata.global.view.region.*;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oWidget;
import net.n2oapp.framework.api.metadata.reader.AbstractFactoredReader;
import net.n2oapp.framework.api.metadata.reader.NamespaceReaderFactory;
import net.n2oapp.framework.config.reader.MetadataReaderException;
import net.n2oapp.framework.config.reader.tools.CounterReaderV1;
import net.n2oapp.framework.config.reader.tools.PreFilterReaderV1Util;
import net.n2oapp.framework.config.reader.tools.PropertiesReaderV1;
import net.n2oapp.framework.config.reader.util.ReaderJdomUtil;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static net.n2oapp.framework.config.reader.util.ReaderJdomUtil.*;

/**
 * Считывает страницу версии 1.0
 */
@Component
public class PageXmlReaderV1 extends AbstractFactoredReader<N2oStandardPage> {

    @Override
    public N2oStandardPage read(Element root, Namespace namespace) {
        String elementName = root.getName();
        if (!elementName.equals("page")) throw new MetadataReaderException("element <page> not found");
        N2oStandardPage n2oPage = new N2oStandardPage();
        n2oPage.setObjectId(ReaderJdomUtil.getElementString(root, "object-id"));
        n2oPage.setName(ReaderJdomUtil.getElementString(root, "name"));
        n2oPage.setSrc(ReaderJdomUtil.getElementString(root, "src"));
        List<N2oRegion> regions = new ArrayList<>();
        Element containers = root.getChild("containers", namespace);
        if (containers != null) {
            readContainers(n2oPage, regions, containers);
        }
        Element regionsElem = root.getChild("regions", namespace);
        if (regionsElem != null) {
            readRegions(n2oPage, regions, regionsElem);
        }
        n2oPage.setItems(regions.toArray(new N2oRegion[regions.size()]));
        n2oPage.setModalWidth(ReaderJdomUtil.getElementString(root, "modal-width"));
        n2oPage.setMinModalWidth(ReaderJdomUtil.getElementString(root, "modal-min-width"));
        n2oPage.setMaxModalWidth(ReaderJdomUtil.getElementString(root, "modal-max-width"));
        return n2oPage;
    }

    private void readRegions(N2oStandardPage n2oPage, List<N2oRegion> regions, Element regionsElem) {
        n2oPage.setResultContainer(getAttributeString(regionsElem, "result-container"));
        List regionElements = regionsElem.getChildren();
        for (Object r : regionElements) {
            Element element = (Element) r;
            List widgetElements = element.getChildren();
            N2oRegion region = createRegion(regionElements, getAttributeString(element, "type"), widgetElements);
            String src = getAttributeString(element, "src");
            if (src != null)
                region.setSrc(src);
            region.setProperties(PropertiesReaderV1.getInstance().read(element, element.getNamespace()));
            region.setPlace(getAttributeString(element, "place"));
            region.setWidth(getAttributeString(element, "width"));
            region.setName(getAttributeString(element, "name"));
            List<N2oWidget> widgets = new ArrayList<>();
            for (Object c : widgetElements) {
                N2oWidget wgt = readWidget((Element) c, readerFactory);
                widgets.add(wgt);
            }
            region.setItems(widgets.toArray(new N2oWidget[widgets.size()]));
            regions.add(region);
        }
    }

    private N2oRegion createRegion(List regionElements, String type, List widgetElements) {
        N2oRegion region;
        if (type == null) {
            if (widgetElements.size() == 1 && regionElements.size() == 1) {
                region = new N2oNoneRegion();
            } else {
                region = new N2oTabsRegion();
            }
        } else {
            switch (type) {
                case "tabs":
                    region = new N2oTabsRegion();
                    break;
                case "panel":
                    region = new N2oPanelRegion();
                    break;
                case "pills":
                    region = new N2oPillsRegion();
                    break;
                case "line":
                case "list":
                    region = new N2oLineRegion();
                    break;
                case "select":
                    region = new N2oSelectRegion();
                    break;
                default:
                    region = new N2oNoneRegion();
                    break;
            }
        }
        return region;
    }

    private void readContainers(N2oStandardPage n2oPage, List<N2oRegion> regions, Element containers) {
        n2oPage.setResultContainer(getAttributeString(containers, "result-container"));
        List containerElements = containers.getChildren();
        for (Object c : containerElements) {
            Element container = (Element) c;
            N2oRegion region;
            if (containerElements.size() == 1) {
                region = new N2oNoneRegion();
                N2oWidget widget = readWidget(container, readerFactory);
                ((N2oNoneRegion) region).setItems(new N2oWidget[]{widget});
            } else {
                region = new N2oTabsRegion();
            }
            region.setPlace(getAttributeString(container, "place"));
            regions.add(region);
        }
    }

    private N2oWidget readWidget(Element element, NamespaceReaderFactory readerFactory) {
        N2oWidget n2oWidget = null;
        for (Object o : element.getChildren()) {
            Element widget = (Element) o;
            if (!widget.getNamespace().equals(element.getNamespace())) {
                n2oWidget = (N2oWidget) readerFactory.produce(widget).read(widget);
                n2oWidget.setDependsOn(getAttributeString(element, "depends-on"));
                n2oWidget.setDependencyCondition(getAttributeString(element, "dependency-condition"));
                n2oWidget.setRefreshPolity(getAttributeEnum(element, "refresh-policy", RefreshPolity.class));
                n2oWidget.setOpened(getAttributeBoolean(element, "opened"));
                n2oWidget.setIcon(getAttributeString(element, "icon"));
                n2oWidget.setDetailFieldId(getAttributeString(widget, "detail-field-id"));
                n2oWidget.setMasterFieldId(getAttributeString(widget, "master-field-id"));
                n2oWidget.setId(getAttributeString(element, "id"));
                n2oWidget.setRefreshDependentContainer(getAttributeBoolean(element, "refresh-dependent-container"));
            }
        }
        if (n2oWidget == null)
            return null;
        Element preFilters = element.getChild("pre-filters", element.getNamespace());
        n2oWidget.setPreFilters(PreFilterReaderV1Util.getControlPreFilterListDefinition(preFilters));
        n2oWidget.setCounter(getChild(element, element.getNamespace(), "counter", CounterReaderV1.getInstance()));
        return n2oWidget;
    }

    @Override
    public Class<N2oStandardPage> getElementClass() {
        return N2oStandardPage.class;
    }

    @Override
    public String getNamespaceUri() {
        return "http://n2oapp.net/framework/config/schema/page-1.0";
    }

    @Override
    public String getElementName() {
        return "page";
    }
}