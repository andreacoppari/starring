import json
from imdb import Cinemagoer
from find_film import get_id
from sentiment_analysis import get_starring_rating

ia = Cinemagoer()
movies = []

with open("./data/movie_dataset.json", "w", encoding="utf8") as dataset:

    top250 = ia.get_top250_movies()

    for m in top250:

        movie = ia.get_movie(get_id(m["title"]))
        ia.update(movie, ['reviews'])

        if 'reviews' in movie.current_info:

            rating = movie["rating"]
            reviews = movie["reviews"]
            cast = movie["cast"]
            genres = movie["genres"]
            title = movie["title"]
            year = movie["year"]
            plot = movie["plot"]
            cover = movie["cover url"]

            starring = get_starring_rating(reviews)

            movies.append({
                "title": title,
                "year": year,
                "rating": rating,
                "Starring rating": starring,
                "genres": genres,
                "cast": cast,
                "plot": plot,
                "reviews": reviews,
                "cover": cover
            })
        
        else:

            rating = movie["rating"]
            reviews = "No reviews available"
            cast = movie["cast"]
            genres = movie["genres"]
            title = movie["title"]
            year = movie["year"]
            plot = movie["plot"]
            cover = movie["cover url"]

            starring = "N/A"

            movies.append({
                "title": title,
                "year": year,
                "rating": rating,
                "Starring rating": starring,
                "genres": genres,
                "cast": cast,
                "plot": plot,
                "reviews": reviews,
                "cover": cover
            })            

        print(f"\n\nThe Starring rating of {title} is {starring}\n\n")
    json.dump(movies, dataset, indent=4)
