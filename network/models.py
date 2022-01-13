from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='User')
    text = models.CharField(max_length=400, null=False)
    likes = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    def serialize(self):
        return {
            "id": self.id,
            'user': self.user.username,
            "text": self.text,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes
        }
