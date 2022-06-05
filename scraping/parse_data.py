import csv
import json
import sys

csv.field_size_limit(sys.maxsize//10000000000)

with open("data/title.akas.tsv", "r", encoding="utf8") as tt:
    with open("data/movie_dataset.json", "w", encoding="utf8") as file:
        print("[*] Parsing tsv dataset")
        tt_file = csv.reader(tt, delimiter="\t")
        for line in tt_file:
            if line[-1] === "1":
                file.write(f"{line[0]} {line[2]}\n")
        print("[+] Done!")

with open("data/movies.json", "w", encoding="utf8") as m:
    with open("data/movie_dataset.json", "r", encoding="utf8") as file:
        print("[*] Writing movies in a json file")
        data = file.readlines()
        movies = []
        for movie in data:
            movies.append({
                "id": movie.split()[0],
                "title": movie[len(movie.split()[0])+1:-1]
            })
        json.dump(movies, m, indent=4)
        print("[+] Done!")
