from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='User')
    text = models.CharField(max_length=400, null=False)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user,
            "text": self.text,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes
        }
