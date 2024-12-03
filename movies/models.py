from django.db import models

class Movie(models.Model):
    poster_link = models.URLField(max_length=500)
    series_title = models.CharField(max_length=255)
    released_year = models.IntegerField(null=True, blank=True)
    certificate = models.CharField(max_length=50, null=True, blank=True)
    runtime = models.CharField(max_length=50)
    genre = models.CharField(max_length=255)
    imdb_rating = models.FloatField()
    overview = models.TextField(null=True, blank=True)
    meta_score = models.IntegerField(null=True, blank=True)
    director = models.CharField(max_length=255)
    star1 = models.CharField(max_length=255)
    star2 = models.CharField(max_length=255)
    star3 = models.CharField(max_length=255)
    star4 = models.CharField(max_length=255)
    no_of_votes = models.IntegerField()
    gross = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.series_title

