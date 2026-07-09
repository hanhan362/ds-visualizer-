package com.dsvisualizer.engine;

import com.dsvisualizer.dto.SortStepDto;
import java.util.List;

public interface SortEngine {
    String getId();
    List<SortStepDto> run(int[] input);
}
