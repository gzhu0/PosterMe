
import json
import numpy as np
import faiss

#Return array of the most similar vector
def findSimilarVectors(img):
    with open("data.json", "r") as file:
        data = json.load(file)

    titles = [item['title'] for item in data]
    urls = [item['poster_url'] for item in data]

    embeddings = []
    for item in data:
        # Use get() to safely access 'data' key (if it exists)
        data_item = item.get('data', None)
        if data_item is not None:
            embeddings.append(np.array(data_item).flatten())
        else:
            print("Missing 'data' key in item:", item)

    embeddings = np.array(embeddings, dtype='float32')

    d = embeddings.shape[1]

    index = faiss.IndexFlatL2(d)

    index.add(embeddings)

    k = 5

    img = np.array(img).flatten() #Flatten the image
    xq = img #INPUT VECTOR
    xq = np.array(xq, dtype='float32').reshape(1, -1)

    D, I = index.search(xq, k)  # search
    resultArr=[]
    for i in I[0]:
        resultArr.append(data[i])

    return resultArr