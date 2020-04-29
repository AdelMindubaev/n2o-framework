package net.n2oapp.framework.config.io.widget.table.cell;

import net.n2oapp.framework.config.io.action.CloseActionElementIOV1;
import net.n2oapp.framework.config.io.widget.table.TableElementIOV4;
import net.n2oapp.framework.config.metadata.pack.N2oCellsIOPack;
import net.n2oapp.framework.config.selective.ION2oMetadataTester;
import org.junit.Test;

/**
 * Тестирование чтения и записи ячейки с ссылкой
 */
public class LinkCellXmlIOTest {
    @Test
    public void testLinkCell() {
        ION2oMetadataTester tester = new ION2oMetadataTester();
        tester.ios(new TableElementIOV4(), new CloseActionElementIOV1())
                .addPack(new N2oCellsIOPack());

        assert tester.check("net/n2oapp/framework/config/io/widget/table/cell/testLinkCellIOv4.widget.xml");
    }
}
