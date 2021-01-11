package net.n2oapp.framework.autotest.api.component.fieldset;

import net.n2oapp.framework.autotest.api.component.Component;

/**
 * Филдсет для автотестирования
 */
public interface FieldSet extends Component {
    void shouldBeEmpty();

    void shouldBeVisible();

    void shouldNotBeVisible();

    void shouldHaveLabel(String label);

    void shouldNotHaveLabel();
}
