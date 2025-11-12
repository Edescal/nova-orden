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
    path('csrf/', views.set_csrf_token, name='api-csrf'),
    # path('session/', views.session_view, name='api-session'),
    # path('whoami/', views.whoami_view, name='api-whoami'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.get_session, name='api-session'),


    path('ultimas-ordenes/', views.ultimas_ordenes, name='ultimas-ordenes'),

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls
