from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='User')
    user = models.ForeignKey(User, to_field='username', on_delete=models.CASCADE, related_name='User')
    text = models.CharField(max_length=400, null=False)
    likes = models.ManyToManyField(User, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} posts at {self.date}'


class Profile(models.Model):
    user = models.ForeignKey(User, to_field='username', on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, blank=True, related_name="follower")
    following = models.ManyToManyField(User, blank=True, related_name="following")

    def __str__(self):
        return f'{self.user}'
