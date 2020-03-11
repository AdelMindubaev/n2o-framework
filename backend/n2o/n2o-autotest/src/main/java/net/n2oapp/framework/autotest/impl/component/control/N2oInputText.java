package net.n2oapp.framework.autotest.impl.component.control;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import net.n2oapp.framework.autotest.api.component.control.InputText;
import org.openqa.selenium.Keys;

/**
 * Компонент ввода текста для автотестирования
 */
public class N2oInputText extends N2oControl implements InputText {

    @Override
    public String val() {
        SelenideElement elm = element().parent().$(".n2o-input");
        return elm.exists() ? elm.val() : element().$(".n2o-editable-cell .n2o-editable-cell-text").text();
    }

    @Override
    public void val(String value) {
        element().parent().$(".n2o-input").sendKeys(Keys.chord(Keys.CONTROL, "a"), value);
        element().parent().$(".n2o-input").pressEnter();
    }

    @Override
    public void shouldHaveValue(String value) {
        SelenideElement elm = element().parent().$(".n2o-input");
        if (elm.exists()) elm.shouldHave(Condition.value(value));
        else element().$(".n2o-editable-cell .n2o-editable-cell-text").shouldHave(Condition.text(value));
    }

    @Override
    public void shouldHavePlaceholder(String placeholder) {
        element().shouldHave(Condition.attribute("placeholder", placeholder));
    }

    @Override
    public void clickPlusStepButton() {
        element().parent().$$(".n2o-input-number-buttons button").get(0).click();
    }

    @Override
    public void clickMinusStepButton() {
        element().parent().$$(".n2o-input-number-buttons button").get(1).click();
    }
}
