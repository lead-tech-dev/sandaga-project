package com.mjtech.sandaga.dtos.image;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageReqDto {
    private MultipartFile file;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adsId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String userId;

}
