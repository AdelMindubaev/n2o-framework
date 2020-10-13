package net.n2oapp.framework.config.metadata.pack;

import net.n2oapp.framework.api.pack.MetadataPack;
import net.n2oapp.framework.api.pack.ReadersBuilder;
import net.n2oapp.framework.config.io.page.*;
import net.n2oapp.framework.config.reader.page.PageXmlReaderV1;

/**
 * Набор считывателей страниц версии 2.0
 */
public class N2oPagesIOv2Pack implements MetadataPack<ReadersBuilder> {
    @Override
    public void build(ReadersBuilder b) {
        b.readers(new PageXmlReaderV1());
        b.ios(new SimplePageElementIOv2(),
                new StandardPageElementIOv2(),
                new LeftRightPageElementIOv2(),
                new TopLeftRightPageElementIOv2(),
                new SearchablePageElementIOv2());
    }
}
