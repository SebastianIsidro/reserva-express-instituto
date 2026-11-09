package com.reservaexpress.app.security;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reservaexpress.app.model.Auth;
import com.reservaexpress.app.serviceimplement.UserDetailsImplement;
import com.reservaexpress.app.util.Token;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter{

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {

		Auth authCredentials = new Auth();
		
		try {
			authCredentials = new ObjectMapper().readValue(request.getReader(), Auth.class);
		} catch (Exception e) {
		}
		
		UsernamePasswordAuthenticationToken userPAT = new UsernamePasswordAuthenticationToken(
				authCredentials.getEmail(),
				authCredentials.getPassword(),
				Collections.emptyList()
				);
		
		return getAuthenticationManager().authenticate(userPAT);
	}
	
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {

		UserDetailsImplement userDetails = (UserDetailsImplement) authResult.getPrincipal();
		
		String token = Token.createToken(userDetails.getUserid(), userDetails.getUsername(), userDetails.getUserTypeId());
		
		response.addHeader("Authorization", "Bearer " + token);
		response.addHeader("Identifier", "User " + userDetails.getUserid());
		response.addHeader("usertype_id", String.valueOf(userDetails.getUserTypeId()));
		System.out.println("Tipo usuario " +userDetails.getUserTypeId());
		response.getWriter().flush();
		
		super.successfulAuthentication(request, response, chain, authResult);
	}
	
}
