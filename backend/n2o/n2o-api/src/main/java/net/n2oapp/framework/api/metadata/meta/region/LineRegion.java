package net.n2oapp.framework.api.metadata.meta.region;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Клиентская модель региона с горизонтальным делителем.
 */
@Getter
@Setter
public class LineRegion extends Region {
    @JsonProperty
    private String name;
    @JsonProperty
    private Boolean collapsible;
    @JsonProperty
    private Boolean open;
}
