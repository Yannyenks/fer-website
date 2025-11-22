<?php
// Appelle TON vrai serveur PHP
require_once __DIR__ . '/../server/server.php';

// Récupère la route demandée
$path = $_GET['path'] ?? '';

echo run_api($path, $_SERVER['REQUEST_METHOD']);   // Fonction que tu écriras dans server.php
