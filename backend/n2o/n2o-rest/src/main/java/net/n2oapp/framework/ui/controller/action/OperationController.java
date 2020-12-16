package net.n2oapp.framework.ui.controller.action;

import net.n2oapp.criteria.dataset.DataSet;
import net.n2oapp.framework.api.MetadataEnvironment;
import net.n2oapp.framework.api.StringUtils;
import net.n2oapp.framework.api.exception.N2oException;
import net.n2oapp.framework.api.exception.SeverityType;
import net.n2oapp.framework.api.metadata.global.view.page.N2oDialog;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.meta.page.Dialog;
import net.n2oapp.framework.api.rest.ControllerType;
import net.n2oapp.framework.api.rest.SetDataResponse;
import net.n2oapp.framework.api.ui.ActionRequestInfo;
import net.n2oapp.framework.api.ui.ActionResponseInfo;
import net.n2oapp.framework.api.ui.ErrorMessageBuilder;
import net.n2oapp.framework.api.ui.ResponseMessage;
import net.n2oapp.framework.config.compile.pipeline.N2oPipelineSupport;
import net.n2oapp.framework.config.metadata.compile.context.ActionContext;
import net.n2oapp.framework.config.metadata.compile.context.DialogContext;
import net.n2oapp.framework.engine.data.N2oOperationProcessor;
import net.n2oapp.framework.engine.modules.stack.DataProcessingStack;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import static net.n2oapp.framework.config.register.route.RouteUtil.normalize;

/**
 * Вылняет действие(action) пришедшие с клиента
 */
@Controller
public class OperationController extends SetController {

    private ErrorMessageBuilder errorMessageBuilder;
    private static final Logger logger = LoggerFactory.getLogger(OperationController.class);
    private MetadataEnvironment environment;

    public OperationController(DataProcessingStack dataProcessingStack,
                               N2oOperationProcessor operationProcessor,
                               ErrorMessageBuilder errorMessageBuilder,
                               MetadataEnvironment environment) {
        super(dataProcessingStack, operationProcessor, environment);
        this.errorMessageBuilder = errorMessageBuilder;
        this.environment = environment;
    }


    @Override
    @SuppressWarnings("unchecked")
    public SetDataResponse execute(ActionRequestInfo requestInfo, ActionResponseInfo responseInfo) {
        return executeRequest(requestInfo, responseInfo);
    }

    protected SetDataResponse executeRequest(ActionRequestInfo<DataSet> requestInfo,
                                             ActionResponseInfo responseInfo) {
        try {
            DataSet data = handleActionRequest(requestInfo, responseInfo);
            return constructSuccessSetDataResponse(data, requestInfo, responseInfo);
        } catch (N2oException e) {
            SetDataResponse response = constructFailSetDataResponse(e, requestInfo);
            logger.error("Error response " + response.getStatus() + " " + e.getSeverity() + ": "
                    + (e.getUserMessage() != null ? e.getUserMessage() : e.getMessage()), e);
            return response;
        }
    }

    private SetDataResponse constructFailSetDataResponse(N2oException e, ActionRequestInfo<DataSet> requestInfo) {
        SetDataResponse response = new SetDataResponse();
        if (e.getDialog() != null) {
            response.setDialog(compileDialog(e.getDialog(), requestInfo));
        } else {
            if (requestInfo.isMessageOnFail()) {
                String widgetId = requestInfo.getFailAlertWidgetId() == null
                        ? requestInfo.getMessagesForm()
                        : requestInfo.getFailAlertWidgetId();
                response.addResponseMessages(errorMessageBuilder.buildMessages(e), widgetId);
            }
        }
        response.setStatus(e.getHttpStatus());
        return response;
    }


    private SetDataResponse constructSuccessSetDataResponse(DataSet data,
                                                            ActionRequestInfo<DataSet> requestInfo,
                                                            ActionResponseInfo responseInfo) {
        SetDataResponse response = new SetDataResponse();
        response.setResponseMessages(responseInfo.getMessageList(), requestInfo.getSuccessAlertWidgetId(), responseInfo.getStackedMessages());
        response.setData(data);
        if (responseInfo.getDialog() != null)
            response.setDialog(compileDialog(responseInfo.getDialog(), requestInfo));
        else if (requestInfo.isMessageOnSuccess())
            response.addResponseMessage(createSuccess(requestInfo.getOperation(), data), requestInfo.getSuccessAlertWidgetId());
        return response;
    }

    private ResponseMessage createSuccess(CompiledObject.Operation operation, DataSet data) {
        ResponseMessage message = new ResponseMessage();
        message.setSeverityType(SeverityType.success);
        message.setText(StringUtils.resolveLinks(operation.getSuccessText(), data));
        message.setData(data);
        return message;
    }

    private Dialog compileDialog(N2oDialog n2oDialog, ActionRequestInfo<DataSet> requestInfo) {
        String route = requestInfo.getContext().getRoute(null) + normalize(
                n2oDialog.getRoute() != null ? n2oDialog.getRoute() : n2oDialog.getId());
        DialogContext context = new DialogContext(route, n2oDialog.getId());
        context.setPathRouteMapping(requestInfo.getContext().getPathRouteMapping());
        context.setQueryRouteMapping(requestInfo.getContext().getQueryRouteMapping());
        context.setParentWidgetId(((ActionContext)requestInfo.getContext()).getSuccessAlertWidgetId());
        context.setObjectId(requestInfo.getObject() != null ? requestInfo.getObject().getId() : null);
        N2oPipelineSupport pipelineSupport = new N2oPipelineSupport(environment);
        Dialog dialog = environment.getCompilePipelineFunction()
                .apply(pipelineSupport)
                .get(n2oDialog, context);
        dialog = environment.getBindPipelineFunction().apply(pipelineSupport)
                .get(dialog, context, requestInfo.getQueryData());
        return dialog;
    }

    @Override
    public ControllerType getControllerType() {
        return ControllerType.operation;
    }

}
