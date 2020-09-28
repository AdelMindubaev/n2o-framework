package net.n2oapp.framework.autotest.api.component.widget.table;

import net.n2oapp.framework.autotest.api.collection.Cells;
import net.n2oapp.framework.autotest.api.collection.Fields;
import net.n2oapp.framework.autotest.api.collection.TableHeaders;
import net.n2oapp.framework.autotest.api.collection.Toolbar;
import net.n2oapp.framework.autotest.api.component.widget.StandardWidget;

import java.util.List;

/**
 * Виджет - таблица для автотестирования
 */
public interface TableWidget extends StandardWidget {
    Columns columns();

    Filters filters();

    Paging paging();

    interface Columns {
        TableHeaders headers();

        Rows rows();
    }

    interface Filters {

        Toolbar toolbar();

        Fields fields();

        void search();

        void clear();

        void shouldBeVisible();

        void shouldBeInvisible();
    }

    interface Paging {
        void activePageShouldBe(String number);

        void selectPage(String number);

        void pagingShouldHave(String number);

        int totalElements();

        void totalElementsShouldBe(int count);

        void totalElementsShouldNotExist();

        void prevShouldNotExist();

        void prevShouldExist();

        void nextShouldNotExist();

        void nextShouldExist();

        void lastShouldNotExist();

        void lastShouldExist();

        void firstShouldNotExist();

        void firstShouldExist();
    }

    interface Rows {
        Cells row(int index);

        void shouldHaveSize(int size);

        void shouldNotHaveRows();

        void shouldBeSelected(int row);

        void shouldNotHaveSelectedRows();

        void columnShouldHaveTexts(int index, List<String> text);

        List<String> columnTexts(int index);
    }
}
