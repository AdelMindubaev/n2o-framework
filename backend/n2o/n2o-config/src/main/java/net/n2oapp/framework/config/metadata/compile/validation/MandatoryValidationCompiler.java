package net.n2oapp.framework.config.metadata.compile.validation;

import net.n2oapp.framework.api.data.validation.MandatoryValidation;
import net.n2oapp.framework.api.exception.SeverityType;
import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.dao.validation.N2oMandatory;
import net.n2oapp.framework.api.script.ScriptProcessor;
import org.springframework.stereotype.Component;

import static net.n2oapp.framework.config.util.FileSystemUtil.getContentByUri;

/**
 * Компиляция Required валидации
 */
@Component
public class MandatoryValidationCompiler extends BaseValidationCompiler<MandatoryValidation, N2oMandatory> {

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oMandatory.class;
    }

    @Override
    public MandatoryValidation compile(N2oMandatory source, CompileContext<?, ?> context, CompileProcessor p) {
        MandatoryValidation validation = new MandatoryValidation();
        compileValidation(validation, source, context, p);
        validation.setMessage(source.getMessage());
        validation.setSeverity(p.cast(source.getSeverity(), SeverityType.danger));
        validation.setExpression(ScriptProcessor.resolveFunction(p.cast(source.getExpression(), getContentByUri(source.getSrc()))));
        validation.setExpressionOn(source.getExpressionOn());
        return validation;
    }
}
