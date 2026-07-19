package com.pranamitra.service;

import java.util.List;
import com.pranamitra.entity.Notification;
import com.pranamitra.entity.User;
import com.pranamitra.enums.RoleType;

public interface NotificationService {

    void createNotification(User recipient, String title, String message, String type);

    void createNotificationForRole(RoleType roleType, String title, String message, String type);

    List<Notification> getNotificationsForUser(Long userId);

    long getUnreadCount(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void deleteNotification(Long notificationId);
}
