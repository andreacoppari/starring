import pymongo
import json

myclient = pymongo.MongoClient("mongodb+srv://starring-admin:§T4rr1ng@starring.7dedo.mongodb.net/?retryWrites=true&w=majority")
mydb = myclient["test"]
mycol = mydb["movies"]

with open("./data/movie_dataset.json", "r", encoding="utf8") as data:
    dataset = json.load(data)

mycol.insert_many(dataset)
