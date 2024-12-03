import csv
from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help = 'Load movies from IMDb CSV file'

    def handle(self, *args, **kwargs):
        try:
            with open('movies/data/imdb_top_1000.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    try:
                        released_year = (
                            int(row['Released_Year']) 
                            if row['Released_Year'].isdigit() 
                            else None
                        )
                        Movie.objects.create(
                            poster_link=row['Poster_Link'],
                            series_title=row['Series_Title'],
                            released_year=released_year,
                            certificate=row.get('Certificate', None),
                            runtime=row['Runtime'],
                            genre=row['Genre'],
                            imdb_rating=float(row['IMDB_Rating']),
                            overview=row.get('Overview', 'No overview available'),
                            meta_score=int(row['Meta_score']) if row['Meta_score'].isdigit() else None,
                            director=row['Director'],
                            star1=row['Star1'],
                            star2=row['Star2'],
                            star3=row['Star3'],
                            star4=row['Star4'],
                            no_of_votes=int(row.get('No_Of_Votes', 0)),
                            gross=row.get('Gross', None)
                        )
                    except ValueError as e:
                        self.stdout.write(self.style.WARNING(f"Skipping row due to value error: {e}"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("File not found"))
        self.stdout.write(self.style.SUCCESS('Movies loaded successfully'))
