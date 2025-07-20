from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    PropertyViewSet,
    AmenityViewSet,
    PropertyImageViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'property-images', PropertyImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
