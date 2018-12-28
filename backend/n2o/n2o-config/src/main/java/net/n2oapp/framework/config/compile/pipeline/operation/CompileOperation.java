package net.n2oapp.framework.config.compile.pipeline.operation;

import net.n2oapp.criteria.dataset.DataSet;
import net.n2oapp.framework.api.MetadataEnvironment;
import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.aware.MetadataEnvironmentAware;
import net.n2oapp.framework.api.metadata.aware.PipelineOperationTypeAware;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.compile.SourceCompilerFactory;
import net.n2oapp.framework.api.metadata.pipeline.*;
import net.n2oapp.framework.config.compile.pipeline.N2oPipelineSupport;
import net.n2oapp.framework.config.metadata.compile.N2oCompileProcessor;

import java.util.function.Supplier;

/**
 * Операция по сборке метаданных в конвеере
 */
public class CompileOperation<D extends Compiled, S> implements PipelineOperation<D, S>, PipelineOperationTypeAware, MetadataEnvironmentAware {

    private SourceCompilerFactory sourceCompilerFactory;

    public CompileOperation() {
    }

    public CompileOperation(SourceCompilerFactory sourceCompilerFactory) {
        this.sourceCompilerFactory = sourceCompilerFactory;
    }

    @Override
    public D execute(CompileContext<?, ?> context, DataSet data, Supplier<S> supplier, CompileProcessor processor) {
        S value = supplier.get();
        return sourceCompilerFactory.compile(value, context, processor);
    }

    @Override
    public PipelineOperationType getPipelineOperationType() {
        return PipelineOperationType.COMPILE;
    }

    @Override
    public void setEnvironment(MetadataEnvironment environment) {
        this.sourceCompilerFactory = environment.getSourceCompilerFactory();
    }
}
