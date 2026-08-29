package com.donation.security;

import com.donation.entity.User;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> {
                    String withPrefix = identifier.startsWith("+91") ? identifier : "+91 " + identifier;
                    String withoutPrefix = identifier.replace("+91", "").trim();
                    return userRepository.findByPhone(withPrefix)
                            .or(() -> userRepository.findByPhone(withoutPrefix));
                })
                .orElseThrow(() -> new UsernameNotFoundException("No user found with identifier: " + identifier));
        return new CustomUserDetails(user);
    }
}
