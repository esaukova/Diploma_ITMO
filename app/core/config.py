from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_URL: str = "firebird+firebird://sysdba:masterkey@firebird:3050/db.fdb"
    SECRET_KEY: str = "supersecret"

    LDAP_SERVER: str = "ldaps://192.168.1.74"
    LDAP_BASE_DN: str = "DC=diploma,DC=itmo"
    LDAP_USER_DN: str = "CN=Administrator,CN=Users,DC=diploma,DC=itmo"
    LDAP_PASSWORD: str = "qqqwww12!"


settings = Settings()