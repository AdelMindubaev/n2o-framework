package net.n2oapp.framework.config.io.action;

import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.event.action.N2oInvokeAction;
import net.n2oapp.framework.api.metadata.global.dao.N2oParam;
import net.n2oapp.framework.api.metadata.global.view.action.control.Target;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import org.jdom.Element;
import org.springframework.stereotype.Component;

/**
 * Чтение/запись выполнения действия объекта
 */
@Component
public class InvokeActionElementIOV1 extends AbstractActionElementIOV1<N2oInvokeAction> {
    @Override
    public void io(Element e, N2oInvokeAction ia, IOProcessor p) {
        super.io(e, ia, p);
        p.attribute(e, "operation-id", ia::getOperationId, ia::setOperationId);
        p.attribute(e,"route", ia::getRoute, ia::setRoute);
        p.read(e, ia, (el, md) -> {
            if (el.getAttribute("close-after-success") != null) {
                p.attributeBoolean(e, "close-after-success", ia::getCloseOnSuccess, ia::setCloseOnSuccess);
            }
        });
        p.attributeBoolean(e, "close-on-success", ia::getCloseOnSuccess, ia::setCloseOnSuccess);
        p.attribute(e,"refresh-widget-id", ia::getRefreshWidgetId, ia::setRefreshWidgetId);
        p.attributeBoolean(e, "refresh-on-success", ia::getRefreshOnSuccess, ia::setRefreshOnSuccess);
        p.attribute(e, "redirect-url", ia::getRedirectUrl, ia::setRedirectUrl);
        p.attributeEnum(e, "redirect-target", ia::getRedirectTarget, ia::setRedirectTarget, Target.class);
        p.attributeBoolean(e, "message-on-success", ia::getMessageOnSuccess, ia::setMessageOnSuccess);
        p.attributeBoolean(e, "message-on-fail", ia::getMessageOnFail, ia::setMessageOnFail);
        p.attributeBoolean(e, "optimistic", ia::getOptimistic, ia::setOptimistic);
        p.attributeBoolean(e, "submit-form", ia::getSubmitForm, ia::setSubmitForm);

        p.children(e, null, "form-param", ia::getFormParams, ia::setFormParams, N2oParam::new, this::param);
        p.children(e, null, "path-param", ia::getPathParams, ia::setPathParams, N2oParam::new, this::param);
        p.children(e, null, "header-param", ia::getHeaderParams, ia::setHeaderParams, N2oParam::new, this::param);
    }

    @Override
    public String getElementName() {
        return "invoke";
    }

    @Override
    public Class<N2oInvokeAction> getElementClass() {
        return N2oInvokeAction.class;
    }

    private void param(Element e, N2oParam param, IOProcessor p) {
        p.attribute(e, "name", param::getName, param::setName);
        p.attribute(e, "value", param::getValue, param::setValue);
        p.attribute(e, "ref-widget-id", param::getRefWidgetId, param::setRefWidgetId);
        p.attributeEnum(e, "ref-model", param::getRefModel, param::setRefModel, ReduxModel.class);
    }
}