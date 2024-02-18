package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.image.ImageReqDto;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.ImageEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.AdsRepository;
import com.mjtech.sandaga.repository.ImageRepository;
import com.mjtech.sandaga.repository.UserRepository;
import com.mjtech.sandaga.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.processing.FilerException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;


@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final AdsRepository adsRepository;
    private final  UserRepository userRepository;
    public ImageServiceImpl(ImageRepository imageRepository, AdsRepository adsRepository, UserRepository userRepository) {
        this.imageRepository = imageRepository;
        this.adsRepository = adsRepository;
    this.userRepository = userRepository;}

    @Override
    public void transfertImage()throws IOException {
        Iterable<ImageEntity> images = imageRepository.findAll();

        for(ImageEntity image : images){
            String filePath = image.getUrl();

                if (image.getImageData() == null) {
                    byte[] file = Files.readAllBytes(new File(filePath).toPath());
                    image.setImageData(file);
                    imageRepository.save(image);
                }

       }

    }
    @Override
    public ImageEntity uploadImageOnDatabase(String path, ImageReqDto imageReqDto)throws IOException {
        AdsEntity ads = null;
        UserEntity user = null;

        if (imageReqDto.getAdsId() != null)  {
            Optional<AdsEntity> existsAds = adsRepository.findById(UUID.fromString(imageReqDto.getAdsId()));

            if (existsAds.isEmpty()) {
                throw new ResourceNotFoundException("Ads not found!");
            }

            ads = existsAds.get();
        }

        if (imageReqDto.getUserId() != null)  {
            Optional<UserEntity> existsUser = userRepository.findById(UUID.fromString(imageReqDto.getUserId()));

            if (existsUser.isEmpty()) {
                throw new ResourceNotFoundException("User not found!");
            }

            user = existsUser.get();
        }

        String name = imageReqDto.getFile().getOriginalFilename();
        String type = imageReqDto.getFile().getContentType();
        // add comment
        String randomID=UUID.randomUUID().toString();
        String fileName= randomID.concat(name.substring(name.lastIndexOf(".")));
        String filePath = path + File.separator + fileName;

        ImageEntity image = imageRepository.save(ImageEntity.builder()
                .name(fileName)
                .type(type)
                .imageData(imageReqDto.getFile().getBytes())
                .url(filePath)
                .ads(ads)
                .user(user)
                .build());

        if (image.getId() == null) {
            throw new FilerException("Couldn't save file");
        }

        return image;
    }
    @Override
    public ImageEntity uploadImage(String path, ImageReqDto imageReqDto)throws IOException {
        AdsEntity ads = null;
        UserEntity user = null;

        if (imageReqDto.getAdsId() != null)  {
            Optional<AdsEntity> existsAds = adsRepository.findById(UUID.fromString(imageReqDto.getAdsId()));

            if (existsAds.isEmpty()) {
                throw new ResourceNotFoundException("Ads not found!");
            }

            ads = existsAds.get();
        }

        if (imageReqDto.getUserId() != null)  {
            Optional<UserEntity> existsUser = userRepository.findById(UUID.fromString(imageReqDto.getUserId()));

            if (existsUser.isEmpty()) {
                throw new ResourceNotFoundException("User not found!");
            }

            user = existsUser.get();
        }

        String name = imageReqDto.getFile().getOriginalFilename();
        String type = imageReqDto.getFile().getContentType();


        String randomID=UUID.randomUUID().toString();
        String fileName= randomID.concat(name.substring(name.lastIndexOf(".")));
        String filePath = path + File.separator + fileName;

        ImageEntity image = imageRepository.save(ImageEntity.builder()
                .name(fileName)
                .type(type)
                .url(filePath)
                .ads(ads)
                .user(user)
                .build()
        );

        // create folder if not created
        File newFile = new File(path);
        if (!newFile.exists()) {
            newFile.mkdir();
        }

        // file copy

        Files.copy(imageReqDto.getFile().getInputStream(), Paths.get(filePath));

        //return  name;

        //newFile.delete();

        System.gc();

       return image;
    }


    @Override public byte[] downloadImage(String fileName)throws IOException {
        Optional<ImageEntity> image = imageRepository.findByName(fileName);

        if (image.isEmpty()) {
            throw new ResourceNotFoundException("Image not found!");
        }

        //String filePath = image.get().getUrl();

        //return Files.readAllBytes(new File(filePath).toPath());
        return image.get().getImageData();
    }
  /*  @Override
    public ImageEntity replaceImageById(String id, String path, MultipartFile file)throws IOException {

        Optional<ImageEntity> existsImage = imageRepository.findById(UUID.fromString(id));

        if (existsImage.isEmpty()) {
            throw new ResourceNotFoundException("Image not found!");
        }

        ImageEntity image = existsImage.get();

        deletePathImage(path, image);

        String name = file.getOriginalFilename();
        String type = file.getContentType();


        String randomID=UUID.randomUUID().toString();
        String fileName= randomID.concat(name.substring(name.lastIndexOf(".")));
        String filePath = path + File.separator + fileName;

        image.setName(fileName);
        image.setType(type);
        image.setUrl(filePath);

        imageRepository.save(image);

        File newFile = new File(path);
        if (!newFile.exists()) {
            newFile.mkdir();
        }

        Files.copy(file.getInputStream(), Paths.get(filePath));

        System.gc();

        return image;
    }
*/

    public ImageEntity replaceImageById(String id, String path, MultipartFile file)throws IOException {

        Optional<ImageEntity> existsImage = imageRepository.findById(UUID.fromString(id));

        if (existsImage.isEmpty()) {
            throw new ResourceNotFoundException("Image not found!");
        }

        ImageEntity image = existsImage.get();

        deletePathImage(path, image);

        String name = file.getOriginalFilename();
        String type = file.getContentType();


        String randomID=UUID.randomUUID().toString();
        String fileName= randomID.concat(name.substring(name.lastIndexOf(".")));
        String filePath = path + File.separator + fileName;

        image.setName(fileName);
        image.setType(type);
        image.setUrl(filePath);
        image.setImageData(file.getBytes());

        imageRepository.save(image);

        if (image.getId() == null) {
            throw new FilerException("Couldn't save file");
        }

        return image;
    }

    @Override
    public EmptyEntity removeImage(String path, String id) {
        Optional<ImageEntity> existsImage = imageRepository.findById(UUID.fromString(id));


        if (existsImage.isEmpty()) {
            throw new ResourceNotFoundException("Image not found!");
        }

       // deletePathImage(path, existsImage.get());

        System.out.println("Image: " +existsImage.get().getName());
        imageRepository.deleteById(existsImage.get().getId());

        return new EmptyEntity();

    }

    private void deletePathImage(String path, ImageEntity image) {
        try {
            File file = new File(path + File.separator + image.getName());
            file.delete();

        }
        catch(Exception e)
        {
            System.out.println(e);
        }
    }

    @Override
    public ImageEntity getImageById(String id) {
        Optional<ImageEntity> image = imageRepository.findById(UUID.fromString(id));

        if (image.isEmpty()) {
            throw new ResourceNotFoundException("Image not found!");
        }
       return image.get();
    }
}
