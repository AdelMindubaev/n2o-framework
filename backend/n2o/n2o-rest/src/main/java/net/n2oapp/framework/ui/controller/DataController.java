package net.n2oapp.framework.ui.controller;

import net.n2oapp.criteria.dataset.DataSet;
import net.n2oapp.framework.api.MetadataEnvironment;
import net.n2oapp.framework.api.metadata.meta.saga.RedirectSaga;
import net.n2oapp.framework.api.register.route.MetadataRouter;
import net.n2oapp.framework.api.rest.ControllerFactory;
import net.n2oapp.framework.api.rest.GetDataResponse;
import net.n2oapp.framework.api.rest.SetDataResponse;
import net.n2oapp.framework.api.ui.ActionRequestInfo;
import net.n2oapp.framework.api.ui.ActionResponseInfo;
import net.n2oapp.framework.api.ui.QueryRequestInfo;
import net.n2oapp.framework.api.ui.QueryResponseInfo;
import net.n2oapp.framework.api.user.UserContext;
import net.n2oapp.framework.config.register.route.RouteUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Set;

/**
 * Контроллер данных
 */
public class DataController extends AbstractController {

    private ControllerFactory controllerFactory;

    public DataController(ControllerFactory controllerFactory,
                          MetadataEnvironment environment) {
        super(environment);
        this.controllerFactory = controllerFactory;
    }

    public DataController(ControllerFactory controllerFactory,
                          MetadataEnvironment environment,
                          MetadataRouter router) {
        super(environment, router);
        this.controllerFactory = controllerFactory;
    }

    public GetDataResponse getData(String path, Map<String, String[]> parameters, UserContext user) {
        QueryRequestInfo requestInfo = createQueryRequestInfo(path, parameters, user);
        QueryResponseInfo responseInfo = new QueryResponseInfo();
        return controllerFactory.execute(requestInfo, responseInfo);
    }

    public SetDataResponse setData(String path, HttpServletRequest request, Object body, UserContext user) {
        ActionRequestInfo requestInfo = createActionRequestInfo(path, request, body, user);
        ActionResponseInfo responseInfo = new ActionResponseInfo();
        SetDataResponse result = controllerFactory.execute(requestInfo, responseInfo);
        resolveRedirect(requestInfo, result);
        return result;
    }

    private void resolveRedirect(ActionRequestInfo requestInfo, SetDataResponse response) {
        if (requestInfo.getRedirect() == null)
            return;
        RedirectSaga redirect = requestInfo.getRedirect();
        if (response.getData() != null) {
            DataSet data = new DataSet(response.getData());
            data.merge(requestInfo.getQueryData());
            String redirectUrl = redirect.getPath();
            Set<String> except = redirect.getPathMapping() != null ? redirect.getPathMapping().keySet() : null;
            redirectUrl = RouteUtil.resolveUrlParams(redirectUrl, requestInfo.getQueryData(), null, except);
            redirectUrl = RouteUtil.resolveUrlParams(redirectUrl, response.getData(), null, except);
            RedirectSaga resolvedRedirect = new RedirectSaga();
            resolvedRedirect.setTarget(redirect.getTarget());
            resolvedRedirect.setPathMapping(redirect.getPathMapping());
            resolvedRedirect.setQueryMapping(redirect.getQueryMapping());
            resolvedRedirect.setPath(redirectUrl);
            response.addRedirect(resolvedRedirect);
        }
    }
}
