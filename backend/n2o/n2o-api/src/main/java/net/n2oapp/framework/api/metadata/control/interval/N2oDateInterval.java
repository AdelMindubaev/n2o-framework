package net.n2oapp.framework.api.metadata.control.interval;

import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.control.properties.PopupPlacement;

/**
 * Компонент ввода интервала дат
 */
@Getter
@Setter
public class N2oDateInterval extends N2oSimpleIntervalField {

    @Deprecated
    private PopupPlacement popupPlacement;

    private String dateFormat;
    private String timeFormat;
    private String beginDefaultTime;
    private String endDefaultTime;
    private String max;
    private String min;
    private Boolean utc;

    public N2oDateInterval() {
    }

    public N2oDateInterval(String id) {
        setId(id);
    }

}
