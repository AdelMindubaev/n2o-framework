package net.n2oapp.framework.config.metadata;

import net.n2oapp.framework.api.metadata.SourceMetadata;
import net.n2oapp.framework.api.metadata.global.view.page.N2oSimplePage;
import net.n2oapp.framework.config.io.page.SimplePageElementIOv2;
import net.n2oapp.framework.config.io.widget.form.FormElementIOV4;
import net.n2oapp.framework.config.reader.XmlMetadataLoader;
import net.n2oapp.framework.config.register.XmlInfo;
import net.n2oapp.framework.config.register.dynamic.MetadataParamHolder;
import net.n2oapp.framework.config.selective.reader.ReaderFactoryByMap;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;

public class XmlMetadataLoaderTest {

    @Test
    public void testLoad(){
        XmlInfo info = new XmlInfo("testXmlInfo", N2oSimplePage.class, "net/n2oapp/framework/config/metadata/testXmlInfo.page.xml");
        XmlMetadataLoader xmlMetadataLoader = new XmlMetadataLoader(
                new ReaderFactoryByMap().register(new SimplePageElementIOv2()).register(new FormElementIOV4()));
        SourceMetadata metadata = xmlMetadataLoader.load(info, "formName=Patients");
        assertThat(((N2oSimplePage)metadata).getWidget().getName(), is("Patients"));
        assertThat(MetadataParamHolder.getParams(), nullValue());
    }
}
