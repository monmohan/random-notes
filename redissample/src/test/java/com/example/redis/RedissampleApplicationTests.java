package com.example.redis;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RedissampleApplicationTests {
  @Autowired
  RedisConnectionFactory rcf;

  @Autowired
  private RedisTemplate<String, String> template;


	@Test
	public void testRedisConnection() {
    ValueOperations<String,String> ops=template.opsForValue();
    for(int i=0;i<10;i++){
      ops.set("KEY"+i,"VALUE"+i);
    }

    System.out.println("\nPRINTING KEYS ...");
    rcf.getClusterConnection().keys("*".getBytes()).stream().forEach(
            (k)->System.out.println(new String(k))
    );
   //always passes

	}

}
