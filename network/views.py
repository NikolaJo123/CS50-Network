import re
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models.fields import SmallAutoField
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, response
from django.shortcuts import render
from django.urls import reverse
import json
from json import dumps
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from .serializers import PostSerializer


from .models import User, Post, Profile


class PostView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-date')
    serializer_class = PostSerializer


def index(request):
    data = str(Post.objects.all())
    if request.method == "POST":
        if request.user.is_authenticated():
            #postform = PostForm
            return render(request, "network/index.html", {'user': request.user, 'post': data})
    else:
        return render(request, "network/index.html", {'post': data})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()

        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        profile = Profile(user=user)
        profile.save()
        print(f'created {profile}')
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


#>>>>>>>>>>>>>>>>> MY FUNCTIONS <<<<<<<<<<<<<<<<<<<<<<<


@csrf_exempt
@login_required
def create_post(request):
    user = request.user
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    text = data.get("text", "")
    posts = [txt.strip() for txt in text.split(",")]

    if posts == [""]:
        return JsonResponse({
            "error": "Must enter text."
        }, status=400)
    
    post = Post(
        user = user,
        text = text
    )
    post.save()

    return JsonResponse({"message": "Post created successfully"}, status=201)


def user_profile(request, username):
    user_posts = Post.objects.filter(user=username).order_by('-date')
    posts = []

    for i in range(len(user_posts)):
        posts.append({'date': user_posts[i].date.strftime('%H:%M %d %b %Y'), 'text': user_posts[i].text,
                      'likes': len(user_posts[i].likes.all())})

    return JsonResponse({
                         'posts': posts,
                         'request_user': str(request.user)
                         })


def user_requesting(request):
    user = None
    if str(request.user) != 'AnonymousUser':
        user = str(request.user)
    return JsonResponse({'user_requesting': user})


@login_required
@csrf_exempt
def follow(request, username):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    follow = data.get("follow")
    user = User.objects.get(username=username)
    user_profile = Profile.objects.get(user=request.user)

    if not follow:
        user_profile.following.add(user)
        user_profile.save()
        return JsonResponse({'status': 201, 'action': "Follow"})
    elif follow:
        user_profile.following.remove(user)
        user_profile.save()
        return JsonResponse({'status': 201, 'action': "Unfollow"})
    
    return JsonResponse({}, status=404)


@login_required
@csrf_exempt
def following_posts(request):
    all_posts = Post.objects.order_by('-date').all()
    user = Profile.objects.get(user=request.user)
    following_users = user.following.all()
    fpost = {}

    for user in following_users:
        for post in all_posts:
            if post.user == user:
                likes = post.likes.count()

                if str(user) in fpost:
                    fpost[str(user)].append({'id': post.id, 'text': post.text, 'date': post.date, 'likes': likes})
                else:
                    fpost[str(user)] = [{'id': post.id, 'text': post.text, 'date': post.date, 'likes': likes}]
    
    return JsonResponse({'status': 201, 'post': fpost})


@login_required
@csrf_exempt
def like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # print(data)
        post_id = data.get("id")
        post = Post.objects.get(id=post_id)
        user = User.objects.get(username=request.user)
        liked = True
        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
            # print(f'{user} dont like')
        else:
            post.likes.add(user)
            # print(f'{user} likes')
        post.save()
        likes = post.likes.count()
        return JsonResponse({'status': 201, 'liked': liked, 'likes': likes})


@login_required
@csrf_exempt
def like_status(request):
    # print('requesting like status')
    if request.method == 'POST':
        data = json.loads(request.body)
        post_id = data.get("id")
        post = Post.objects.get(id=post_id)
        user = User.objects.get(username=request.user)
        liked = False

        if user in post.likes.all():
            liked = True
            
        return JsonResponse({'status': 201, 'liked': liked})

