<?php
function connect($db){
    try{
        $conn = new PDO("mysql:host=localhost;dbname=tarea", $db['root'], $db['password']);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    }catch(PDOException $exception){
        exit($exception->getMessage());
    }
}

$db = array(
    'root' => 'root',
    'password' => 'root'
);

$dbConn = connect($db);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    $nombre = $datos['nombre'];
    $estado = $datos['estado'];
    $input = $_POST;
    $sql = "INSERT INTO tareas (nombre, estado) VALUES(?, ?)";
    $statement = $dbConn->prepare($sql);
    $statement->execute([$nombre, $estado]);
    $postId = $dbConn->lastInsertId();
    if ($postId) {
        $input['id'] = $postId;
        header("HTTP/1.1 200 OK");
        echo json_encode($input);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM tareas";
    $statement = $dbConn->query($sql);
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data === null) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('message' => 'Error en los datos JSON'));
        exit();
    }

    $id = $data['id'];
    $nuevoNombre = $data['nombre'];
    $nuevoEstado = $data['estado'];
    $sql = "UPDATE tareas SET nombre=?, estado=? WHERE id=?";
    $statement = $dbConn->prepare($sql);
    $statement->execute([$nuevoNombre, $nuevoEstado, $id]);
    if ($statement->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        echo json_encode(array('message' => 'Tarea actualizada con éxito'));
        exit();
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(array('message' => 'No se encontró la tarea para actualizar'));
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data === null) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('message' => 'Error en los datos JSON'));
        exit();
    }

    $id = $data['id'];
    $sql = "DELETE FROM tareas WHERE id=?";
    $statement = $dbConn->prepare($sql);
    $statement->execute([$id]);
    if ($statement->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        echo json_encode(array('message' => 'Tarea eliminada con éxito'));
        exit();
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(array('message' => 'No se encontró la tarea para eliminar'));
        exit();
    }
}


?>