package net.n2oapp.framework.config.metadata.compile.cell;

import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oRatingCell;
import net.n2oapp.framework.api.metadata.meta.widget.table.Table;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.io.widget.table.cell.RatingCellElementIOv2;
import net.n2oapp.framework.config.metadata.compile.context.WidgetContext;
import net.n2oapp.framework.config.metadata.pack.N2oPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oRegionsPack;
import net.n2oapp.framework.config.metadata.pack.N2oWidgetsPack;
import net.n2oapp.framework.config.test.SourceCompileTestBase;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Тест на компиляцию ячейки с рейтингом
 */
public class RatingCellCompileTest extends SourceCompileTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oRegionsPack(), new N2oWidgetsPack());
        builder.ios(new RatingCellElementIOv2());
        builder.compilers(new RatingCellCompiler());
    }

    @Test
    public void testRatingCell() {
        Table table = (Table) compile("net/n2oapp/framework/config/metadata/compile/cell/testRatingCell.widget.xml")
                .get(new WidgetContext("testRatingCell"));

        N2oRatingCell cell = (N2oRatingCell) table.getComponent().getCells().get(0);
        assertThat(cell.getSrc(), is("RatingCell"));
        assertThat(cell.getHalf(), is(true));
        assertThat(cell.getMax(), is(10));
        assertThat(cell.getShowTooltip(), is(true));
        assertThat(cell.getReadonly(), is(false));

        cell = (N2oRatingCell) table.getComponent().getCells().get(1);
        assertThat(cell.getSrc(), is("RatingCell"));
        assertThat(cell.getHalf(), is(false));
        assertThat(cell.getMax(), is(5));
        assertThat(cell.getShowTooltip(), is(false));
        assertThat(cell.getReadonly(), is(true));
    }
}
