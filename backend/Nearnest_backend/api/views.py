from rest_framework import viewsets, permissions
from rest_framework import serializers
from .models import User, Property, Amenity, PropertyImage
from .serializers import (
    UserSerializer,
    PropertySerializer,
    AmenitySerializer,
    PropertyImageSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().prefetch_related('images', 'amenities')
    serializer_class = PropertySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer


class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def perform_create(self, serializer):
        image_file = self.request.FILES.get('image_url')
        if image_file:
            serializer.save(image_url=image_file)
        else:
            raise serializers.ValidationError({"image_url": "No image file provided."})
