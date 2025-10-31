from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"productos", views.ProductoViewSet, basename="producto")
router.register(r"categorias", views.CategoriaViewSet, basename="categorias")
router.register(r"ordenes", views.OrdenViewSet, basename="ordenes")
router.register(r"wrappers", views.ProductoWrapperViewSet, basename="wrappers")

urlpatterns = router.urls
