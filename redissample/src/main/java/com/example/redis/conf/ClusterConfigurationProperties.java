package com.example.redis.conf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;

import java.util.Arrays;
import java.util.List;

/**
 * Created by monmohans on 8/6/17.
 */
@Configuration
public class ClusterConfigurationProperties {

  @Value("${CONTACTPOINTS}")
  private String CONTACTPOINTS;

  /**
   * Get initial collection of known cluster nodes in format {@code host:port}.
   */
  public List<String> getNodes() {
    List<String> nodes = Arrays.asList(CONTACTPOINTS.split(","));
    System.out.println("nodes = " + nodes);
    return nodes;
  }


  @Bean
  public RedisConnectionFactory connectionFactory() {

    return new JedisConnectionFactory(
            new RedisClusterConfiguration(getNodes()));
  }


}

