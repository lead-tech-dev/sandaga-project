package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.image.ImageReqDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {
    ImageEntity uploadImage(String path, ImageReqDto imageReqDto) throws IOException;

    byte[] downloadImage(String fileName) throws IOException;

    ImageEntity replaceImageById(String id, String path, MultipartFile file) throws IOException;

    EmptyEntity removeImage(String path, String id);

    ImageEntity getImageById(String id);

    ImageEntity uploadImageOnDatabase(String path, ImageReqDto imageReqDto) throws IOException;

    void transfertImage() throws IOException;
}
