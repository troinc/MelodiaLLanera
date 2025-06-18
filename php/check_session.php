<?php
session_start();

header('Content-Type: application/json');

$response = [
    'loggedIn' => false,
    'role' => null
];

if (isset($_SESSION['cod_cli'])) {
    $response['loggedIn'] = true;
    if (isset($_SESSION['user_role'])) {
        $response['role'] = $_SESSION['user_role'];
    }
}

echo json_encode($response);
?>