from transformers import pipeline

pipe = pipeline("text-classification", "nlptown/bert-base-multilingual-uncased-sentiment")
pipe.save_pretrained("./model/")