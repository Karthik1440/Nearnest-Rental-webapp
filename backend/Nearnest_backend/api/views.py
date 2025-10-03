from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User, Property, Amenity, PropertyImage
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import User  # ✅ Your custom User model
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework import viewsets, permissions
from .models import Enquiry
from .serializers import EnquirySerializer
from rest_framework import viewsets, permissions

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly



from cloudinary.uploader import upload
from .serializers import (
    UserSerializer,
    PropertySerializer,
    AmenitySerializer,
    PropertyImageSerializer
)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().prefetch_related('images', 'amenities')
    serializer_class = PropertySerializer
    authentication_classes = [JWTAuthentication]   # 🔐 REQUIRED for JWT
    permission_classes = [IsAuthenticatedOrReadOnly]  # 👈 Allow unauthenticated GETs
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Property.objects.all()
        category = self.request.query_params.get("category")
        if category:
            category = category.strip()  # ✅ Trim any accidental whitespace/newline
            queryset = queryset.filter(category__iexact=category)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            category = self.request.data.get('category', 'Residential')  # default fallback
            serializer.save(owner=self.request.user, category=category)
        else:
            raise PermissionDenied("Authentication required to create a property.")
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update_profile_image')
    def update_profile_image(self, request, pk=None):
        user = self.get_object()
        profile_image = request.data.get('profile_image', None)

        if profile_image:
            user.profile_image = profile_image
            user.save()
            return Response({
                "profile_image": user.profile_image.url if user.profile_image else None
            })
        return Response({"error": "No image provided"}, status=400)

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(
            property_id=self.request.data.get('property'),
            image_url=self.request.FILES.get('image_url')  # ✅ must pass uploaded file!
      )

@api_view(['POST'])
def register_user(request):
    data = request.data
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already exists'}, status=400)

    user = User.objects.create(
        name=data['name'],
        email=data['email'],
        password=make_password(data['password']),
        phone=data['phone']
    )
    serializer = UserSerializer(user)
    return Response(serializer.data, status=201)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
        if check_password(password, user.password):
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    try:
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'No credential provided'}, status=status.HTTP_400_BAD_REQUEST)

        # VERIFY Google ID token
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            "195994796509-3t3ninfdh2lunekufgqh84sukujc04cu.apps.googleusercontent.com",  # your actual client ID
        )

        email = idinfo.get('email')
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': name,
                'profile_image': picture  # If using CloudinaryField or URLField
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'profile_image': user.profile_image.url if user.profile_image else '',
            }
        })
    except ValueError:
        return Response({'error': 'Invalid Google token'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "profile_image": user.profile_image.url if user.profile_image else None,
        }
        return Response(data, status=status.HTTP_200_OK)


class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def patch(self, request):
        user = request.user
        profile_image = request.data.get('profile_image')
        if profile_image:
            user.profile_image = profile_image
            user.save()
            return Response({"profile_image": user.profile_image.url}, status=200)
        return Response({"error": "No image provided"}, status=400)

class DeleteProfileImageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.profile_image = None
        user.save()
        return Response({"message": "Profile image deleted."}, status=status.HTTP_200_OK)

class MyPropertiesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        properties = Property.objects.filter(owner=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Enquiry.objects.filter(property__owner=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class MyReceivedEnquiriesViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EnquirySerializer

    def get_queryset(self):
        return Enquiry.objects.filter(property__owner=self.request.user).order_by('-created_at')
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'name': user.name
    })

