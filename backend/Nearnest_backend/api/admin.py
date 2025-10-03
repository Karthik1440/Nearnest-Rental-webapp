from django.contrib import admin
from django.utils.html import format_html
from .models import User, Property, Amenity, PropertyImage


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email')


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('id', 'property_name', 'owner_name', 'monthly_rent', 'city','category', 'created_at',)
    search_fields = ('property_name', 'owner_name', 'city','category',)
    list_filter = ('city',)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'amenity_name')
    search_fields = ('amenity_name',)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'image_url')

    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" width="100" height="auto" />', obj.image_url.url)
        return "No Image"

    image_preview.short_description = 'Image'