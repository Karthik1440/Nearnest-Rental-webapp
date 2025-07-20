from rest_framework import serializers
from .models import User, Property, Amenity, PropertyImage


# serializers.py

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        try:
            if hasattr(obj.image_url, 'url'):
                return obj.image_url.url
        except Exception as e:
            print(f"Error getting image URL: {e}")
        return None


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'amenity_name']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'property_name', 'owner_name', 'monthly_rent',
            'deposit_amount', 'area_sqft', 'city', 'full_address',
            'contact_number', 'zoning', 'additional_details',
            'latitude', 'longitude', 'created_at',
            'images', 'amenities'
        ]



class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'profile_image', 'created_at']

    def get_profile_image(self, obj):
        try:
            return obj.profile_image.url if obj.profile_image else None
        except Exception:
            return None
