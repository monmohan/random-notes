package com.example.redis.conf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * Created by monmohans on 8/6/17.
 */
@Component
public class Health {
  @Autowired
  RedisConnectionFactory rcf;

  @Autowired
  private RedisTemplate<String, String> template;

  @PostConstruct
  public void check(){
    ValueOperations<String,String> ops=template.opsForValue();
    for(int i=0;i<10;i++){
      ops.set("KEY"+i,"VALUE"+i);
    }

    System.out.println("\nPRINTING KEYS ...");
    rcf.getClusterConnection().keys("*".getBytes()).stream().forEach(
            (k)->System.out.println(new String(k))
    );
  }
}
