package net.n2oapp.framework.config.metadata.compile.control;

import net.n2oapp.framework.api.metadata.meta.control.AutoComplete;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import net.n2oapp.framework.api.metadata.meta.page.SimplePage;
import net.n2oapp.framework.api.metadata.meta.widget.form.Form;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * Тестирование компиляции компонента ввода текста с автоподбором
 */
public class AutoCompleteCompileTest extends SourceCompileTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.sources(new CompileInfo("net/n2oapp/framework/config/metadata/compile/field/testSelect.query.xml"));
        builder.packs(new N2oPagesPack(), new N2oWidgetsPack(), new N2oFieldSetsPack(),
                new N2oAllDataPack(), new N2oControlsV2IOPack());
        builder.compilers(new AutoCompleteCompiler());
    }

    @Test
    public void testAutoCompleteDataProvider() {
        SimplePage page = (SimplePage) compile("net/n2oapp/framework/config/metadata/compile/field/testAutoComplete.page.xml")
                .get(new PageContext("testAutoComplete"));
        Form form = (Form) page.getWidget();
        AutoComplete autoComplete = (AutoComplete) ((StandardField) form.getComponent().getFieldsets().get(0).getRows().get(0)
                .getCols().get(0).getFields().get(0)).getControl();
        assertThat(autoComplete.getSrc(), is("AutoComplete"));
        assertThat(autoComplete.getDataProvider().getUrl(), is("n2o/data/test"));
        assertThat(autoComplete.getDataProvider().getQuickSearchParam(), is("search"));
        assertThat(autoComplete.getPlaceholder(), is("`message`"));
        assertThat(autoComplete.getValueFieldId(), is("name"));
        assertThat(autoComplete.getTags(), is(true));

        autoComplete = (AutoComplete) ((StandardField) form.getComponent().getFieldsets().get(0).getRows().get(1)
                .getCols().get(0).getFields().get(0)).getControl();
        assertThat(autoComplete.getSrc(), is("AutoComplete"));
        assertThat(autoComplete.getData().get(0).get("name"), is("test1"));
        assertThat(autoComplete.getData().get(1).get("name"), is("test2"));
        assertThat(autoComplete.getValueFieldId(), is("name"));
        assertThat(autoComplete.getTags(), is(false));
        assertThat(autoComplete.getMaxTagTextLength(), is(15));
    }

}