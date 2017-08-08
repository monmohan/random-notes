package com.example.redis;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RedissampleApplicationTests {
  @Autowired
  RedisConnectionFactory rcf;

  @Autowired
  private RedisTemplate<String, String> template;


	@Test
	public void testRedisBinaryData() throws Exception {
    byte[] sz=new byte[16867024];//file size 16 MB nearly
    InputStream in=this.getClass().getResourceAsStream("/testimage.jpg");
    in.read(sz);
    byte[] key="image".getBytes();
    rcf.getClusterConnection().set(key,sz);
    //now read and compare
    byte[] fromRedis=rcf.getClusterConnection().get(key);

    Assert.assertArrayEquals( sz, fromRedis);

	}

}
