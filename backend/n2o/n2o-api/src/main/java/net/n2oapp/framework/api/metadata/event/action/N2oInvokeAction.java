package net.n2oapp.framework.api.metadata.event.action;

import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.global.dao.N2oFormParam;
import net.n2oapp.framework.api.metadata.global.dao.N2oParam;
import net.n2oapp.framework.api.metadata.global.view.action.control.RefreshPolity;
import net.n2oapp.framework.api.metadata.global.view.action.control.Target;
import net.n2oapp.framework.api.metadata.meta.widget.RequestMethod;


/**
 * Действие вызова операции
 */
@Getter
@Setter
public class N2oInvokeAction extends N2oAbstractAction {
    private String operationId;
    private String objectId;
    private Boolean closeOnSuccess;
    private Boolean doubleCloseOnSuccess;
    private Boolean closeOnFail;
    private Boolean refreshOnSuccess;
    private String confirmationText;
    private String bulkConfirmationText;
    @Deprecated private RefreshPolity refreshPolity;
    private String route;
    private String redirectUrl;
    private Target redirectTarget;
    private String refreshWidgetId;
    private Boolean messageOnSuccess;
    private Boolean messageOnFail;
    private Boolean optimistic;
    private Boolean submitForm;
    private RequestMethod method;

    private N2oFormParam[] formParams;
    private N2oParam[] pathParams;
    private N2oParam[] headerParams;

    public N2oInvokeAction() {
    }

    public N2oInvokeAction(String actionId) {
        this.operationId = actionId;
    }

}
