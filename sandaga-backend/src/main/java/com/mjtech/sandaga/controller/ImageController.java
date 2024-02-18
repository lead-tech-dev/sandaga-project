package com.mjtech.sandaga.controller;


import com.mjtech.sandaga.dtos.image.*;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.service.ImageService;
import com.mjtech.sandaga.utility.dto.Image;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
public class ImageController {


    @Value("${project.image}")
    private String path;
    private final ImageService imageService;
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @ApiOperation(value = "Add a new image", nickname = "addImage", notes = "Creates a new image", response = ImageDto.class, tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = ImageDto.class) })
    @GetMapping(
            value = "/api/v1/images/transfer",
            produces = { "application/json" }
    )
    public ResponseEntity<HttpStatus> saveImageOnFileSystem()throws IOException {

             imageService.transfertImage();
            return new ResponseEntity<>(HttpStatus.CREATED);

    }
    @ApiOperation(value = "Add a new image", nickname = "addImage", notes = "Creates a new image", response = ImageDto.class, tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = ImageDto.class) })
    @PostMapping(
            value = "/api/v1/images/file",
            produces = { "application/json" },
            consumes = { "multipart/form-data" }
    )
    public ResponseEntity<ImageDto> saveImageOnFileSystem(@ApiParam(value = "") @Valid @RequestParam(value = "file", required = false) MultipartFile file,
                                             ImageReqDto imageReqDto) {

        try {
            return new ResponseEntity<>(Image.toDto(imageService.uploadImage(path, imageReqDto)), HttpStatus.CREATED);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @ApiOperation(value = "Add a new image", nickname = "addImage", notes = "Creates a new image", response = ImageDto.class, tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = ImageDto.class) })
    @PostMapping(
            value = "/api/v1/images",
            produces = { "application/json" },
            consumes = { "multipart/form-data" }
    )
    public ResponseEntity<ImageDto> saveImageOnDatabase(@ApiParam(value = "") @Valid @RequestParam(value = "file", required = false) MultipartFile file,
                                         ImageReqDto imageReqDto)throws IOException {

        return new ResponseEntity<>(Image.toDto(imageService.uploadImageOnDatabase(path, imageReqDto)), HttpStatus.CREATED);
        }


    @ApiOperation(value = "Get an image by file name", nickname = "getImageByFileName", notes = "Get an image based on given image filename.", tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ImageDto.class) })
    @GetMapping (
            value = "/images/{fileName}",
            produces = { "application/json" }
    )

 public ResponseEntity<byte[]> getImageByFileName(@PathVariable String fileName){

         try {
             byte []  imageData = imageService.downloadImage(fileName);

             return ResponseEntity.status(HttpStatus.OK)
                     .contentType(MediaType.IMAGE_JPEG)
                     .contentType(MediaType.IMAGE_PNG)
                     .body(imageData);

         } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @ApiOperation(value = "Get an image by id", nickname = "getImageById", notes = "Get an image based on given image id.", tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ImageDto.class) })
    @GetMapping (
            value = "/images/one/{imageId}",
            produces = { "application/json" }
    )

    public ResponseEntity<ImageDto> getImageById(@PathVariable String imageId){
        return new ResponseEntity<>(Image.toDto(imageService.getImageById(imageId)), HttpStatus.OK);
    }

    @ApiOperation(value = "Deletes an image", nickname = "deleteImageById", notes = "Deletes an image based on given image ID.", tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/images/{id}"
    )
    public ResponseEntity<EmptyEntity> deleteImageById(@ApiParam(value = "address Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<>(imageService.removeImage(path, id), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns all images", nickname = "getAllImages", notes = "Returns all images, else empty collection", response = ImageDto.class, responseContainer = "List", tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ImageDto.class, responseContainer = "List") })
    @GetMapping(
            value = "/api/v1/images",
            produces = { "application/json" }
    )
    public ResponseEntity<List<ImageDto>> getAllImages() {

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    @ApiOperation(value = "Replace an image", nickname = "replaceImage", notes = "replace an image", response = ImageDto.class, tags={ "images", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user replace.", response = ImageDto.class) })
    @PutMapping(
            value = "/api/v1/images",
            produces = { "application/json" },
            consumes = { "multipart/form-data" }
    )
    public ResponseEntity<ImageDto> replaceImage(@ApiParam(value = "") @Valid @RequestParam(value = "file", required = false) MultipartFile file,
                                                 @ApiParam(value = "") @Valid @RequestParam(value = "imageId", required = false)  String imageId) {

        try {
            return new ResponseEntity<>(Image.toDto(imageService.replaceImageById(imageId, path, file)), HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}


