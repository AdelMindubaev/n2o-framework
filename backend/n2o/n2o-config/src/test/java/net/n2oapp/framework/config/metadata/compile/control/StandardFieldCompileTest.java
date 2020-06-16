package net.n2oapp.framework.config.metadata.compile.control;

import net.n2oapp.framework.api.data.validation.ConditionValidation;
import net.n2oapp.framework.api.data.validation.ConstraintValidation;
import net.n2oapp.framework.api.data.validation.MandatoryValidation;
import net.n2oapp.framework.api.data.validation.Validation;
import net.n2oapp.framework.api.exception.SeverityType;
import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.dataprovider.N2oSqlDataProvider;
import net.n2oapp.framework.api.metadata.global.dao.object.MapperType;
import net.n2oapp.framework.api.metadata.global.dao.validation.N2oValidation;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.meta.ClientDataProvider;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import net.n2oapp.framework.api.metadata.meta.action.invoke.InvokeAction;
import net.n2oapp.framework.api.metadata.meta.control.Field;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import net.n2oapp.framework.api.metadata.meta.control.ValidationType;
import net.n2oapp.framework.api.metadata.meta.page.SimplePage;
import net.n2oapp.framework.api.metadata.meta.widget.RequestMethod;
import net.n2oapp.framework.api.metadata.meta.widget.form.Form;
import net.n2oapp.framework.api.metadata.meta.widget.toolbar.Group;
import net.n2oapp.framework.api.metadata.meta.widget.toolbar.PerformButton;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.context.ActionContext;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.compile.context.WidgetContext;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

/**
 * Тестирование компиляции стандартного поля
 */
public class StandardFieldCompileTest extends SourceCompileTestBase {

    private Form form;

    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();

        form = (Form) compile("net/n2oapp/framework/config/mapping/testStandardField.widget.xml")
                .get(new WidgetContext("testStandardField"));
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oWidgetsPack(), new N2oFieldSetsPack(), new N2oControlsV2IOPack(),
                new N2oAllDataPack(), new N2oActionsPack());
        builder.compilers(new InputTextCompiler());
        builder.sources(new CompileInfo("net/n2oapp/framework/config/mapping/testCell.object.xml"));
    }

    @Test
    public void testDependencies() {
        Field field = form.getComponent().getFieldsets().get(0).getRows().get(0).getCols().get(0).getFields().get(0);
        assertThat(field.getDependencies().size(), is(10));

        assertThat(field.getDependencies().get(0).getExpression(), is("test1 == null"));
        assertThat(field.getDependencies().get(0).getOn().get(0), is("test1"));
        assertThat(field.getDependencies().get(0).getType(), is(ValidationType.enabled));

        assertThat(field.getDependencies().get(1).getExpression(), is("test2 == null"));
        assertThat(field.getDependencies().get(1).getOn().get(0), is("test2"));
        assertThat(field.getDependencies().get(1).getType(), is(ValidationType.required));

        assertThat(field.getDependencies().get(2).getExpression(), is("test3 == null"));
        assertThat(field.getDependencies().get(2).getOn().get(0), is("test3"));
        assertThat(field.getDependencies().get(2).getType(), is(ValidationType.reset));
        assertThat(field.getDependencies().get(3).getExpression(), is("test3 == null"));
        assertThat(field.getDependencies().get(3).getOn().get(0), is("test3"));
        assertThat(field.getDependencies().get(3).getType(), is(ValidationType.visible));

        assertThat(field.getDependencies().get(4).getExpression(), is("test4 == null"));
        assertThat(field.getDependencies().get(4).getOn().get(0), is("test4"));
        assertThat(field.getDependencies().get(4).getType(), is(ValidationType.visible));

        assertThat(field.getDependencies().get(5).getExpression(), is("test5 == null"));
        assertThat(field.getDependencies().get(5).getOn().get(0), is("test5"));
        assertThat(field.getDependencies().get(5).getType(), is(ValidationType.visible));

        assertThat(field.getDependencies().get(6).getOn().get(0), is("test6"));
        assertThat(field.getDependencies().get(6).getExpression(), is("test6 == null"));
        assertThat(field.getDependencies().get(6).getType(), is(ValidationType.reset));

        assertThat(field.getDependencies().get(7).getOn().get(0), is("test7"));
        assertThat(field.getDependencies().get(7).getExpression(), is("true"));
        assertThat(field.getDependencies().get(7).getType(), is(ValidationType.reset));

        assertThat(field.getDependencies().get(8).getOn().get(0), is("test8"));
        assertThat(field.getDependencies().get(8).getExpression(), is("(function(){if (test8 == 1) return \"Test\";})()"));
        assertThat(field.getDependencies().get(8).getType(), is(ValidationType.setValue));

        assertThat(field.getDependencies().get(9).getOn().get(0), is("test9"));
        assertThat(field.getDependencies().get(9).getExpression(), is("test9 == null"));
        assertThat(field.getDependencies().get(9).getType(), is(ValidationType.fetch));
    }

    @Test
    public void testToolbar() {
        Group[] toolbar = form.getComponent().getFieldsets().get(0).getRows().get(0).getCols().get(1).getFields().get(0)
                .getToolbar();

        assertThat(toolbar.length, is(1));
        PerformButton button = (PerformButton) toolbar[0].getButtons().get(0);
        assertThat(button.getClassName(), is("class"));
        assertThat(button.getIcon(), is("icon"));
        assertThat(button.getLabel(), is("Button"));
        assertThat(button.getStyle().size(), is(1));
        assertThat(button.getStyle().get("color"), is("red"));
        assertThat(button.getClassName(), is("class"));
        assertThat(button.getAction(), instanceOf(InvokeAction.class));
        InvokeAction action = (InvokeAction) button.getAction();
        assertThat(action.getOperationId(), is("update"));
        assertThat(action.getPayload().getModelLink(), is("models.filter['$testStandardField']"));
    }

    @Test
    public void testValidations() {
        Field field = form.getComponent().getFieldsets().get(0).getRows().get(0).getCols().get(2).getFields().get(0);

        List<Validation> clientValidations = field.getClientValidations();
        assertThat(clientValidations.size(), is(2));

        ConstraintValidation validation = (ConstraintValidation) clientValidations.get(0);
        assertThat(validation.getId(), is("val1"));
        assertThat(validation.getMessage(), is("Message"));
        assertThat(validation.getSeverity(), is(SeverityType.danger));
        assertThat(validation.getSide(), is("client"));
        assertThat(validation.getMoment(), is(N2oValidation.ServerMoment.beforeOperation));
        assertThat(validation.getRequiredFields().size(), is(1));
        assertThat(validation.getRequiredFields().contains("param"), is(true));
        assertThat(validation.getInvocation(), instanceOf(N2oSqlDataProvider.class));
        assertThat(((N2oSqlDataProvider) validation.getInvocation()).getQuery(), is("select * from table"));
        assertThat(validation.getInParameterList().size(), is(1));
        assertThat(validation.getInParameterList().get(0).getDomain(), is("boolean"));
        assertThat(validation.getInParameterList().get(0).getRequired(), is(true));
        assertThat(validation.getInParameterList().get(0).getMapper(), is(MapperType.dataset));
        assertThat(validation.getInParameterList().get(0).getMapping(), is("mapping"));
        assertThat(validation.getInParameterList().get(0).getNormalize(), is("normalize"));

        ConditionValidation validation2 = (ConditionValidation) clientValidations.get(1);
        assertThat(validation2.getId(), is("val2"));
        assertThat(validation2.getMessage(), is("Message"));
        assertThat(validation2.getSeverity(), is(SeverityType.warning));
        assertThat(validation2.getSide(), is("client,server"));


        List<Validation> serverValidations = field.getServerValidations();
        assertThat(serverValidations.size(), is(3));

        assertThat(serverValidations.get(0), is(validation));
        assertThat(serverValidations.get(1), is(validation2));
        MandatoryValidation validation3 = (MandatoryValidation) serverValidations.get(2);
        assertThat(validation3.getId(), is("val3"));
        assertThat(validation3.getMessage(), is("Message"));
        assertThat(validation3.getSeverity(), is(SeverityType.danger));
        assertThat(validation3.getEnabled(), is(false));
        assertThat(validation3.getSide(), is("server"));
    }

    @Test
    public void testSubmit() {
        SimplePage page = (SimplePage) compile("net/n2oapp/framework/config/mapping/testStandardFieldSubmit.page.xml")
                .get(new PageContext("testStandardFieldSubmit"));
        Field field = ((Form) page.getWidget()).getComponent().getFieldsets().get(0).getRows().get(0).getCols().get(0).getFields().get(0);

        ActionContext context = (ActionContext) route("/testStandardFieldSubmit/:testStandardFieldSubmit_form_id/a/b/c", CompiledObject.class);
        assertThat(context, notNullValue());
        assertThat(context.getOperationId(), is("update"));
        assertThat(context.isMessageOnFail(), is(true));
        assertThat(context.isMessageOnSuccess(), is(false));
        assertThat(context.getSuccessAlertWidgetId(), is("form"));
        assertThat(context.getFailAlertWidgetId(), is("form"));

        ClientDataProvider dataProvider = ((StandardField) field).getDataProvider();
        assertThat(dataProvider.getMethod(), is(RequestMethod.POST));
        assertThat(dataProvider.getSubmitForm(), is(false));
        assertThat(dataProvider.getUrl(), is("n2o/data/testStandardFieldSubmit/:testStandardFieldSubmit_form_id/a/b/c"));

        assertThat(dataProvider.getPathMapping().size(), is(3));
        ModelLink link = dataProvider.getPathMapping().get("name1");
        assertThat(link.getValue(), is("value1"));
        assertThat(link.getModel(), nullValue());
        assertThat(link.getWidgetId(), nullValue());
        assertThat(link.getBindLink(), nullValue());
        link = dataProvider.getPathMapping().get("name2");
        assertThat(link.getValue(), nullValue());
        assertThat(link.getModel(), is(ReduxModel.FILTER));
        assertThat(link.getWidgetId(), is("testStandardFieldSubmit_id2"));
        assertThat(link.getBindLink(), is("models.filter['testStandardFieldSubmit_id2']"));
        link = dataProvider.getPathMapping().get("testStandardFieldSubmit_form_id");
        assertThat(link.getValue(), nullValue());
        assertThat(link.getModel(), is(ReduxModel.RESOLVE));
        assertThat(link.getWidgetId(), is("testStandardFieldSubmit_form"));
        assertThat(link.getBindLink(), is("models.resolve['testStandardFieldSubmit_form'].id"));

        assertThat(dataProvider.getHeadersMapping().size(), is(1));
        link = dataProvider.getHeadersMapping().get("name3");
        assertThat(link.getValue(), is("`a`"));
        assertThat(link.getModel(), is(ReduxModel.RESOLVE));
        assertThat(link.getWidgetId(), is("testStandardFieldSubmit_id3"));
        assertThat(link.getBindLink(), is("models.resolve['testStandardFieldSubmit_id3']"));

        assertThat(dataProvider.getFormMapping().size(), is(1));
        link = dataProvider.getFormMapping().get("name4");
        assertThat(link.getValue(), is("`b`"));
        assertThat(link.getModel(), is(ReduxModel.FILTER));
        assertThat(link.getWidgetId(), is("testStandardFieldSubmit_form"));
        assertThat(link.getBindLink(), is("models.filter['testStandardFieldSubmit_form']"));
    }
}
