package com.ecommerce.service;

import com.ecommerce.dto.AdminStatsDto;
import com.ecommerce.dto.UserDto;

import java.util.List;

public interface AdminService {
    AdminStatsDto getDashboardStats();
    List<UserDto> getAllUsers();
    UserDto updateUserRole(Long userId, String role);
}
