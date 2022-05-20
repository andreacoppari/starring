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
        movieID = get_id(m["title"])
        if movieID == "0": print("[-] ABORTED! Movie not found!");continue
        movie = ia.get_movie(movieID)
        ia.update(movie, ['reviews'])
        print("[+] Done!")

        try:
            if 'reviews' in movie.keys():

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
                    "cast": [actor["name"] for actor in cast],
                    "plot": plot,
                    "reviews": [review['content'] for review in reviews],
                    "cover": cover
                })
            
            else: print("[-] ABORTED! No reviews found!");continue
        except: print("[-] ABORTED! No reviews found!");continue
        print(f"\n\nThe Starring rating of {title} is {starring}\n\n")
    json.dump(movies, dataset, indent=4)
