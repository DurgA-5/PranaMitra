package com.pranamitra.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pranamitra.entity.Notification;
import com.pranamitra.entity.User;
import com.pranamitra.enums.RoleType;
import com.pranamitra.repository.NotificationRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.service.NotificationService;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void createNotification(User recipient, String title, String message, String type) {
        if (recipient == null) return;
        Notification notification = new Notification();
        notification.setRecipientUser(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Override
    public void createNotificationForRole(RoleType roleType, String title, String message, String type) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().getRoleName() == roleType)
                .toList();
        for (User user : users) {
            createNotification(user, title, message, type);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientUserIdAndReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(n -> !n.isRead())
                .toList();
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
