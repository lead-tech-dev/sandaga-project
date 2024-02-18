package com.mjtech.sandaga.config;


import com.mjtech.sandaga.webservice.MondialRelayClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

@Configuration
public class MondialRelayConfig {
    @Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        // this package must match the package in the <generatePackage> specified in
        // pom.xml
        marshaller.setContextPath("fr.mondialrelay.webservice");
        return marshaller;
    }

    @Bean
    public MondialRelayClient mondialRelayClient(Jaxb2Marshaller marshaller) {
        MondialRelayClient client = new MondialRelayClient();
        client.setDefaultUri("https://www.mondialrelay.fr/webservice/Web_Services.asmx?WSDL");
        client.setMarshaller(marshaller);
        client.setUnmarshaller(marshaller);
        return client;
    }
}
