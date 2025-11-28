-- Table pour stocker les invitations d'administrateurs
CREATE TABLE IF NOT EXISTS admin_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_by INT NOT NULL,
    email VARCHAR(255),
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    used_by INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
