package net.n2oapp.framework.autotest.control;

import net.n2oapp.framework.autotest.api.component.control.NumberPicker;
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
 * Автотест компонента ввода числа из диапазона
 */
public class NumberPickerAT extends AutoTestBase {

    private SimplePage page;

    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();

        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/control/number_picker/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"));

        page = open(SimplePage.class);
        page.shouldExists();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oHeaderPack(), new N2oWidgetsPack(), new N2oFieldSetsPack(), new N2oControlsPack());
    }

    @Test
    public void testNumberPicker() {
        NumberPicker numberPicker = page.widget(FormWidget.class).fields().field("limitedPicker").control(NumberPicker.class);
        numberPicker.shouldExists();
        numberPicker.shouldBeEnabled();
        numberPicker.minShouldBe("1");
        numberPicker.maxShouldBe("6");
        numberPicker.stepShouldBe("2");

        numberPicker.shouldHaveValue("4");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("6");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("6");
        numberPicker.clickMinusStepButton();
        numberPicker.shouldHaveValue("4");
        numberPicker.val("2");
        numberPicker.shouldHaveValue("2");
        numberPicker.clickMinusStepButton();
        numberPicker.shouldHaveValue("1");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("3");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("5");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("6");

        numberPicker = page.widget(FormWidget.class).fields().field("defaultPicker").control(NumberPicker.class);
        numberPicker.shouldExists();
        numberPicker.shouldBeEnabled();
        numberPicker.minShouldBe("0");
        numberPicker.maxShouldBe("100");
        numberPicker.stepShouldBe("1");

        numberPicker.shouldHaveValue("0");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("1");
        numberPicker.clickPlusStepButton();
        numberPicker.shouldHaveValue("2");
        numberPicker.clickMinusStepButton();
        numberPicker.shouldHaveValue("1");
    }

}