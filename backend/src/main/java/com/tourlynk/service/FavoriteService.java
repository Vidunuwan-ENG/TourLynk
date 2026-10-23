package com.tourlynk.service;

import com.tourlynk.dto.FavoriteDto;
import com.tourlynk.dto.VehicleDto;
import com.tourlynk.entity.Favorite;
import com.tourlynk.entity.User;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.FavoriteRepository;
import com.tourlynk.repository.UserRepository;
import com.tourlynk.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleService vehicleService;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           VehicleService vehicleService) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleService = vehicleService;
    }

    @Transactional(readOnly = true)
    public List<FavoriteDto> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return favorites.stream()
                .map(f -> {
                    VehicleDto vDto = vehicleService.toDto(f.getVehicle(), userId, null, null);
                    return new FavoriteDto(f.getId(), userId, vDto, f.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(Long userId, Long vehicleId) {
        if (favoriteRepository.existsByUserIdAndVehicleId(userId, vehicleId)) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        Favorite favorite = new Favorite(user, vehicle);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long vehicleId) {
        favoriteRepository.deleteByUserIdAndVehicleId(userId, vehicleId);
    }
}

