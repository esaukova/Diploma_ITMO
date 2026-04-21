from ldap3 import Server, Connection, ALL
from app.core.config import settings


def authenticate(username: str, password: str):
    server = Server(settings.LDAP_SERVER, get_info=ALL)

    # сначала bind админом
    conn = Connection(
        server,
        user=settings.LDAP_USER_DN,
        password=settings.LDAP_PASSWORD,
        auto_bind=True
    )

    # ищем пользователя
    search_filter = f"(sAMAccountName={username})"

    conn.search(
        settings.LDAP_BASE_DN,
        search_filter,
        attributes=["memberOf", "distinguishedName"]
    )

    if not conn.entries:
        return None

    user_entry = conn.entries[0]
    user_dn = user_entry.distinguishedName.value

    # теперь пробуем логиниться под пользователем
    user_conn = Connection(
        server,
        user=user_dn,
        password=password
    )

    if not user_conn.bind():
        return None

    # проверяем группы
    groups = user_entry.memberOf.values if "memberOf" in user_entry else []

    role = "employee"

    for g in groups:
        if "DiplomaUsers" in g:
            role = "employee"

    return {
        "sub": username,
        "role": role
    }