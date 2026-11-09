package com.reservaexpress.app.util;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class Token {

	private final static String TOKEN_SECRETO = "9r0y3c702o2AR3s3v43xpr3ssXz9aQbL";
	private final static Long TOKEN_DURACION = 1_000L;
	
	public static String createToken(int id, String email, int usertypeId) {
		long expirationTime = TOKEN_DURACION * 60 * 60;
		Date expirationDate = new Date(System.currentTimeMillis() + expirationTime);
		
		Map<String, Object> map = new HashMap<>();
		map.put("id", id);
		
		return Jwts.builder()
				.setSubject(email)
				.setExpiration(expirationDate)
				.addClaims(map)
				.signWith(Keys.hmacShaKeyFor(TOKEN_SECRETO.getBytes()))
				.compact();
		
	}
	
	public static UsernamePasswordAuthenticationToken getAuth(String token) {
		try {
			Claims claims = Jwts.parserBuilder()
					.setSigningKey(TOKEN_SECRETO.getBytes())
					.build()
					.parseClaimsJws(token)
					.getBody();
			
			String email = claims.getSubject();
			
			return new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
		} catch (JwtException e) {
			return null;
		}
	}

}
