package net.n2oapp.framework.config.reader.widget;

import net.n2oapp.context.CacheTemplateByMapMock;
import net.n2oapp.context.StaticSpringContext;
import net.n2oapp.framework.api.metadata.control.N2oField;
import net.n2oapp.framework.api.metadata.event.action.N2oAnchor;
import net.n2oapp.framework.api.metadata.event.action.N2oInvokeAction;
import net.n2oapp.framework.api.metadata.event.action.N2oOpenPage;
import net.n2oapp.framework.api.metadata.event.action.N2oShowModal;
import net.n2oapp.framework.api.metadata.global.view.fieldset.N2oFieldsetRow;
import net.n2oapp.framework.api.metadata.global.view.page.N2oPage;
import net.n2oapp.framework.api.metadata.event.action.N2oAbstractPageAction;
import net.n2oapp.framework.api.metadata.global.view.widget.*;
import net.n2oapp.framework.api.metadata.global.view.fieldset.N2oFieldSet;
import net.n2oapp.framework.api.metadata.global.view.widget.table.*;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.AbstractColumn;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.N2oSimpleColumn;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oCheckboxCell;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oColorCell;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oIconCell;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oLink;
import net.n2oapp.framework.api.metadata.global.view.widget.tree.GroupingNodes;
import net.n2oapp.framework.config.reader.widget.cell.*;
import net.n2oapp.framework.config.selective.reader.SelectiveReader;
import net.n2oapp.framework.config.selective.reader.SelectiveStandardReader;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.mock;


/**
 * Created by enuzhdina on 14.05.2015.
 */
public class WidgetXmlReaderTest {
    private SelectiveReader widgetReader = new SelectiveStandardReader()
            .addWidgetReaderV3()
            .addEventsReader()
            .addFieldSet3Reader();

    private SelectiveReader pageReader = new SelectiveStandardReader().addPage1()
            .addWidgetReaderV3();

    @Before
    public void setUp() throws Exception {
        ApplicationContext applicationContext = mock(ApplicationContext.class);
        StaticSpringContext staticSpringContext = new StaticSpringContext();
        staticSpringContext.setApplicationContext(applicationContext);
        staticSpringContext.setCacheTemplate(new CacheTemplateByMapMock());
    }


    @Test
    public void testFormWidget() {

        N2oForm refForm = widgetReader.readByPath("net/n2oapp/framework/config/reader/widget/form/testWidgetReaderForm.widget.xml");
        assert refForm.getRefId().equals("test");
    }

    @Test
    public void testTableWidget() {
        widgetReader.addReader(new N2oColorCellXmlReader())
                .addReader(new N2oCheckboxCellXmlReader())
                .addReader(new N2oCustomCellXmlReader())
                .addReader(new N2oIconCellXmlReader())
                .addReader(new N2oLinkCellXmlReader())
                .addReader(new N2oTextCellXmlReader())
                .addReader(new N2oImageCellXmlReader())
                .addReader(new N2oProgressBarCellXmlReader());
        N2oTable table = widgetReader.readByPath("net/n2oapp/framework/config/reader/widget/table/testWidgetReaderTable1.widget.xml");
        assertWidgetAttribute(table);
        assertStandardTable(table);
    }

    @Test
    public void testTreeWidget() {
        N2oTree inheritanceTree = widgetReader.readByPath("net/n2oapp/framework/config/reader/widget/tree/testWidgetReaderTree1.widget.xml");
        assertWidgetAttribute(inheritanceTree);
        assertInheritanceTree(inheritanceTree);

        N2oTree groupingNodesTree = widgetReader.readByPath("net/n2oapp/framework/config/reader/widget/tree/testWidgetReaderTree2.widget.xml");
        assertGroupingNodesTree(groupingNodesTree);
    }


    @Test
    public void refWidget() {
        N2oPage page = pageReader.readByPath("net/n2oapp/framework/config/reader/widget/testWidgetReaderRefForm.page.xml");
        assertRefWidget(page);
    }

    protected void assertWidgetAttribute(N2oWidget widget) {
        assert widget.getName().equals("test");
        assert widget.getSize().equals(32);
        assert widget.getSrc().equals("test");
        assert widget.getCssClass().equals("test");
        assert widget.getCustomize().equals("css");
        assert widget.getQueryId().equals("blank");
    }

    protected void assertStandardForm(N2oForm form) {
        assert form.getItems().length == 1;
        assert  ((N2oField)((N2oFieldsetRow)((N2oFieldSet)form.getItems()[0]).getItems()[0]).getItems()[0]).getId().equals("id");
    }

    protected void assertFieldSetAttribute(N2oForm form, boolean isRow) {
        assert form.getItems().length == 1;
        N2oFieldSet fieldSet = (N2oFieldSet)form.getItems()[0];
        assert fieldSet.getDependencyCondition().equals("test");
        assert fieldSet.getFieldLabelLocation().name().toLowerCase().equals("left");
        assert fieldSet.getLabel().equals("test");
        assert ((N2oFieldsetRow)fieldSet.getItems()[0]).getClass().equals(N2oFieldsetRow.class);
        assert (((N2oField)((N2oFieldsetRow)fieldSet.getItems()[0]).getItems()[0]).getId().equals("id"));
    }

    protected void assertStandardTable(N2oTable table) {
        assert table.getColumns().length == 12;
        for (AbstractColumn column : table.getColumns()) {
            assert column.getTextFieldId().equals("id");
            assert column.getTooltipFieldId().equals("id");
            assert column.getFormat().equals("date DD.MM.YYYY");
            assert column.getWidth().equals("100");
        }

        //проверяем чек-бокс
        N2oCheckboxCell checkBoxCell = (N2oCheckboxCell) ((N2oSimpleColumn) table.getColumns()[0]).getCell();
        assert ((N2oInvokeAction)checkBoxCell.getAction()).getOperationId().equals("update");

        //проверяем цвет и иконку
        for (N2oSwitch object : Arrays.asList(((N2oColorCell) ((N2oSimpleColumn) table.getColumns()[1]).getCell()).getStyleSwitch(), ((N2oIconCell) ((N2oSimpleColumn) table.getColumns()[2]).getCell()).getIconSwitch())) {
            assert object.getFieldId().equals("id");
            assert object.getCases().get("key").equalsIgnoreCase("value");
            assert object.getDefaultCase().equals("test");
        }

        //провеяем link
        N2oLink linkCell = (N2oLink) ((N2oSimpleColumn) table.getColumns()[3]).getCell();
        assert ((N2oAnchor) linkCell.getAction()).getTarget().name().equals("newWindow");
        assert ((N2oAnchor) linkCell.getAction()).getHref().equals("https://www.google.ru/");

        N2oLink linkCell2 = (N2oLink) ((N2oSimpleColumn) table.getColumns()[4]).getCell();
        N2oAbstractPageAction openPage = (N2oOpenPage) linkCell2.getAction();
        assert openPage.getPageId().equals("test");
        assert openPage.getOperationId().equals("create");
        assert openPage.getMasterFieldId().equals("id");
        assert openPage.getDetailFieldId().equals("id");
        assert openPage.getContainerId().equals("test");
        assert openPage.getResultContainerId().equals("test");
        assert openPage.getRefreshOnClose().equals(true);
        assert openPage.getUpload().name().toLowerCase().equals("copy");
        assert openPage.getWidth().equals("100");
        assert openPage.getPreFilters()[0].getFieldId().equals("id");
        assert openPage.getPreFilters()[0].getTargetWidgetId().equals("test");
        assert openPage.getPreFilters()[0].getValue().equals("{test}");

        N2oLink linkCell3 = (N2oLink) ((N2oSimpleColumn) table.getColumns()[5]).getCell();
        N2oAbstractPageAction showModal = (N2oShowModal) linkCell3.getAction();

        assert showModal.getPageId().equals("test");
        assert showModal.getOperationId().equals("create");
        assert showModal.getMasterFieldId().equals("id");
        assert showModal.getDetailFieldId().equals("id");
        assert showModal.getContainerId().equals("test");
        assert showModal.getResultContainerId().equals("test");
        assert showModal.getRefreshOnClose().equals(true);
        assert showModal.getUpload().name().toLowerCase().equals("copy");
        assert showModal.getWidth().equals("100");
        assert showModal.getPreFilters()[0].getFieldId().equals("id");
        assert showModal.getPreFilters()[0].getTargetWidgetId().equals("test");
        assert showModal.getPreFilters()[0].getValue().equals("{test}");

        assert table.getFilterOpened().equals(true);
        assert table.getFilterPosition().name().toLowerCase().equals("left");
        assert ((N2oField)((N2oFieldSet)((N2oFieldSet)table.getFilters()[0]).getItems()[1]).getItems()[0]).getId().equals("id");

        assert table.getColumns()[0].getSortingDirection().toString().toLowerCase().equals("asc");

        assert table.getRows().getColor().getCases().get("key").equals("value");
        assert table.getRows().getColor().getDefaultCase().equals("test");
    }

    private void assertBaseTree(N2oTree tree) {
        assert tree.getAjax().equals(true);
    }

    protected void assertInheritanceTree(N2oTree tree) {
        assertBaseTree(tree);
        assert tree.getInheritanceNodes().getParentFieldId().equals("id");
        assert tree.getInheritanceNodes().getLabelFieldId().equals("id");
        assert tree.getInheritanceNodes().getHasChildrenFieldId().equals("id");
    }

    protected void assertGroupingNodesTree(N2oTree groupingNodesTree) {
        assertBaseTree(groupingNodesTree);
        List<GroupingNodes.Node> nodes = groupingNodesTree.getGroupingNodes().getNodes();
        for (int i = 0; i < 2; i++) {
            assert nodes.size() == 1;
            assert nodes.get(0).getLabelFieldId().equals("id");
            assert nodes.get(0).getValueFieldId().equals("id");
            nodes = nodes.get(0).getNodes();
        }
    }

    protected void assertCustomWidget(N2oCustomWidget custom) {
        assert custom.getSrc().equals("test");
        assert custom.getProperties().get("key").equals("value");
    }

    protected void assertRefWidget(N2oPage page) {
        assert page.getContainers().size() == 3;
        assert page.getContainers().get(0).getId().equals("form");
        assert page.getContainers().get(1).getId().equals("table");
        assert page.getContainers().get(2).getId().equals("tree");
        assert page.getContainers().get(0).getRefId().equals("testFormReader");
        assert page.getContainers().get(1).getRefId().equals("testTableReader");
        assert page.getContainers().get(2).getRefId().equals("testTreeReader1");
    }

}

