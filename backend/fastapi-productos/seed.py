from sqlmodel import Session, SQLModel, select

from app.core.database import engine
from app.core.security import hash_password
from app.modules.categorias.model import Categoria
from app.modules.productos.model import Producto
from app.modules.usuarios.model import Usuario


CATEGORIES = [
    ("Hamburguesas", "Hamburguesas y sandwiches"),
    ("Pizzas", "Pizzas artesanales"),
    ("Bebidas", "Bebidas frías y calientes"),
]

PRODUCTS = [
    ("Hamburguesa clásica", "Carne, queso y vegetales", 6500, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", 20, "Hamburguesas"),
    ("Hamburguesa completa", "Doble carne y extras", 8200, "https://images.unsplash.com/photo-1550547660-d9450f859349", 15, "Hamburguesas"),
    ("Pizza muzarella", "Muzarella y salsa casera", 7000, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", 18, "Pizzas"),
    ("Pizza napolitana", "Muzarella, tomate y ajo", 7600, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", 12, "Pizzas"),
    ("Limonada", "Limonada natural", 1800, "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e", 30, "Bebidas"),
    ("Coca Cola", "Gaseosa fría", 2200, "https://images.unsplash.com/photo-1554866585-cd94860890b7", 25, "Bebidas"),
    ("Café", "Café recién preparado", 1600, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", 25, "Bebidas"),
    ("Helado", "Helado artesanal", 2400, "https://images.unsplash.com/photo-1563805042-7684c019e1cb", 15, "Bebidas"),
]


def seed():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        admin = session.exec(select(Usuario).where(Usuario.username == "admin")).first()
        if admin is None:
            admin = Usuario(
                username="admin",
                full_name="Administrador",
                email="admin@foodstore.local",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
                disabled=False,
            )
            session.add(admin)

        categories = {}
        for name, description in CATEGORIES:
            category = session.exec(select(Categoria).where(Categoria.nombre == name)).first()
            if category is None:
                category = Categoria(nombre=name, descripcion=description, activo=True)
                session.add(category)
                session.flush()
            categories[name] = category

        for name, description, price, image, stock, category_name in PRODUCTS:
            product = session.exec(select(Producto).where(Producto.nombre == name)).first()
            if product is None:
                product = Producto(
                    nombre=name,
                    descripcion=description,
                    precio_base=price,
                    imagen_url=image,
                    stock=stock,
                    disponible=True,
                    activo=True,
                    categoria_id=categories[category_name].id,
                )
                session.add(product)

        session.commit()
    print("Seed ejecutado: admin, categorías y productos verificados.")


if __name__ == "__main__":
    seed()
