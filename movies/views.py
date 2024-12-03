from django.core.paginator import Paginator
from django.http import JsonResponse
from .models import Movie

def movies_list_api(request):
    page = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', 14)
    movies = Movie.objects.all().values(
        'poster_link', 'series_title', 'released_year', 'certificate',
        'runtime', 'genre', 'imdb_rating', 'overview', 'meta_score',
        'director', 'star1', 'star2', 'star3', 'star4', 'no_of_votes', 'gross'
    )
    paginator = Paginator(movies, per_page)
    current_page = paginator.get_page(page)

    return JsonResponse({
        'movies': list(current_page.object_list),
        'page': current_page.number,
        'total_pages': paginator.num_pages,
        'total_movies': paginator.count,
    })

import matplotlib.pyplot as plt
from django.http import HttpResponse
from .models import Movie

def high_rated_movies_by_year(request):
    movies = Movie.objects.filter(imdb_rating__gte=8.0).values('released_year', 'imdb_rating')
    data = {}
    for movie in movies:
        year = movie['released_year']
        if year in data:
            data[year].append(movie['imdb_rating'])
        else:
            data[year] = [movie['imdb_rating']]
    years = sorted(data.keys())
    avg_ratings = [sum(data[year]) / len(data[year]) for year in years]

    plt.figure(figsize=(10, 6))
    plt.plot(years, avg_ratings, marker='o', label='Average IMDb Rating')
    plt.title('High Rated Movies by Year', fontsize=16)
    plt.xlabel('Year', fontsize=14)
    plt.ylabel('Average IMDb Rating', fontsize=14)
    plt.grid()
    plt.legend()

    response = HttpResponse(content_type="image/png")
    plt.savefig(response, format="png")
    plt.close()
    return response


