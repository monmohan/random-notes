package com.example.redis;

import com.example.redis.conf.Health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class RedisSampleApplication {
  @Autowired
  Health health;

  public static void main(String[] args) {
    new SpringApplicationBuilder(RedisSampleApplication.class).run();
  }

}
