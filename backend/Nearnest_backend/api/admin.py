from django.contrib import admin
from .models import User, Property, Amenity, PropertyImage


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email')


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('id', 'property_name', 'owner_name', 'monthly_rent', 'city', 'created_at')
    search_fields = ('property_name', 'owner_name', 'city')
    list_filter = ('city',)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'amenity_name')
    search_fields = ('amenity_name',)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'image_url')
