<?php
    // search.php

    // 连接数据库
    $servername = "localhost";
    $username = "your_username";
    $password = "your_password";
    $dbname = "wyk";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
      die("数据库连接失败: " . $conn->connect_error);
    }

    // 处理搜索请求
    if (isset($_GET['keyword'])) {
      $keyword = $_GET['keyword'];

      // 查询数据库
      $sql = "SELECT * FROM images WHERE title LIKE '%$keyword%' OR tag LIKE '%$keyword%'";
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
        // 显示查询结果
        while ($row = $result->fetch_assoc()) {
          echo "<tr>";
          echo "<td>" . $row['title'] . "</td>";
          echo "<td>" . $row['tag'] . "</td>";
          echo "<td>< img src='" . $row['path'] . "' alt=''></td>";
          echo "</tr>";
        }
      } else {
        echo "<tr><td colspan='3'>没有找到匹配的结果</td></tr>";
      }
    }

    $conn->close();
    ?>