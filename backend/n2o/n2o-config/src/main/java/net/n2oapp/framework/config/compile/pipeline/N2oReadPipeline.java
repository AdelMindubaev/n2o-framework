package net.n2oapp.framework.config.compile.pipeline;

import net.n2oapp.criteria.dataset.DataSet;
import net.n2oapp.framework.api.MetadataEnvironment;
import net.n2oapp.framework.api.data.QueryProcessor;
import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.SourceMetadata;
import net.n2oapp.framework.api.metadata.compile.CompileContext;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.pipeline.*;
import net.n2oapp.framework.api.util.SubModelsProcessor;
import net.n2oapp.framework.config.metadata.compile.N2oCompileProcessor;
import net.n2oapp.framework.config.metadata.compile.context.BaseCompileContext;

import java.util.Map;

import static net.n2oapp.framework.api.metadata.pipeline.PipelineOperationType.*;

public class N2oReadPipeline extends N2oPipeline implements ReadPipeline {

    protected N2oReadPipeline(MetadataEnvironment env) {
        super(env);
    }

    @Override
    public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> read() {
        pullOp(READ);
        return new ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>>() {
            @Override
            public <S extends SourceMetadata> S get(String id, Class<S> sourceClass) {
                return execute(new BaseCompileContext<Compiled, S>(id, sourceClass, null) {}, null, null);
            }

            @Override
            public ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline> compile() {
                pullOp(COMPILE);
                return new ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>() {
                    @Override
                    public <D extends Compiled> D get(CompileContext<D, ?> ctx) {
                        return execute(ctx, null, null);
                    }

                    @Override
                    public <D extends Compiled> D get(CompileContext<D, ?> ctx, CompileProcessor p) {
                        return execute(ctx, null, null, (N2oCompileProcessor) p);
                    }

                    @Override
                    public ReadCompileBindTerminalPipeline bind() {
                        pullOp(BIND);
                        return new ReadCompileBindTerminalPipeline() {
                            @Override
                            public <D extends Compiled> D get(CompileContext<D, ?> context, DataSet data) {
                                return execute(context, data, null);
                            }

                            @Override
                            public <D extends Compiled> D get(CompileContext<D, ?> context, DataSet data, SubModelsProcessor subModelsProcessor) {
                                return execute(context, data, null, subModelsProcessor);
                            }

                            @Override
                            public ReadCompileBindTerminalPipeline bind() {
                                pullOp(BIND);
                                return this;
                            }
                        };
                    }

                    @Override
                    public ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline> transform() {
                        pullOp(COMPILE_TRANSFORM);
                        return this;
                    }

                    @Override
                    public ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline> cache() {
                        pullOp(COMPILE_CACHE);
                        return this;
                    }

                    @Override
                    public ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline> copy() {
                        pullOp(COPY);
                        return this;
                    }
                };
            }

            @Override
            public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> validate() {
                pullOp(VALIDATE);
                return this;
            }

            @Override
            public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> merge() {
                pullOp(MERGE);
                return this;
            }

            @Override
            public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> transform() {
                pullOp(SOURCE_TRANSFORM);
                return this;
            }

            @Override
            public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> cache() {
                pullOp(SOURCE_CACHE);
                return this;
            }

            @Override
            public ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> copy() {
                pullOp(COPY);
                return this;
            }
        };
    }
}
