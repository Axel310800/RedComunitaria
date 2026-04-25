import mysql.connector
from mysql.connector import Error
from config import settings

def get_db_connection():
    """Crea una conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME
        )
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Conectado a MySQL Server versión {db_info}")
        return connection
    except Error as e:
        print(f"❌ Error al conectar: {e}")
        return None