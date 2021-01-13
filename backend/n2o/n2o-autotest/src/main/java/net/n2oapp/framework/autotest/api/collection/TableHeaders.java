package net.n2oapp.framework.autotest.api.collection;

import com.codeborne.selenide.Condition;
import net.n2oapp.framework.autotest.api.component.widget.table.TableSimpleHeader;
import net.n2oapp.framework.autotest.api.component.widget.table.TableHeader;

/**
 * Заголовки столбцов таблицы для автотестирования
 */
public interface TableHeaders extends ComponentsCollection {
    TableSimpleHeader header(int index);

    TableSimpleHeader header(Condition findBy);

    <T extends TableHeader> T header(int index, Class<T> componentClass);

    <T extends TableHeader> T header(Condition findBy, Class<T> componentClass);
}
