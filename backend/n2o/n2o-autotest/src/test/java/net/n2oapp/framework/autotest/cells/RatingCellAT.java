package net.n2oapp.framework.autotest.cells;

import net.n2oapp.framework.autotest.api.component.cell.*;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.api.component.widget.table.TableWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.*;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Автотест ячеек таблицы
 */
public class RatingCellAT extends AutoTestBase {

    private TableWidget.Rows rows;

    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();

        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/cells/rating/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/cells/testTable.query.xml"));

        SimplePage simplePage = open(SimplePage.class);
        simplePage.shouldExists();

        rows = simplePage.widget(TableWidget.class).columns().rows();
        rows.shouldHaveSize(4);
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oPagesPack(), new N2oHeaderPack(), new N2oWidgetsPack(),
                new N2oCellsPack(), new N2oAllDataPack());
    }

    @Test
    public void ratingCellTest() {
        int col = 0;

        rows.row(0).cell(col, RatingCell.class).maxShouldBe(10);
//        rows.row(0).cell(col, RatingCell.class).checkedShouldBe(0); val:-1
        rows.row(1).cell(col, RatingCell.class).checkedShouldBe(0);
        rows.row(2).cell(col, RatingCell.class).checkedShouldBe(5);
//        rows.row(3).cell(col, RatingCell.class).checkedShouldBe(10); val:15

        rows.row(0).cell(col, RatingCell.class).check(2);
        rows.row(0).cell(col, RatingCell.class).checkedShouldBe(2);

        rows.row(0).cell(col, RatingCell.class).check(7);
        rows.row(0).cell(col, RatingCell.class).checkedShouldBe(7);
    }

}
