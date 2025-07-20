from django.db import models
from cloudinary.models import CloudinaryField


class User(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    profile_image = CloudinaryField('Profile Image', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Property(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    property_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=200)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    area_sqft = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    full_address = models.TextField()
    contact_number = models.CharField(max_length=10)
    zoning = models.CharField(max_length=200)
    additional_details = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property_name} - {self.city}"


class Amenity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='amenities')
    amenity_name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.amenity_name} @ {self.property.property_name}"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image_url = CloudinaryField('Property Image')

    def __str__(self):
        if self.property and self.property.property_name:
            return f"Image for {self.property.property_name}"
        return f"PropertyImage #{self.pk}"
