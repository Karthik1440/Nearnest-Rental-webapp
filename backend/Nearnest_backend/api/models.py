from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    profile_image = CloudinaryField('Profile Image', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return f"{self.name} ({self.email})"
    

class Property(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    property_name = models.CharField(max_length=255)
    category = models.CharField(max_length=150,default="Residential")
    owner_name = models.CharField(max_length=200)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    area_sqft = models.CharField(max_length=200, default='0 sqft', blank=True)
    city = models.CharField(max_length=200)
    full_address = models.TextField()
    contact_number = models.CharField(max_length=10,default='0000000000')
    zoning = models.CharField(max_length=200)
    additional_details = models.TextField(blank=True)
    available = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.property_name} - {self.city}"


class Amenity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='amenities')
    amenity_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.amenity_name} @ {self.property.property_name}"


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image_url = CloudinaryField('image', folder='property_images', null=False, blank=False)



class Enquiry(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE,related_name='enquiries')
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    message = models.TextField()
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    visit_date = models.DateField(null=True, blank=True)
    visit_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"Enquiry from {self.name} for {self.property.property_name}"
    
