package com.veneda.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucket;
    private final String region;

    public S3Service(
            @Value("${app.aws.access-key}") String accessKeyId,
            @Value("${app.aws.secret-access-key}") String secretAccessKey,
            @Value("${app.aws.region}") String region,
            @Value("${app.aws.s3-bucket}") String bucket) {
        // Trimma för säkerhets skull
        String cleanAccess = accessKeyId.trim();
        String cleanSecret = secretAccessKey.trim();

        this.bucket = bucket;
        this.region = region;
        this.s3Client = S3Client.builder()
                .region(Region.of(region.trim()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(cleanAccess, cleanSecret)))
                .build();
    }

    public String upload(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "-" + file.getOriginalFilename();
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }
}
