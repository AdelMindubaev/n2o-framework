package net.n2oapp.framework.config.metadata.compile.action;

import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.event.action.N2oCopyAction;
import net.n2oapp.framework.api.metadata.global.view.widget.toolbar.CopyMode;
import net.n2oapp.framework.api.metadata.meta.action.copy.CopyAction;
import net.n2oapp.framework.api.metadata.meta.action.copy.CopyActionPayload;
import net.n2oapp.framework.api.metadata.meta.saga.MetaSaga;
import net.n2oapp.framework.config.metadata.compile.page.PageScope;
import net.n2oapp.framework.config.metadata.compile.widget.WidgetScope;
import net.n2oapp.framework.config.util.CompileUtil;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Сборка действия вызова операции
 */
@Component
public class CopyActionCompiler extends AbstractActionCompiler<CopyAction, N2oCopyAction> {
    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oCopyAction.class;
    }

    @Override
    public CopyAction compile(N2oCopyAction source, CompileContext<?, ?> context, CompileProcessor p) {
        CopyAction copyAction = new CopyAction();
        compileAction(copyAction, source, p);
        copyAction.setType(p.resolve(property("n2o.api.action.copy.type"), String.class));

        String sourceWidgetId = getSourceWidgetId(source, context, p);
        CopyActionPayload.ClientModel sourceModel = new CopyActionPayload.ClientModel(
                sourceWidgetId, p.cast(source.getSourceModel(), ReduxModel.RESOLVE).getId());
        if (source.getSourceFieldId() != null)
            sourceModel.setField(source.getSourceFieldId());

        String targetWidgetId = getTargetWidgetId(source, context, p);
        CopyActionPayload.ClientModel targetModel = new CopyActionPayload.ClientModel(
                targetWidgetId, p.cast(source.getTargetModel(), ReduxModel.RESOLVE).getId());
        if (source.getTargetFieldId() != null)
            targetModel.setField(source.getTargetFieldId());

        copyAction.getPayload().setSource(sourceModel);
        copyAction.getPayload().setTarget(targetModel);
        copyAction.getPayload().setMode(p.cast(source.getMode(), CopyMode.merge));

        MetaSaga meta = new MetaSaga();
        meta.setCloseLastModal(p.resolve(property("n2o.api.action.copy.close_on_success"), Boolean.class));
        copyAction.setMeta(meta);

        return copyAction;
    }

    private String getSourceWidgetId(N2oCopyAction source, CompileContext<?, ?> context, CompileProcessor p) {
        PageScope pageScope = p.getScope(PageScope.class);
        WidgetScope widgetScope = p.getScope(WidgetScope.class);
        if (source.getSourceWidgetId() != null)
            return pageScope != null ? pageScope.getGlobalWidgetId(source.getSourceWidgetId()) : source.getSourceWidgetId();
        else
            return widgetScope == null ? initTargetWidget(source, context, p) : widgetScope.getClientWidgetId();
    }

    private String getTargetWidgetId(N2oCopyAction source, CompileContext<?, ?> context, CompileProcessor p) {
        PageScope pageScope = p.getScope(PageScope.class);
        if (source.getTargetWidgetId() != null) {
            if (source.getTargetClientPageId() != null) {
                return CompileUtil.generateWidgetId(source.getTargetClientPageId(), source.getTargetWidgetId());
            } else {
                return (pageScope != null) ? pageScope.getGlobalWidgetId(source.getTargetWidgetId()) :
                        source.getTargetWidgetId();
            }
        } else
            return initTargetWidget(source, context, p);
    }
}
