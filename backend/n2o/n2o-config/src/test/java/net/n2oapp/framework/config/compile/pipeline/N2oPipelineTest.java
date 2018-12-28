package net.n2oapp.framework.config.compile.pipeline;

import net.n2oapp.cache.template.CacheCallback;
import net.n2oapp.cache.template.CacheTemplate;
import net.n2oapp.criteria.dataset.DataSet;
import net.n2oapp.framework.api.metadata.Compiled;
import net.n2oapp.framework.api.metadata.compile.*;
import net.n2oapp.framework.api.metadata.global.view.page.N2oPage;
import net.n2oapp.framework.api.metadata.global.view.page.N2oSimplePage;
import net.n2oapp.framework.api.metadata.pipeline.*;
import net.n2oapp.framework.api.metadata.validate.SourceValidator;
import net.n2oapp.framework.api.metadata.validate.SourceValidatorFactory;
import net.n2oapp.framework.api.metadata.validation.exception.N2oMetadataValidationException;
import net.n2oapp.framework.api.register.MetadataRegister;
import net.n2oapp.framework.config.compile.pipeline.operation.*;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.factory.MockMetadataFactory;
import net.n2oapp.framework.api.metadata.meta.Page;
import net.n2oapp.framework.config.reader.N2oSourceLoaderFactory;
import net.n2oapp.framework.config.register.XmlInfo;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


/**
 * Тест конвеера сборки метаданных ({@link N2oPipelineSupport})
 */
public class N2oPipelineTest {

    private N2oEnvironment env;
    private MetadataRegister metadataRegister;
    private N2oSourceLoaderFactory readerFactory;
    private CacheTemplate sourceCacheTemplate;
    private CacheTemplate compileCacheTemplate;


    @Before
    public void setUp() throws Exception {
        sourceCacheTemplate = new MockSourceCacheTemplate();
        compileCacheTemplate = new MockCompiledCacheTemplate();

        env = mock(N2oEnvironment.class);
        metadataRegister = mock(MetadataRegister.class);
        when(env.getMetadataRegister()).thenReturn(metadataRegister);
        readerFactory = mock(N2oSourceLoaderFactory.class);
        when(env.getSourceLoaderFactory()).thenReturn(readerFactory);
        SourceMergerFactory sourceMergerFactory = new MockMergeFactory();
        when(env.getSourceMergerFactory()).thenReturn(sourceMergerFactory);
        SourceCompilerFactory compilerFactory = new MockSourceCompilerFactory();
        when(env.getSourceCompilerFactory()).thenReturn(compilerFactory);
        SourceTransformerFactory sourceTransformerFactory = new MockSourceTransformer();
        when(env.getSourceTransformerFactory()).thenReturn(sourceTransformerFactory);
        CompileTransformerFactory compileTransformerFactory = new MockCompileTransformer();
        when(env.getCompileTransformerFactory()).thenReturn(compileTransformerFactory);
        SourceValidatorFactory validatorFactory = new MockSourceValidatorFactory();
        when(env.getSourceValidatorFactory()).thenReturn(validatorFactory);
        MetadataBinderFactory metadataBinderFactory = new MockBinderFactory();
        when(env.getMetadataBinderFactory()).thenReturn(metadataBinderFactory);
        PipelineOperationFactory pof = new MockPipelineOperationFactory();
        when(env.getPipelineOperationFactory()).thenReturn(pof);

        when(env.getReadPipelineFunction()).thenReturn(p -> p.read().transform().validate().cache());
        when(env.getReadCompilePipelineFunction()).thenReturn(p -> p.read().transform().validate().cache().copy().compile().transform().cache().copy());
        when(env.getCompilePipelineFunction()).thenReturn(p -> p.compile().transform().cache());
        when(env.getBindPipelineFunction()).thenReturn(p -> p.bind());
    }

    @Test
    public void readPipeline() {
        XmlInfo pageInfo = new XmlInfo("pageId", N2oPage.class, "", "");

        when(metadataRegister.get("pageId", N2oSimplePage.class)).thenReturn(pageInfo);
        when(metadataRegister.get("pageId", N2oPage.class)).thenReturn(pageInfo);

        PageContext context = mock(PageContext.class);
        when(context.getSourceId(any())).thenReturn("pageId");
        when(context.getCompiledId(any())).thenReturn("pageId");
        when(context.getSourceClass()).thenReturn(N2oPage.class);
        when(context.getCompiledClass()).thenReturn(Page.class);

        //read
        when(readerFactory.read(pageInfo, null)).then(m -> createSource());
        N2oSimplePage source = N2oPipelineSupport.readPipeline(env).read().get("pageId", N2oSimplePage.class);
        assertThat(source.getName(), is("test"));

        // read + transform
        N2oSimplePage resultSourceTransformPage = N2oPipelineSupport.readPipeline(env).read().transform().get("pageId", N2oSimplePage.class);
        assertThat(resultSourceTransformPage.getName(), is("transformed test"));

        // read + validate
        try{
            N2oPipelineSupport.readPipeline(env).read().transform().validate().get("pageId", N2oSimplePage.class);
            Assert.assertTrue(false);
        } catch (N2oMetadataValidationException e) {
        }

        // read + cache
        ReadTerminalPipeline<ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline>> readPipeline = N2oPipelineSupport.readPipeline(env).read().cache();
        source = readPipeline.get("pageId", N2oSimplePage.class);
        assertThat(source.getName(), is("test"));//cache miss

        source = readPipeline.get("pageId", N2oSimplePage.class);
        assertThat(source.getName(), is("cached test"));//cache hit

        // read + compile
        Page compiled = new N2oReadPipeline(env).read().compile().get(context);
        assertThat(compiled.getProperties().getTitle(), is("compiled test"));

        // read + cache + compile
        ReadCompileTerminalPipeline<ReadCompileBindTerminalPipeline> compilePipeline = N2oPipelineSupport.readPipeline(env).read().cache().copy().compile();
        compiled = compilePipeline.get(context);
        assertThat(compiled.getProperties().getTitle(), is("compiled cached test"));//second cache hit

        // read + compile + transform
        compiled = N2oPipelineSupport.readPipeline(env).read().compile().transform().get(context);
        assertThat(compiled.getProperties().getTitle(), is("transformed compiled test"));

        // read + compile + cache + transform
        compiled = N2oPipelineSupport.readPipeline(env).read().compile().cache().transform().get(context);
        assertThat(compiled.getProperties().getTitle(), is("transformed compiled test"));//compile cache miss

        compiled = N2oPipelineSupport.readPipeline(env).read().compile().cache().transform().get(context);
        assertThat(compiled.getProperties().getTitle(), is("transformed cached compiled test"));//compile cache hit

        // read + compile + bind
        DataSet data = new DataSet();
        compiled = N2oPipelineSupport.readPipeline(env).read().compile().bind().get(context, data);
        assertThat(compiled.getProperties().getTitle(), is("binding compiled test"));
    }

    @Test
    public void compilePipeline() {
        XmlInfo pageInfo = new XmlInfo("pageId", N2oPage.class, "", "");
        when(metadataRegister.get("pageId", N2oSimplePage.class)).thenReturn(pageInfo);
        when(metadataRegister.get("pageId", N2oPage.class)).thenReturn(pageInfo);
        XmlInfo pageInfo2 = new XmlInfo("page2", N2oPage.class, "", "");
        when(metadataRegister.get("page2", N2oSimplePage.class)).thenReturn(pageInfo2);
        N2oSimplePage page2 = new N2oSimplePage();
        page2.setId("page2");
        page2.setName("name2");
        when(readerFactory.read(pageInfo2, null)).thenReturn(page2);
        PageContext context = mock(PageContext.class);
        when(context.getSourceId(any())).thenReturn("pageId");
        when(context.getCompiledId(any())).thenReturn("pageId");
        when(context.getSourceClass()).thenReturn(N2oPage.class);
        when(context.getCompiledClass()).thenReturn(Page.class);

        //compile
        Page compiledPage = N2oPipelineSupport.compilePipeline(env).compile().get(createSource(), context);
        assertThat(compiledPage.getProperties().getTitle(), is("compiled test"));

        //merge - compile
        N2oSimplePage source = createSource();
        source.setRefId("page2");
        compiledPage = N2oPipelineSupport.compilePipeline(env).merge().compile().get(source, context);
        assertThat(compiledPage.getProperties().getTitle(), is("compiled merged test"));

        //transform + compile
        compiledPage = N2oPipelineSupport.compilePipeline(env).transform().compile().get(createSource(), context);
        assertThat(compiledPage.getProperties().getTitle(), is("compiled transformed test"));

        //compile + transform
        compiledPage = N2oPipelineSupport.compilePipeline(env).compile().transform().get(createSource(), context);
        assertThat(compiledPage.getProperties().getTitle(), is("transformed compiled test"));

        //compile + cache
        CompileTerminalPipeline<CompileBindTerminalPipeline> pipeline = N2oPipelineSupport.compilePipeline(env).compile().cache();
        compiledPage = pipeline.get(createSource(), context);
        assertThat(compiledPage.getProperties().getTitle(), is("compiled test"));//cache miss

        compiledPage = pipeline.get(createSource(), context);
        assertThat(compiledPage.getProperties().getTitle(), is("cached compiled test"));//cache hit

        //compile + bind
        DataSet data = new DataSet();
        compiledPage = N2oPipelineSupport.compilePipeline(env).compile().bind().get(createSource(), context, data);
        assertThat(compiledPage.getProperties().getTitle(), is("binding compiled test"));

        //compile + bind + bind
        compiledPage = N2oPipelineSupport.compilePipeline(env).compile().bind().bind().get(createSource(), context, data);
        assertThat(compiledPage.getProperties().getTitle(), is("binding binding compiled test"));
    }

    @Test
    public void bindingPipeline() {
        PageContext context = mock(PageContext.class);
        when(context.getSourceId(any())).thenReturn("pageId");
        when(context.getCompiledId(any())).thenReturn("pageId");
        when(context.getSourceClass()).thenReturn(N2oPage.class);
        when(context.getCompiledClass()).thenReturn(Page.class);
        DataSet data = new DataSet();

        //bind
        Page compiledPage = N2oPipelineSupport.bindPipeline(env).bind().get(createCompiled(), context, data);
        assertThat(compiledPage.getProperties().getTitle(), is("binding test"));

        //transform + bind
        compiledPage = N2oPipelineSupport.bindPipeline(env).transform().bind().get(createCompiled(), context, data);
        assertThat(compiledPage.getProperties().getTitle(), is("binding transformed test"));

        //bind + bind
        compiledPage = N2oPipelineSupport.bindPipeline(env).bind().bind().get(createCompiled(), context, data);
        assertThat(compiledPage.getProperties().getTitle(), is("binding binding test"));
    }

    private N2oSimplePage createSource() {
        N2oSimplePage sourcePage;
        sourcePage = new N2oSimplePage();
        sourcePage.setName("test");
        return sourcePage;
    }

    private Page createCompiled() {
        Page page;
        page = new Page();
        page.getProperties().setTitle("test");
        return page;
    }


    class MockSourceTransformer extends MockMetadataFactory<SourceTransformer> implements SourceTransformerFactory {

        @Override
        public <S> S transform(S source) {
            ((N2oSimplePage)source).setName("transformed " + ((N2oSimplePage)source).getName());
            return source;
        }
    }

    class MockCompileTransformer extends MockMetadataFactory<CompileTransformer> implements CompileTransformerFactory {

        @Override
        public <D extends Compiled> D transform(D compiled, CompileContext<?, ?> context, CompileProcessor processor) {
            ((Page) compiled).getProperties().setTitle("transformed " + ((Page) compiled).getProperties().getTitle());
            return compiled;
        }
    }


    class MockSourceValidatorFactory extends MockMetadataFactory<SourceValidator> implements SourceValidatorFactory {

        @Override
        public <S> void validate(S source) throws N2oMetadataValidationException {
            if (((N2oSimplePage)source).getId() == null)
                throw new N2oMetadataValidationException("validated " + ((N2oSimplePage)source).getName());
        }
    }


    class MockSourceCacheTemplate extends CacheTemplate {
        private N2oSimplePage cache;

        @Override
        public Object execute(String cacheRegion, Object key, CacheCallback callback) {
            if (cache == null) {
                N2oSimplePage source = (N2oSimplePage) callback.doInCacheMiss();
                cache = new N2oSimplePage();
                cache.setName(source.getName());
                return source;
            } else {
                N2oSimplePage copy = new N2oSimplePage();
                copy.setName("cached " + cache.getName());
                return copy;
            }
        }
    }

    class MockCompiledCacheTemplate extends CacheTemplate {
        private Page cache;

        @Override
        public Object execute(String cacheRegion, Object key, CacheCallback callback) {
            if (cache == null) {
                Page compiled = (Page) callback.doInCacheMiss();
                cache = new Page();
                cache.getProperties().setTitle(compiled.getProperties().getTitle());
                return compiled;
            } else {
                Page copy = new Page();
                copy.getProperties().setTitle("cached " + cache.getProperties().getTitle());
                return copy;
            }
        }
    }

    class MockSourceCompilerFactory extends MockMetadataFactory<SourceCompiler> implements SourceCompilerFactory {

        @Override
        public <D extends Compiled, S, C extends CompileContext<?, ?>> D compile(S source, C context, CompileProcessor p) {
            Page page = new Page();
            page.getProperties().setTitle("compiled " + ((N2oSimplePage) source).getName());
            return (D) page;
        }
    }

    class MockBinderFactory extends MockMetadataFactory<MetadataBinder> implements MetadataBinderFactory {

        @Override
        public <D extends Compiled> D bind(D compiled, CompileProcessor processor) {
            ((Page) compiled).getProperties().setTitle("binding " + ((Page) compiled).getProperties().getTitle());
            return compiled;
        }
    }

    class MockMergeFactory extends MockMetadataFactory<SourceMerger> implements SourceMergerFactory {

        @Override
        public <S> S merge(S source, S override) {
            String name = ((N2oSimplePage) override).getName();
            ((N2oSimplePage)source).setName("merged " + (name != null ? name : ((N2oSimplePage) source).getName()));
            return source;
        }
    }

    private class MockPipelineOperationFactory extends N2oPipelineOperationFactory {
        MockPipelineOperationFactory() {
            add(new ReadOperation<>(env.getMetadataRegister(), env.getSourceLoaderFactory()),
                    new MergeOperation<>(env.getSourceMergerFactory()),
                    new ValidateOperation<>(env.getSourceValidatorFactory()),
                    new CopyOperation<>(),
                    new SourceTransformOperation<>(env.getSourceTransformerFactory()),
                    new CompileTransformOperation<>(env.getCompileTransformerFactory()),
                    new SourceCacheOperation<>(sourceCacheTemplate, env.getMetadataRegister()),
                    new CompileCacheOperation<>(compileCacheTemplate),
                    new CompileOperation<>(env.getSourceCompilerFactory()),
                    new BindOperation<>(env.getMetadataBinderFactory()));
        }
    }
}