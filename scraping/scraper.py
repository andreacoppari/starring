import json
from imdb import Cinemagoer
from find_film import get_id
from sentiment_analysis import get_starring_rating

ia = Cinemagoer()
movies = []
count_movies = 1

with open("./data/movie_dataset.json", "w", encoding="utf8") as dataset:

    print("[*] Getting top 250 movies from IMDb.com")
    top250 = ia.get_top250_movies()
    print("[+] Done!")

    for m in top250:

        print(f"[o.o] Scraping movie {count_movies}/250")
        count_movies += 1

        print(f"[*] Getting movie informations about {m['title']}")
        movie = ia.get_movie(get_id(m["title"]))
        ia.update(movie, ['reviews'])
        print("[+] Done!")

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
