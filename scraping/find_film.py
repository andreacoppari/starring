import json

def get_id(movie):
    with open("data/movies.json", "r", encoding="utf8") as m:
        data = json.load(m)

        for mov in data:
            if movie.lower() == mov["title"].lower():
                return mov['id'][2:]
