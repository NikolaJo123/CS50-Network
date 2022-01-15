
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("show_post/", views.show_post, name="show_post"),
    path("create_post/", views.create_post, name="create_post"),
    path("user_profile/<int:user_id>", views.user_profile, name="user_profile"),
]
