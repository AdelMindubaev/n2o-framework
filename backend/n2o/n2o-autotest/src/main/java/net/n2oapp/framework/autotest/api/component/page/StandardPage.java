package net.n2oapp.framework.autotest.api.component.page;

import net.n2oapp.framework.autotest.api.collection.Regions;
import net.n2oapp.framework.autotest.api.collection.Widgets;

/**
 * Стандартная страница для автотестирования
 */
public interface StandardPage extends Page {

    Regions place(String place);

    Widgets widgets();
}
