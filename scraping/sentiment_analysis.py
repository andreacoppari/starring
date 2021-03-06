from transformers import pipeline

pipe = pipeline("text-classification", model="./model/")

def get_starring_rating(reviews):
    starring_rating = 0
    for review in reviews:
        print(f"Calculating Starring rating of {review['content'][0:40]}...")
        #correction for pipeline limits
        if len(review["content"].split()) > 250:
            length = len(review["content"])
            out1 = int(pipe(review['content'][0:length//6])[0]['label'][0])
            out2 = int(pipe(review['content'][length//6:2*length//6])[0]['label'][0])
            out3 = int(pipe(review['content'][2*length//6:3*length//6])[0]['label'][0])
            out4 = int(pipe(review['content'][3*length//6:4*length//6])[0]['label'][0])
            out5 = int(pipe(review['content'][4*length//6:5*length//6])[0]['label'][0])
            out6 = int(pipe(review['content'][5*length//6:])[0]['label'][0])
            output = (out1+out2+out3+out4+out5+out6)*2/6
        else:
            output = int(pipe(review['content'])[0]['label'][0])*2
        starring_rating += output
    starring_rating = round(starring_rating/len(reviews), 2)
    return starring_rating
