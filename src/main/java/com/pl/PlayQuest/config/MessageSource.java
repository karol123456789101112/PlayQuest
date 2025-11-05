//package com.pl.PlayQuest.config;
//
//import org.springframework.context.MessageSource;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.support.ReloadableResourceBundleMessageSource;
//import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
//
//import java.util.Locale;
//
//@Configuration
//public class LocaleConfig extends AcceptHeaderLocaleResolver {
//
//    @Bean
//    public MessageSource messageSource() {
//        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
//        messageSource.setBasename("classpath:i18n/messages");
//        messageSource.setDefaultEncoding("UTF-8");
//        messageSource.setUseCodeAsDefaultMessage(true);
//        return messageSource;
//    }
//
//    @Override
//    public Locale resolveLocale(javax.servlet.http.HttpServletRequest request) {
//        String lang = request.getHeader("Accept-Language");
//        return (lang == null || lang.isEmpty()) ? Locale.ENGLISH : Locale.forLanguageTag(lang);
//    }
//}
