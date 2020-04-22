package net.n2oapp.framework.config.metadata.compile.action;

import net.n2oapp.framework.api.exception.N2oException;
import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.aware.ModelAware;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.dataprovider.N2oClientDataProvider;
import net.n2oapp.framework.api.metadata.event.action.N2oInvokeAction;
import net.n2oapp.framework.api.metadata.global.dao.object.N2oObject;
import net.n2oapp.framework.api.metadata.global.view.action.control.Target;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.local.util.StrictMap;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import net.n2oapp.framework.api.metadata.meta.action.invoke.InvokeAction;
import net.n2oapp.framework.api.metadata.meta.action.invoke.InvokeActionPayload;
import net.n2oapp.framework.api.metadata.meta.saga.AsyncMetaSaga;
import net.n2oapp.framework.api.metadata.meta.saga.MetaSaga;
import net.n2oapp.framework.api.metadata.meta.saga.RedirectSaga;
import net.n2oapp.framework.api.metadata.meta.saga.RefreshSaga;
import net.n2oapp.framework.api.metadata.meta.widget.RequestMethod;
import net.n2oapp.framework.config.metadata.compile.ComponentScope;
import net.n2oapp.framework.config.metadata.compile.ParentRouteScope;
import net.n2oapp.framework.config.metadata.compile.ValidationList;
import net.n2oapp.framework.config.metadata.compile.context.ActionContext;
import net.n2oapp.framework.config.metadata.compile.context.DialogContext;
import net.n2oapp.framework.config.metadata.compile.context.ModalPageContext;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.compile.dataprovider.ClientDataProviderUtil;
import net.n2oapp.framework.config.metadata.compile.page.PageScope;
import net.n2oapp.framework.config.metadata.compile.redux.Redux;
import net.n2oapp.framework.config.metadata.compile.widget.WidgetScope;
import net.n2oapp.framework.config.register.route.RouteUtil;
import org.springframework.stereotype.Component;

import java.util.Map;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;
import static net.n2oapp.framework.config.register.route.RouteUtil.absolute;

/**
 * Сборка действия вызова операции
 */
@Component
public class InvokeActionCompiler extends AbstractActionCompiler<InvokeAction, N2oInvokeAction> {
    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oInvokeAction.class;
    }

    @Override
    public InvokeAction compile(N2oInvokeAction source, CompileContext<?, ?> context, CompileProcessor p) {
        InvokeAction invokeAction = new InvokeAction();
        compileAction(invokeAction, source, p);
        invokeAction.setOperationId(source.getOperationId());
        invokeAction.setType(p.resolve(property("n2o.api.action.invoke.type"), String.class));
        String targetWidgetId = initTargetWidget(source, context, p);
        ReduxModel targetWidgetModel = ReduxModel.RESOLVE;
        ComponentScope componentScope = p.getScope(ComponentScope.class);
        if (componentScope != null) {
            ModelAware modelAware = componentScope.unwrap(ModelAware.class);
            if (modelAware != null && modelAware.getModel() != null) {
                targetWidgetModel = modelAware.getModel();
            }
        }
        ParentRouteScope routeScope = p.getScope(ParentRouteScope.class);
        WidgetScope widgetScope = p.getScope(WidgetScope.class);
        String currentWidgetId = widgetScope == null ? targetWidgetId : widgetScope.getClientWidgetId();
        String modalLink = Redux.createBindLink(targetWidgetId, targetWidgetModel).getBindLink();
        invokeAction.getPayload().setModelLink(modalLink);
        invokeAction.getMeta()
                .setSuccess(initSuccessMeta(invokeAction, source, context, p, targetWidgetId, currentWidgetId, routeScope));
        invokeAction.getMeta().setFail(initFailMeta(invokeAction, source, context, p, currentWidgetId));
        invokeAction.getPayload().setWidgetId(targetWidgetId);
        if (widgetScope == null) {
            PageScope pageScope = p.getScope(PageScope.class);
            invokeAction.getPayload().setPageId(pageScope.getPageId());
        }

        initDataProvider(invokeAction, source, context, p, targetWidgetModel, routeScope);
        return invokeAction;
    }

    private MetaSaga initFailMeta(InvokeAction invokeAction, N2oInvokeAction source,
                                  CompileContext<?, ?> context, CompileProcessor p,
                                  String currentWidgetId) {
        MetaSaga metaSaga = new MetaSaga();
        metaSaga.setMessageWidgetId(currentWidgetId);
        boolean closeOnFail = p.cast(source.getCloseOnFail(), false);
        if (closeOnFail) {
            if (context instanceof ModalPageContext || context instanceof DialogContext)
                metaSaga.setModalsToClose(1);
        }
        return metaSaga;
    }

    private MetaSaga initSuccessMeta(InvokeAction invokeAction, N2oInvokeAction source,
                                     CompileContext<?, ?> context, CompileProcessor p, String targetWidgetId,
                                     String currentWidgetId, ParentRouteScope routeScope) {
        MetaSaga meta = new MetaSaga();
        boolean refresh = p.cast(source.getRefreshOnSuccess(), true);
        boolean redirect = source.getRedirectUrl() != null;
        boolean doubleCloseOnSuccess = p.cast(source.getDoubleCloseOnSuccess(), false);
        boolean closeOnSuccess = doubleCloseOnSuccess || p.cast(source.getCloseOnSuccess(), false);
        String messageWidgetId = currentWidgetId;
        if ((closeOnSuccess) && (context instanceof PageContext)) {
            messageWidgetId = ((PageContext) context).getParentClientWidgetId();
        }
        meta.setMessageWidgetId(messageWidgetId);
        if (closeOnSuccess) {
            if (context instanceof ModalPageContext || context instanceof DialogContext)
                meta.setModalsToClose(doubleCloseOnSuccess ? 2 : 1);
            else if (!redirect) {
                String backRoute;
                if (context instanceof PageContext) {
                    backRoute = ((PageContext) context).getParentRoute();
                } else {
                    backRoute = "/";
                }
                meta.setRedirect(new RedirectSaga());
                meta.getRedirect().setPath(backRoute);
                meta.getRedirect().setTarget(Target.application);
            }
        }
        if (refresh) {
            meta.setRefresh(new RefreshSaga());
            meta.getRefresh().setType(RefreshSaga.Type.widget);
            String refreshWidgetId = messageWidgetId;
            if (source.getRefreshWidgetId() != null) {
                PageScope pageScope = p.getScope(PageScope.class);
                refreshWidgetId = pageScope == null ? source.getRefreshWidgetId() : pageScope.getGlobalWidgetId(source.getRefreshWidgetId());
            } else {
                if ((closeOnSuccess) && (context instanceof PageContext) && ((PageContext) context).getRefreshClientWidgetId() != null) {
                    refreshWidgetId = ((PageContext) context).getRefreshClientWidgetId();
                }
            }
            meta.getRefresh().getOptions().setWidgetId(refreshWidgetId);
        }
        if (redirect) {
            if (context instanceof ModalPageContext || context instanceof DialogContext)
                meta.setModalsToClose(doubleCloseOnSuccess ? 2 : 1);
            meta.setRedirect(new RedirectSaga());

            meta.getRedirect().setPath(absolute(source.getRedirectUrl(), routeScope != null ? routeScope.getUrl() : null));
            meta.getRedirect().setTarget(source.getRedirectTarget());
            meta.getRedirect().setServer(true);
        }
        return meta;
    }


    private void initDataProvider(InvokeAction invokeAction, N2oInvokeAction source,
                                  CompileContext<?, ?> context, CompileProcessor p,
                                  ReduxModel model, ParentRouteScope routeScope) {
        InvokeActionPayload payload = invokeAction.getPayload();
        AsyncMetaSaga metaSaga = invokeAction.getMeta();
        N2oClientDataProvider dataProvider = new N2oClientDataProvider();
        dataProvider.setOptimistic(p.cast(source.getOptimistic(), p.resolve(property("n2o.api.action.invoke.optimistic"), Boolean.class)));
        dataProvider.setModel(model);
        dataProvider.setTargetWidgetId(invokeAction.getPayload().getWidgetId());
        dataProvider.setId(source.getId());
        dataProvider.setPathParams(source.getPathParams());
        dataProvider.setFormParams(source.getFormParams());
        dataProvider.setHeaderParams(source.getHeaderParams());
        dataProvider.setMethod(RequestMethod.POST);
        dataProvider.setUrl(source.getRoute());
        dataProvider.setSubmitForm(p.cast(source.getSubmitForm(), true));
        payload.setDataProvider(ClientDataProviderUtil.compile(dataProvider, context, p));
        CompiledObject compiledObject = p.getScope(CompiledObject.class);
        if (compiledObject == null)
            throw new N2oException("For compilation action [{0}] is necessary object!").addData(source.getId());
        invokeAction.setObjectId(compiledObject.getId());
        ValidationList validationList = p.getScope(ValidationList.class);
        ActionContext actionContext = new ActionContext(compiledObject.getId(), source.getOperationId(),
                payload.getDataProvider().getUrl().replaceFirst(p.resolve(property("n2o.config.data.route"), String.class), ""));

        Map<String, ModelLink> routePathMapping = new StrictMap<>();
        Map<String, ModelLink> routeQueryMapping = new StrictMap<>();
        if (routeScope != null) {
            routePathMapping.putAll(routeScope.getPathMapping());
            routePathMapping.putAll(payload.getDataProvider().getPathMapping());
            routeQueryMapping.putAll(routeScope.getQueryMapping());
        }
        actionContext.setPathRouteMapping(routePathMapping);
        actionContext.setQueryRouteMapping(routeQueryMapping);
        actionContext.setValidations(validationList == null ? null : validationList.get(metaSaga.getFail().getMessageWidgetId(), model));
        actionContext.setRedirect(initServerRedirect(metaSaga));
        actionContext.setParentWidgetId(invokeAction.getPayload().getWidgetId());
        actionContext.setFailAlertWidgetId(metaSaga.getFail().getMessageWidgetId());
        actionContext.setMessagesForm(metaSaga.getFail().getMessageWidgetId());
        actionContext.setSuccessAlertWidgetId(metaSaga.getSuccess().getMessageWidgetId());
        actionContext.setMessageOnSuccess(p.cast(source.getMessageOnSuccess(), true));
        actionContext.setMessageOnFail(p.cast(source.getMessageOnFail(), true));

        Map<String, String> operationMapping = new StrictMap<>();
        CompiledObject.Operation operation = compiledObject.getOperations().get(source.getOperationId());
        for (N2oObject.Parameter inParameter : operation.getInParametersMap().values()) {
            String param = p.cast(inParameter.getParam(), RouteUtil.normalizeParam(inParameter.getId()));
            operationMapping.put(param, inParameter.getId());
        }
        actionContext.setOperationMapping(operationMapping);
        p.addRoute(actionContext);
    }

    private RedirectSaga initServerRedirect(AsyncMetaSaga meta) {
        if (meta != null && meta.getSuccess() != null
                && meta.getSuccess().getRedirect() != null
                && meta.getSuccess().getRedirect().isServer())
            return meta.getSuccess().getRedirect();
        return null;
    }
}
