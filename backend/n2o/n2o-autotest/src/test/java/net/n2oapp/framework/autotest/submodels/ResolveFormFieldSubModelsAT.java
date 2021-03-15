package net.n2oapp.framework.autotest.submodels;

import net.n2oapp.framework.autotest.N2oSelenide;
import net.n2oapp.framework.autotest.api.collection.Fields;
import net.n2oapp.framework.autotest.api.component.button.StandardButton;
import net.n2oapp.framework.autotest.api.component.control.InputSelect;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.api.component.widget.FormWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.N2oAllDataPack;
import net.n2oapp.framework.config.metadata.pack.N2oAllPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oHeaderPack;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Проверка разрешения сабмоделей в полях формы
 */
public class ResolveFormFieldSubModelsAT extends AutoTestBase {

    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oAllPagesPack(), new N2oHeaderPack(), new N2oAllDataPack());
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/submodels/form_fields/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/submodels/form_fields/new_page.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/submodels/form_fields/type.query.xml"));
    }

    //todo временно отключен тест, необходимо исправить
    @Test
    public void resolveTableFiltersSubModels() {
        SimplePage page = open(SimplePage.class);
        page.shouldExists();
        FormWidget form = page.widget(FormWidget.class);
        form.shouldExists();
        StandardButton openBtn = form.toolbar().topLeft().button("Open");
        openBtn.shouldExists();
        openBtn.click();

        SimplePage newPage = N2oSelenide.page(SimplePage.class);
        newPage.shouldExists();
        Fields fields = newPage.widget(FormWidget.class).fields();
        InputSelect genderField = fields.field("Gender").control(InputSelect.class);
        genderField.shouldExists();
        genderField.shouldSelected("Men");
        InputSelect typeField = fields.field("Type").control(InputSelect.class);
        typeField.shouldExists();
        typeField.shouldSelected("type2");
    }
}