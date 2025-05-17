from django.urls import path
from .views import register_user, login_user, get_user_details, logout_user
from rest_framework_simplejwt.views import ( # type: ignore
    TokenRefreshView,
)


urlpatterns = [
    path('register', register_user),
    path('login', login_user),
    path('user', get_user_details),
    path('logout', logout_user),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]