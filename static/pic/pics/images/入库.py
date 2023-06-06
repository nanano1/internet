import os
from datetime import datetime
import pymysql

# 连接数据库
connection = pymysql.connect(
    host='localhost',
    user='star',
    password='star2003-0',
    database='wyk'
)

try:
    with connection.cursor() as cursor:
        # 获取当前时间
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # 遍历照片目录
        photo_dir = "./static/pic/纹样/西兰卡普"  # 替换为你的照片目录路径，相对于app.js所在的根目录
        for filename in os.listdir(photo_dir):
            if filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png'):
                file_path = os.path.join(photo_dir, filename)

                # 获取文件大小
                file_size = os.path.getsize(file_path)

                # 获取图片尺寸
                with open(file_path, 'rb') as file:
                    dimensions = file.read(2)
                    width = dimensions[0]
                    height = dimensions[1]

                # 插入数据到 Upload 表
                upload_sql = "INSERT INTO Upload (user_id, title, description, image_type, image_size, image_dimensions, image_tag, status, upload_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                upload_values = (1, filename, filename, '纹样', file_size, f'{width}x{height}', '西兰卡普', '审核通过', current_time)
                cursor.execute(upload_sql, upload_values)

                # 获取插入的 upload_id
                upload_id = cursor.lastrowid

                # 插入数据到 Image 表
                image_sql = "INSERT INTO Image (upload_id, image_path) VALUES (%s, %s)"
                image_values = (upload_id, file_path)
                cursor.execute(image_sql, image_values)

        # 提交事务
        connection.commit()

        print("照片添加成功！")

finally:
    # 关闭数据库连接
    connection.close()
