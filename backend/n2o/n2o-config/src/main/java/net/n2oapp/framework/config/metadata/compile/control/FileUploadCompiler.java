package net.n2oapp.framework.config.metadata.compile.control;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.control.N2oFileUpload;
import net.n2oapp.framework.api.metadata.meta.control.DefaultValues;
import net.n2oapp.framework.api.metadata.meta.control.FileUpload;
import net.n2oapp.framework.api.metadata.meta.control.StandardField;
import org.springframework.stereotype.Component;

import java.util.HashMap;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция компонента загрузки файлов
 */
@Component
public class FileUploadCompiler extends StandardFieldCompiler<FileUpload, N2oFileUpload> {
    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oFileUpload.class;
    }

    @Override
    public StandardField<FileUpload> compile(N2oFileUpload source, CompileContext<?, ?> context, CompileProcessor p) {
        FileUpload fileUpload = new FileUpload();
        fileUpload.setUploadUrl(p.resolveJS(source.getUploadUrl()));
        fileUpload.setDeleteUrl(p.resolveJS(source.getDeleteUrl()));
        fileUpload.setAjax(p.cast(source.getAjax(), true));
        fileUpload.setMulti(p.cast(source.getMulti(), false));
        fileUpload.setAccept(source.getAccept());
        fileUpload.setShowSize(p.cast(source.getShowSize(),
                p.resolve(property("n2o.api.control.fileupload.show_size"), Boolean.class)));
        fileUpload.setValueFieldId(p.cast(source.getValueFieldId(),
                p.resolve(property("n2o.api.control.fileupload.value_field_id"), String.class)));
        fileUpload.setLabelFieldId(p.cast(source.getLabelFieldId(),
                p.resolve(property("n2o.api.control.fileupload.label_field_id"), String.class)));
        fileUpload.setUrlFieldId(p.cast(source.getUrlFieldId(),
                p.resolve(property("n2o.api.control.fileupload.url_field_id"), String.class)));
        fileUpload.setResponseFieldId(p.cast(source.getMessageFieldId(),
                p.resolve(property("n2o.api.control.fileupload.response_field_id"), String.class)));
        fileUpload.setRequestParam(p.cast(source.getRequestParam(), "file"));
        return compileStandardField(fileUpload, source, context, p);
    }

    @Override
    protected String getControlSrcProperty() {
        return "n2o.api.control.fileupload.src";
    }

    @Override
    protected Object compileDefValues(N2oFileUpload source, CompileProcessor p) {
        if (source.getDefValue() == null) {
            return null;
        }
        DefaultValues values = new DefaultValues();
        values.setValues(new HashMap<>());
        source.getDefValue().forEach((f, v) -> values.getValues().put(f, p.resolve(v)));
        return values;
    }
}
