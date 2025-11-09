from django.test import TestCase
from django.db import transaction
from . import models
import csv
from pathlib import Path

NEGOCIO_ID = "1697f337f33e43cbb85f4a68d92b0fed"
categorias = {
    1: 'Bebidas calientes',
    2: 'Bebidas frías',
    3: 'Snacks',
    4: 'Panes',
}
productos = [
    # === BEBIDAS CALIENTES ===
    {"nombre": "Café americano", "descripcion": "Un Pure Black diluído en 120 ml de agua (160 ml)", "precio": 50, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Macchiato", "descripcion": "Pure Black (36 ml) con una pequeña cantidad de leche vaporizada.", "precio": 56, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Cappuccino", "descripcion": "Café expreso con leche vaporizada y espuma abundante.", "precio": 60, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Latte", "descripcion": "Café con leche vaporizada y un toque de espuma.", "precio": 65, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Espresso", "descripcion": "Un shot concentrado de café puro (18 ml).", "precio": 45, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Moka", "descripcion": "Café con leche y chocolate espeso.", "precio": 68, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Chocolate caliente", "descripcion": "Leche vaporizada con cacao natural.", "precio": 55, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Té chai latte", "descripcion": "Té especiado con leche y espuma.", "precio": 62, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Té negro caliente", "descripcion": "Té negro servido a 85°C, sabor intenso.", "precio": 48, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},
    {"nombre": "Café cortado", "descripcion": "Espresso con un toque de leche caliente.", "precio": 52, "visible": 1, "imagen": "", "categoria_id": 1, "negocio_id": NEGOCIO_ID},

    # === BEBIDAS FRÍAS ===
    {"nombre": "Iced Latte", "descripcion": "Leche fría con café expreso servido con hielo.", "precio": 58, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Cold Brew", "descripcion": "Café infusionado en frío durante 12 horas.", "precio": 62, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Frappé de moka", "descripcion": "Café, hielo y chocolate batido con crema.", "precio": 70, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Smoothie de fresa", "descripcion": "Batido natural con fresa y yogurt frío.", "precio": 72, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Limonada frappé", "descripcion": "Refrescante bebida de limón con hielo molido.", "precio": 50, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Café frío con leche", "descripcion": "Café expreso enfriado con leche entera.", "precio": 60, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Frappé de vainilla", "descripcion": "Cremoso batido con extracto natural de vainilla.", "precio": 68, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Smoothie de mango", "descripcion": "Mango natural con hielo y limón.", "precio": 74, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Agua mineral con limón", "descripcion": "Agua con gas y rodajas frescas de limón.", "precio": 40, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},
    {"nombre": "Té helado", "descripcion": "Té negro frío con durazno o limón.", "precio": 45, "visible": 1, "imagen": "", "categoria_id": 2, "negocio_id": NEGOCIO_ID},

    # === SNACKS ===
    {"nombre": "Brownie", "descripcion": "Pastel de chocolate con trozos de nuez.", "precio": 40, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Galleta de avena", "descripcion": "Galleta artesanal con avena y pasas.", "precio": 25, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Galleta de chispas", "descripcion": "Galleta con chispas de chocolate.", "precio": 28, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Chips de plátano", "descripcion": "Rodajas de plátano crujientes.", "precio": 30, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Granola artesanal", "descripcion": "Mezcla de avena, coco y miel tostada.", "precio": 34, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Palomitas caramelizadas", "descripcion": "Palomitas cubiertas de caramelo dorado.", "precio": 33, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Mix de frutos secos", "descripcion": "Nueces, almendras y arándanos.", "precio": 38, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Barras de chocolate", "descripcion": "Mini barras con relleno de avellanas.", "precio": 36, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Mini donas", "descripcion": "Donitas glaseadas variadas.", "precio": 42, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},
    {"nombre": "Barra energética", "descripcion": "Avena y miel compactada con frutos secos.", "precio": 35, "visible": 1, "imagen": "", "categoria_id": 3, "negocio_id": NEGOCIO_ID},

    # === PANES ===
    {"nombre": "Croissant", "descripcion": "Pan de mantequilla suave y hojaldrado.", "precio": 35, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Concha", "descripcion": "Pan dulce mexicano con cubierta de azúcar.", "precio": 28, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Pan de elote", "descripcion": "Pan húmedo de maíz tierno, sabor casero.", "precio": 33, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Pan de plátano", "descripcion": "Pan dulce con plátano maduro y nuez.", "precio": 37, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Pan de queso", "descripcion": "Panecillo salado con queso fundido.", "precio": 36, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Baguette pequeño", "descripcion": "Pan francés crocante individual.", "precio": 32, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Muffin de arándano", "descripcion": "Panecillo suave con arándanos.", "precio": 39, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Muffin de chocolate", "descripcion": "Muffin oscuro con chips de cacao.", "precio": 39, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Orejas de hojaldre", "descripcion": "Pan dulce en forma de espiral crujiente.", "precio": 31, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
    {"nombre": "Pan de nuez", "descripcion": "Pan artesanal con nueces troceadas.", "precio": 38, "visible": 1, "imagen": "", "categoria_id": 4, "negocio_id": NEGOCIO_ID},
]

grupos_y_opciones = {
    # === BEBIDAS CALIENTES ===
    1: {  # Café americano
        "Café": [
            ("Single Shot (18 ml)", 0),
            ("Double Shot (36 ml)", 0),
            ("Extra Double Shot (+36 ml)", 15)
        ],
        "Leche": [
            ("Sin leche", 0),
            ("Con leche regular", 10),
            ("Leche sin lactosa", 10),
            ("Leche de avena", 13)
        ],
        "Tamaño": [
            ("Chico (240 ml)", 0),
            ("Mediano (360 ml)", 10),
            ("Grande (480 ml)", 15)
        ]
    },
    2: {  # Macchiato
        "Café": [
            ("Single Shot (18 ml)", 0),
            ("Double Shot (36 ml)", 5)
        ],
        "Leche": [
            ("Regular", 0),
            ("Deslactosada", 10),
            ("Avena", 13),
        ]
    },
    3: {  # Cappuccino
        "Leche": [
            ("Regular", 0),
            ("Deslactosada", 10),
            ("Avena", 13),
            ("Almendra", 15)
        ],
        "Endulzante": [
            ("Sin azúcar", 0),
            ("Miel natural", 5),
            ("Jarabe de vainilla", 7),
            ("Jarabe de caramelo", 7)
        ]
    },
    4: {  # Latte
        "Leche": [
            ("Regular", 0),
            ("Sin lactosa", 10),
            ("Avena", 13)
        ],
        "Tamaño": [
            ("Chico (240 ml)", 0),
            ("Grande (480 ml)", 10)
        ]
    },
    5: {  # Espresso
        "Intensidad": [
            ("Suave", 0),
            ("Medio", 0),
            ("Fuerte", 0)
        ]
    },
    6: {  # Moka
        "Cacao": [
            ("Leve", 0),
            ("Clásico", 0),
            ("Extra chocolate", 8)
        ],
        "Leche": [
            ("Regular", 0),
            ("Avena", 13),
            ("Almendra", 15)
        ]
    },
    7: {  # Chocolate caliente
        "Cacao": [
            ("Regular", 0),
            ("Oscuro", 5),
            ("Con canela", 5)
        ],
        "Leche": [
            ("Entera", 0),
            ("Avena", 10),
            ("Sin lactosa", 10)
        ]
    },
    8: {  # Té chai latte
        "Leche": [
            ("Entera", 0),
            ("Avena", 13),
            ("Deslactosada", 10)
        ],
        "Endulzante": [
            ("Sin azúcar", 0),
            ("Miel", 5),
            ("Jarabe de vainilla", 7)
        ]
    },
    9: {  # Té negro caliente
        "Endulzante": [
            ("Sin azúcar", 0),
            ("Azúcar morena", 0),
            ("Miel natural", 5)
        ]
    },
    10: {  # Café cortado
        "Leche": [
            ("Regular", 0),
            ("Deslactosada", 10)
        ],
        "Tamaño": [
            ("Chico", 0),
            ("Grande", 8)
        ]
    },

    # === BEBIDAS FRÍAS ===
    11: {  # Iced Latte
        "Leche": [
            ("Regular", 0),
            ("Sin lactosa", 10),
            ("Avena", 13)
        ],
        "Tamaño": [
            ("Mediano", 0),
            ("Grande", 10)
        ]
    },
    12: {  # Cold Brew
        "Tamaño": [
            ("Mediano", 0),
            ("Grande", 8)
        ],
        "Endulzante": [
            ("Sin azúcar", 0),
            ("Jarabe de vainilla", 7)
        ]
    },
    13: {  # Frappé de moka
        "Tamaño": [
            ("Chico", 0),
            ("Grande", 10)
        ],
        "Cremas": [
            ("Sin crema", 0),
            ("Crema batida", 8),
            ("Extra crema", 12)
        ]
    },
    14: {  # Smoothie de fresa
        "Toppings": [
            ("Sin topping", 0),
            ("Granola", 5),
            ("Crema batida", 7)
        ]
    },
    15: {  # Limonada frappé
        "Endulzante": [
            ("Natural", 0),
            ("Jarabe de menta", 5)
        ]
    },
    16: {  # Café frío con leche
        "Leche": [
            ("Regular", 0),
            ("Deslactosada", 10),
            ("Avena", 13)
        ]
    },
    17: {  # Frappé de vainilla
        "Sabor extra": [
            ("Solo vainilla", 0),
            ("Vainilla + caramelo", 8)
        ],
        "Cremas": [
            ("Sin crema", 0),
            ("Con crema batida", 8)
        ]
    },
    18: {  # Smoothie de mango
        "Toppings": [
            ("Sin topping", 0),
            ("Chía", 5),
            ("Granola", 6)
        ]
    },
    19: {  # Agua mineral con limón
        "Extras": [
            ("Sin hielo", 0),
            ("Con hielo", 0),
            ("Con menta", 4)
        ]
    },
    20: {  # Té helado
        "Sabor": [
            ("Limón", 0),
            ("Durazno", 0),
            ("Frutos rojos", 5)
        ]
    },

    # === SNACKS ===
    21: {  # Brownie
        "Extras": [
            ("Sin topping", 0),
            ("Con helado", 12),
            ("Con chocolate líquido", 5)
        ]
    },
    22: {},  # Galleta de avena (sin opciones)
    23: {},  # Galleta de chispas
    24: {},  # Chips de plátano
    25: {},  # Granola artesanal
    26: {},  # Palomitas caramelizadas
    27: {},  # Mix de frutos secos
    28: {},  # Barras de chocolate
    29: {},  # Mini donas
    30: {},  # Barra energética

    # === PANES ===
    31: {  # Croissant
        "Relleno": [
            ("Sin relleno", 0),
            ("Chocolate", 7),
            ("Queso", 8)
        ]
    },
    32: {},  # Concha
    33: {},  # Pan de elote
    34: {},  # Pan de plátano
    35: {},  # Pan de queso
    36: {},  # Baguette pequeño
    37: {},  # Muffin de arándano
    38: {},  # Muffin de chocolate
    39: {},  # Orejas de hojaldre
    40: {},  # Pan de nuez
}

def poblar_db():
    if models.Negocio.objects.count() > 0: 
        return
    
    with transaction.atomic():
        try:
            usuario = models.Usuario.objects.create_superuser(
                    email='eduardo1582000@gmail.com',
                    password='password',
                    nombre = 'Eduardo',
                    apellidos = 'Escalante Pacheco'
                )
            
            negocio = models.Negocio.objects.create(
                nombre = 'The Coffee',
                descripcion = 'Cafetería japonesa.',
                direccion = 'Calle 47 Colonia Centro, Mérida, Yucatán',
                telefono = '9992834323',
                usuario = usuario
            )

            for id, nombre in categorias.items():
                cat = models.Categoria.objects.create(
                    id = id,
                    nombre = nombre
                )

            for p in productos:
                categoria = models.Categoria.objects.get(id = p['categoria_id'])
                producto = models.Producto.objects.create(
                    nombre = p['nombre'],
                    descripcion = p['descripcion'],
                    precio = p['precio'],
                    imagen = p['imagen'],
                    categoria = categoria,
                    negocio = negocio,
                )

            for i, v in grupos_y_opciones.items():
                producto = models.Producto.objects.get(id = i)

                for nombre, opciones in v.items():
                    grupo = models.OptionGroup.objects.create(
                        descripcion = nombre,
                        producto = producto
                    )
                    
                    for descr, precio in opciones:
                        opcion = models.Option.objects.create(
                            descripcion = descr,
                            precio = precio,
                            group = grupo
                        )
        except Exception as e:
            print(f'Error: {e}')
            transaction.set_rollback(True)
        finally:
            print('Revisa si se pobló la base de datos')
