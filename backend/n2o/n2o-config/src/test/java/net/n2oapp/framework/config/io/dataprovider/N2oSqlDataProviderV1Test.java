package net.n2oapp.framework.config.io.dataprovider;

import net.n2oapp.framework.config.selective.ION2oMetadataTester;
import org.junit.Test;

public class N2oSqlDataProviderV1Test {
    @Test
    public void io() {
        ION2oMetadataTester tester = new ION2oMetadataTester();
        tester.addIO(new SqlDataProviderIOv1());
        tester.check("net/n2oapp/framework/config/io/dataprovider/n2oSqlDataProviderIOTest.xml");
    }
}
