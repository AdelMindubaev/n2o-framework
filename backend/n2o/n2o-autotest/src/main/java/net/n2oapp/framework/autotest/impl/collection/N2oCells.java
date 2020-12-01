package net.n2oapp.framework.autotest.impl.collection;

import com.codeborne.selenide.Condition;
import net.n2oapp.framework.autotest.api.collection.Cells;
import net.n2oapp.framework.autotest.api.component.cell.Cell;
import net.n2oapp.framework.autotest.api.component.cell.TextCell;


import static net.n2oapp.framework.autotest.N2oSelenide.component;

public class N2oCells extends N2oComponentsCollection implements Cells {

    @Override
    public TextCell cell(int index) {
        return component(elements().get(index), TextCell.class);
    }

    @Override
    public <T extends Cell> T cell(int index, Class<T> componentClass) {
        return component(elements().get(index), componentClass);
    }

    @Override
    public <T extends Cell> T cell(Condition findBy, Class<T> componentClass) {
        return component(elements().findBy(findBy), componentClass);
    }

    @Override
    public void click() {
        elements().get(0).parent().click();
    }

    @Override
    public void hover() {
        elements().get(0).parent().hover();
    }
}
