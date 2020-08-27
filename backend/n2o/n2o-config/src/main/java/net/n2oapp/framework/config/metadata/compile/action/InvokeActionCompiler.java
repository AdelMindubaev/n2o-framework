package net.n2oapp.framework.config.metadata.compile.action;

import net.n2oapp.framework.api.exception.N2oException;
import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.dataprovider.N2oClientDataProvider;
import net.n2oapp.framework.api.metadata.event.action.N2oInvokeAction;
import net.n2oapp.framework.api.metadata.global.dao.N2oParam;
import net.n2oapp.framework.api.metadata.global.view.action.control.Target;
import net.n2oapp.framework.api.metadata.local.CompiledObject;
import net.n2oapp.framework.api.metadata.meta.ClientDataProvider;
import net.n2oapp.framework.api.metadata.meta.action.invoke.InvokeAction;
import net.n2oapp.framework.api.metadata.meta.action.invoke.InvokeActionPayload;
import net.n2oapp.framework.api.metadata.meta.saga.AsyncMetaSaga;
import net.n2oapp.framework.api.metadata.meta.saga.MetaSaga;
import net.n2oapp.framework.api.metadata.meta.saga.RedirectSaga;
import net.n2oapp.framework.api.metadata.meta.saga.RefreshSaga;
import net.n2oapp.framework.api.metadata.meta.widget.RequestMethod;
import net.n2oapp.framework.config.metadata.compile.ParentRouteScope;
import net.n2oapp.framework.config.metadata.compile.context.DialogContext;
import net.n2oapp.framework.config.metadata.compile.context.ModalPageContext;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.compile.dataprovider.ClientDataProviderUtil;
import net.n2oapp.framework.config.metadata.compile.page.PageScope;
import net.n2oapp.framework.config.metadata.compile.redux.Redux;
import net.n2oapp.framework.config.metadata.compile.widget.WidgetScope;
import org.springframework.stereotype.Component;

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
        ReduxModel targetWidgetModel = getTargetWidgetModel(p, ReduxModel.RESOLVE);
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
        N2oClientDataProvider dataProvider = new N2oClientDataProvider();
        dataProvider.setOptimistic(p.cast(source.getOptimistic(), p.resolve(property("n2o.api.action.invoke.optimistic"), Boolean.class)));
        dataProvider.setTargetModel(model);
        dataProvider.setTargetWidgetId(invokeAction.getPayload().getWidgetId());
        dataProvider.setId(source.getId());
        validatePathAndRoute(source, routeScope);
        dataProvider.setPathParams(source.getPathParams());
        dataProvider.setFormParams(source.getFormParams());
        dataProvider.setHeaderParams(source.getHeaderParams());
        dataProvider.setMethod(RequestMethod.POST);
        dataProvider.setUrl(source.getRoute());
        dataProvider.setSubmitForm(p.cast(source.getSubmitForm(), true));

        CompiledObject compiledObject = p.getScope(CompiledObject.class);
        if (compiledObject == null)
            throw new N2oException("For compilation action [{0}] is necessary object!").addData(source.getId());
        invokeAction.setObjectId(compiledObject.getId());

        AsyncMetaSaga metaSaga = invokeAction.getMeta();
        N2oClientDataProvider.ActionContextData actionContextData = new N2oClientDataProvider.ActionContextData();
        actionContextData.setObjectId(compiledObject.getId());
        actionContextData.setOperationId(source.getOperationId());
        actionContextData.setRedirect(initServerRedirect(metaSaga));
        actionContextData.setParentWidgetId(invokeAction.getPayload().getWidgetId());
        actionContextData.setFailAlertWidgetId(metaSaga.getFail().getMessageWidgetId());
        actionContextData.setMessagesForm(metaSaga.getFail().getMessageWidgetId());
        actionContextData.setSuccessAlertWidgetId(metaSaga.getSuccess().getMessageWidgetId());
        actionContextData.setMessageOnSuccess(p.cast(source.getMessageOnSuccess(), true));
        actionContextData.setMessageOnFail(p.cast(source.getMessageOnFail(), true));
        actionContextData.setOperation(compiledObject.getOperations().get(source.getOperationId()));
        dataProvider.setActionContextData(actionContextData);
        ClientDataProvider compiledDataProvider = ClientDataProviderUtil.compile(dataProvider, context, p);
        if (routeScope != null) {
            compiledDataProvider.getPathMapping().putAll(routeScope.getPathMapping());
        }
        payload.setDataProvider(compiledDataProvider);
    }

    private void validatePathAndRoute(N2oInvokeAction source, ParentRouteScope routeScope) {
        String route = source.getRoute();
        N2oParam[] pathParams = source.getPathParams();
        if (route == null && pathParams == null) return;
        if (route == null && (pathParams != null || pathParams.length > 0)) throw new IllegalArgumentException("route not set");
        if (pathParams == null && route != null) throw new IllegalArgumentException("path-param not set");
        for (N2oParam pathParam : pathParams) {
            if (!route.toLowerCase().contains(pathParam.getName().toLowerCase())) throw new IllegalArgumentException("route not contains path-param");
            if (routeScope.getUrl().toLowerCase().contains(pathParam.getName().toLowerCase())) throw new IllegalArgumentException("route duplicate in parent url");
        }
    }

    private RedirectSaga initServerRedirect(AsyncMetaSaga meta) {
        if (meta != null && meta.getSuccess() != null
                && meta.getSuccess().getRedirect() != null
                && meta.getSuccess().getRedirect().isServer())
            return meta.getSuccess().getRedirect();
        return null;
    }
}
