package net.n2oapp.framework.config.io.widget.table.cell;

import net.n2oapp.framework.config.io.widget.table.TableElementIOV4;
import net.n2oapp.framework.config.metadata.pack.N2oCellsIOPack;
import net.n2oapp.framework.config.selective.ION2oMetadataTester;
import org.junit.Test;

/**
 * Тестирование чтения и записи переключаемой ячейки
 */
public class SwitchCellXmlIOTest {
    @Test
    public void testSwitchCell() {
        ION2oMetadataTester tester = new ION2oMetadataTester();
        tester.ios(new TableElementIOV4(), new SwitchCellElementIOv2())
        .addPack(new N2oCellsIOPack());

        assert tester.check("net/n2oapp/framework/config/io/widget/table/cell/testSwitchCellIOv4.widget.xml");
    }
}
