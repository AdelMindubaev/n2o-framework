package net.n2oapp.framework.config.io.page;

import net.n2oapp.framework.config.io.action.CloseActionElementIOV1;
import net.n2oapp.framework.config.io.toolbar.ButtonIO;
import net.n2oapp.framework.config.io.toolbar.SubmenuIO;
import net.n2oapp.framework.config.io.widget.table.TableElementIOV4;
import net.n2oapp.framework.config.metadata.pack.N2oRegionsV1IOPack;
import net.n2oapp.framework.config.selective.ION2oMetadataTester;
import org.junit.Test;

/**
 * Тестирование чтения/записи стандартной страницы версии 2.0
 */
public class StandardPageXmlIOv2Test {
    @Test
    public void testStandardPageXmlIOv2Test() {
        ION2oMetadataTester tester = new ION2oMetadataTester();
        tester.ios(new TableElementIOV4(), new StandardPageElementIOv2(), new CloseActionElementIOV1(),
                new ButtonIO(), new SubmenuIO())
                .addPack(new N2oRegionsV1IOPack());

        assert tester.check("net/n2oapp/framework/config/io/page/testStandardPageIOv2.page.xml");
    }

}
