package com.pranamitra.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pranamitra.entity.Notification;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications retrieved successfully.", notifications));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Unread count retrieved successfully.", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read successfully.", null));
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "All notifications marked as read successfully.", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification deleted successfully.", null));
    }
}
