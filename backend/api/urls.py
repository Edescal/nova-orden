from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"productos", views.ProductoViewSet, basename="producto")
router.register(r"categorias", views.CategoriaViewSet, basename="categorias")
router.register(r"ordenes", views.OrdenViewSet, basename="ordenes")
router.register(r"wrappers", views.ProductoWrapperViewSet, basename="wrappers")
router.register(r"negocios", views.NegocioViewSet, basename="negocios")

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),    
    path('register/', views.register_view, name='api-register'),    
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.jwt_logout, name='token_logout'),
    path('whoami/', views.create_post, name='token_refresh'),

] + router.urls
