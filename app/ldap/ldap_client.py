from ldap3 import Server, Connection, ALL
from app.core.config import settings


def extract_role(groups):
    groups = [g.lower() for g in groups]

    if any("diplomaadmins" in g for g in groups):
        return "manager"

    if any("diplomausers" in g for g in groups):
        return "worker"

    return "worker"


def authenticate(username: str, password: str):
    server = Server(settings.LDAP_SERVER, get_info=ALL)

    # 🔹 bind админом
    conn = Connection(
        server,
        user=settings.LDAP_USER_DN,
        password=settings.LDAP_PASSWORD,
        auto_bind=True
    )

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

    # 🔹 bind пользователем
    user_conn = Connection(
        server,
        user=user_dn,
        password=password
    )

    if not user_conn.bind():
        return None

    # 🔥 получаем группы
    groups = []
    if "memberOf" in user_entry:
        groups = user_entry.memberOf.values

    # 🔥 определяем роль
    role = extract_role(groups)

    # 🔥 DEBUG (можешь временно оставить)
    print("LDAP groups:", groups)
    print("ROLE:", role)

    return {
        "username": username,
        "role": role
    }