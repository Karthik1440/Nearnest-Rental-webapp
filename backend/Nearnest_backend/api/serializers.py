from rest_framework import serializers
from cloudinary_storage.storage import MediaCloudinaryStorage
from .models import User, Property, Amenity, PropertyImage
from .models import User 
from .models import Enquiry



class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url', 'property']

    def get_image_url(self, obj):
        return obj.image_url.url if obj.image_url else None
    
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id','property' ,'amenity_name']
class OwnerSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'name', 'email','phone','profile_image',]
    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url  # Returns full Cloudinary URL
        return None

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    owner = OwnerSerializer(read_only=True)  # ✅ NOT 'user'
    
    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'owner': {'write_only': True}
        }
    def get_owner_profile_image(self, obj):
        if obj.user.profile_image:
            return obj.user.profile_image.url
        return None

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'profile_image', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_profile_image(self, obj):
        return obj.profile_image.url if obj.profile_image else None

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'phone', 'profile_image', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
class EnquirySerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['user']

    def validate_property(self, value):
        if not value:
            raise serializers.ValidationError("Property is required.")
        return value
    
