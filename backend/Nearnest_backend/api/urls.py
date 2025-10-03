from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # ✅ CORRECT
from rest_framework.decorators import api_view, permission_classes
from .views import current_user



from .views import (
    UserViewSet,
    PropertyViewSet,
    AmenityViewSet,
    PropertyImageViewSet,
    register_user,
    login_user,
    google_login,
    UserProfileView,
    UploadProfileImageView,
    DeleteProfileImageView,
    MyPropertiesViewSet,
    EnquiryViewSet,
    MyReceivedEnquiriesViewSet,
  
   
)



router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'property-images', PropertyImageViewSet)
router.register(r'my-properties', MyPropertiesViewSet, basename='my-properties')
router.register(r'enquiries', EnquiryViewSet, basename='enquiries')
router.register(r'my-received-enquiries', MyReceivedEnquiriesViewSet, basename='my-received-enquiries')






urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user),
    path('login/', login_user),
    path('google-login/', google_login),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/upload-profile-image/', UploadProfileImageView.as_view()),
    path('user/delete-profile-image/', DeleteProfileImageView.as_view(), name='delete-profile-image'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/me/', current_user),
]

