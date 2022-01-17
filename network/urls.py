
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("show_post", views.PostView.as_view()),
    path("create_post", views.create_post, name="create_post"),
    path("user_profile/<str:username>", views.user_profile, name="user_profile"),
    path("get_user", views.user_requesting, name="get_user"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("following", views.following_posts),
    path("like", views.like, name="like"),
    path("like_status", views.like_status, name="like_status"),
    path("edit_post", views.edit_post, name="edit_post"),
]
