package net.n2oapp.framework.api.metadata.control.plain;


import lombok.Getter;
import lombok.Setter;

/**
 * Компонент ввода многострочного текста
 */
@Getter
@Setter
public class N2oTextArea extends N2oText {
    private Integer minRows;
    private Integer maxRows;

    @Deprecated
    public Integer getRows() {
        return maxRows;
    }

    @Deprecated
    public void setRows(Integer rows) {
        this.maxRows = rows;
    }
}
