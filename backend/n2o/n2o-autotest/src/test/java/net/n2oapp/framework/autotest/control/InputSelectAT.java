package net.n2oapp.framework.autotest.control;

import net.n2oapp.framework.autotest.Colors;
import net.n2oapp.framework.autotest.api.component.control.InputSelect;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.api.component.widget.FormWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
/**
 * Автотест компонента ввода текста с выбором из выпадающего списка
 */
public class InputSelectAT extends AutoTestBase {


    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();

        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"));
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oHeaderPack(), new N2oWidgetsPack(),
                new N2oFieldSetsPack(), new N2oControlsPack(), new N2oAllDataPack());
    }

    @Test
    public void testSingle() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/input_select/simple/index.page.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        InputSelect input = page.widget(FormWidget.class).fields().field("InputSelect")
                .control(InputSelect.class);
        input.shouldExists();

        input.shouldBeEmpty();
        input.shouldHaveOptions("One", "Two", "Three");
        input.select(1);
        input.shouldSelected("Two");
        input.clear();
        input.shouldBeEmpty();

        input.val("Three");
        input.shouldHaveValue("Three");
        input.collapsePopUpOptions();

        input = page.widget(FormWidget.class).fields().field("InputSelect1")
                .control(InputSelect.class);
        input.itemShouldBeEnabled(true, "One");
        input.itemShouldBeEnabled(true, "Two");
        input.itemShouldBeEnabled(false, "Three");
        input.itemShouldBeEnabled(true, "Four");
    }

    @Test
    public void testColorStatus() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/input_select/simple/index.page.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        InputSelect input = page.widget(FormWidget.class).fields().field("InputSelect2")
                .control(InputSelect.class);
        input.shouldExists();

        input.itemShouldHaveStatusColor("One", Colors.SUCCESS);
        input.itemShouldHaveStatusColor("Two", Colors.PRIMARY);
        input.itemShouldHaveStatusColor("Three", Colors.DANGER);
    }

    @Test
    public void testMulti() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/input_select/multi/index.page.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        InputSelect input = page.widget(FormWidget.class).fields().field("InputSelect")
                .control(InputSelect.class);
        input.shouldExists();

        input.shouldBeEmpty();
        input.shouldHaveOptions("One", "Two", "Three");
        input.selectMulti(1, 2);
        input.shouldSelectedMulti("Two", "Three");
        input.clear();
        input.shouldBeEmpty();

        input.selectMulti(2, 1, 0);
        input.shouldSelectedMulti("Three", "Two", "One");

        // удаление выбранных значений
        input.clearItems("Three");
        input.shouldSelectedMulti("Two", "One");
        input.clearItems("Two", "One");
        input.shouldBeEmpty();
    }

    @Test
    public void testCheckboxes() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/input_select/checkboxes/index.page.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        InputSelect input = page.widget(FormWidget.class).fields().field("InputSelect")
                .control(InputSelect.class);
        input.shouldExists();

        input.shouldBeEmpty();
        input.shouldHaveOptions("One", "Two", "Three");
        input.selectMulti(1, 2);
        input.shouldSelectedMulti("Two", "Three");
        input.clear();
        input.shouldBeEmpty();

        input.selectMulti(2, 1, 0);
        input.shouldSelectedMulti("Three", "Two", "One");

        // удаление выбранных значений
        input.clearItems("Three");
        input.shouldSelectedMulti("Two", "One");
        input.clearItems("Two", "One");
        input.shouldBeEmpty();

        input.collapsePopUpOptions();
        input = page.widget(FormWidget.class).fields().field("InputSelect3")
                .control(InputSelect.class);
        input.itemShouldBeEnabled(true, "One");
        input.itemShouldBeEnabled(true, "Two");
        input.itemShouldBeEnabled(false, "Three");
        input.itemShouldBeEnabled(true, "Four");
    }

    @Test
    public void testReadFromQuery() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/input_select/query/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/control/input_select/query/test.query.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        InputSelect input = page.widget(FormWidget.class).fields().field("InputSelect1")
                .control(InputSelect.class);
        input.shouldExists();

        input.shouldBeEmpty();
        input.shouldHaveOptions("name1", "name2", "name3");
        input.optionShouldHaveDescription("name1", "desc1");
        input.optionShouldHaveDescription("name3", "desc3");
        input.select(1);
        input.shouldSelected("name2");
        input.clear();
        input.shouldBeEmpty();
        input.val("name3");
        input.shouldHaveValue("name3");
        // сворачиваем popup, чтобы не накладывался на нижний контрол
        input.collapsePopUpOptions();


        InputSelect input2 = page.widget(FormWidget.class).fields().field("InputSelect2")
                .control(InputSelect.class);
        input2.shouldExists();

        input2.shouldBeEmpty();
        input2.optionShouldHaveDescription("name1", "desc1");
        input2.optionShouldHaveDescription("name3", "desc3");
        input2.shouldHaveOptions("name1", "name2", "name3");
        input2.selectMulti(1, 2);
        input2.shouldSelectedMulti("name2", "name3");
        input2.clear();
        input2.shouldBeEmpty();
    }
}
