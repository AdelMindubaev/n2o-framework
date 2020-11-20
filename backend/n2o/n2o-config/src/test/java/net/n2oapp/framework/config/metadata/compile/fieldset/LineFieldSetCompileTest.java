package net.n2oapp.framework.config.metadata.compile.fieldset;

import net.n2oapp.framework.api.metadata.meta.fieldset.FieldSet;
import net.n2oapp.framework.api.metadata.meta.fieldset.LineFieldSet;
import net.n2oapp.framework.api.metadata.meta.widget.form.Form;
import net.n2oapp.framework.api.metadata.meta.widget.form.FormWidgetComponent;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.io.fieldset.ColElementIO4;
import net.n2oapp.framework.config.io.fieldset.LineFieldsetElementIOv4;
import net.n2oapp.framework.config.io.fieldset.RowElementIO4;
import net.n2oapp.framework.config.io.fieldset.SetFieldsetElementIOv4;
import net.n2oapp.framework.config.metadata.compile.context.WidgetContext;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * Тест филсета с горизонтальной линией
 */
public class LineFieldSetCompileTest extends SourceCompileTestBase {

    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oWidgetsPack(), new N2oFieldSetsPack())
                .ios(new LineFieldsetElementIOv4());
    }

    @Test
    public void testLineFieldSetWithField() {
        Form form = (Form) compile("net/n2oapp/framework/config/metadata/compile/fieldset/testLineFieldsetCompile.widget.xml")
                .get(new WidgetContext("testLineFieldsetCompile"));
        List<FieldSet> fields = form.getComponent().getFieldsets();
        assertThat(fields.size(), is(2));

        assertThat(fields.get(0), instanceOf(LineFieldSet.class));
        assertThat(fields.get(1), instanceOf(LineFieldSet.class));

        assertThat(fields.get(0).getSrc(), is("LineFieldset"));
        assertThat(((LineFieldSet)fields.get(0)).getLabel(), is(nullValue()));
        assertThat(((LineFieldSet)fields.get(0)).getCollapsible(), is(true));
        assertThat(((LineFieldSet)fields.get(0)).getHasSeparator(), is(true));
        assertThat(((LineFieldSet)fields.get(0)).getExpand(), is(true));

        assertThat(fields.get(1).getSrc(), is("testLine"));
        assertThat(((LineFieldSet)fields.get(0)).getLabel(), is("test"));
        assertThat(((LineFieldSet)fields.get(0)).getCollapsible(), is(false));
        assertThat(((LineFieldSet)fields.get(0)).getHasSeparator(), is(false));
        assertThat(((LineFieldSet)fields.get(0)).getExpand(), is(false));
    }

}
