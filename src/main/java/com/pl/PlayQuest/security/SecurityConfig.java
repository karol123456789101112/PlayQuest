package com.pl.PlayQuest.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/login", "/categories", "/games", "/categories/add",
                                "/platforms","/platforms/add", "/games/add", "/upload-image", "/games/{id}",
                                "/platforms/{id}","/categories/{id}").permitAll() // Pozwól na te ścieżki bez uwierzytelniania
                        .anyRequest().permitAll() // Wszystkie inne żądania wymagają uwierzytelnienia
                )
                .csrf(csrf -> csrf.disable()) // Wyłącz CSRF
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS)) // Stateless, ponieważ JWT jest używane
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class) //filtr JWT;
                .cors();


        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // Dodajemy frontendowy adres
        configuration.addAllowedMethod("*"); // Pozwól na wszystkie metody HTTP
        configuration.addAllowedHeader("*"); // Pozwól na wszystkie nagłówki
        configuration.setAllowCredentials(true); // Pozwól na przesyłanie cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // CORS do wszystkich endpointów

        return source;
    }
}
