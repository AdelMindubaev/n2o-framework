package net.n2oapp.framework.autotest.impl.component.modal;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import net.n2oapp.framework.autotest.N2oSelenide;
import net.n2oapp.framework.autotest.api.collection.Toolbar;
import net.n2oapp.framework.autotest.api.component.modal.Modal;
import net.n2oapp.framework.autotest.api.component.page.Page;
import net.n2oapp.framework.autotest.impl.component.N2oComponent;

public class N2oModal extends N2oComponent implements Modal {

    public N2oModal(SelenideElement element) {
        setElement(element);
    }

    @Override
    public void shouldHaveTitle(String text) {
        element().$(".modal-header .modal-title")
                .shouldHave(Condition.text(text));
    }

    @Override
    public ModalToolbar toolbar() {
        return new N2oModalToolbar();
    }

    @Override
    public <T extends Page> T content(Class<T> pageClass) {
        return N2oSelenide.component(element().$(".modal-body"), pageClass);
    }

    @Override
    public void close() {
        element().$(".modal-header .close").click();
    }

    public class N2oModalToolbar implements ModalToolbar {

        @Override
        public Toolbar bottomLeft() {
            return N2oSelenide.collection(element().$$(".modal-footer .n2o-modal-actions").first().$$(".btn"), Toolbar.class);
        }

        @Override
        public Toolbar bottomRight() {
            return N2oSelenide.collection(element().$$(".modal-footer .n2o-modal-actions").last().$$(".btn"), Toolbar.class);
        }
    }
}
