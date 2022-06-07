# Starring

[Starring](http://starring-client.herokuapp.com) è una piattaforma che nasce con l'intento di rivalutare le recensioni sui film lasciate dagli utenti di IMDb.com. Al fine di ottenere un nuovo star rating le recensioni vengono analizzate da un'intelligenza artificiale che esegue un text-classification task sul testo delle recensioni, attribuendo ad ognuna di esse un nuovo valore compreso tra 1 e 10.

Nelle prime implementazioni la piattaforma considera solo le recensioni valutate più utili da IMDb, ovvero quelle più votate dagli utenti, poiché calcolare lo "Starring rating" prendendo tutte le recensioni di tutti i film (~10 milioni di film) sarebbe troppo dispendioso in termini di tempo. Bisogna però sottolineare che in molti casi nonostante il numero ridotto di recensioni, i risultati sono notevoli in quanto a vicinanza al voto della Metacritica.

## Usage

Starring è stata deployata tramite Heroku, è attualmente online all'indirizzo [http://starring-client.herokuapp.com](http://starring-client.herokuapp.com).

Per provarla in locale invece, clonare il repository e lanciare:

```bash
make install
```
Successivamente lanciare:
```bash
make client
```
L'applicazione sarà accessibile tramite [http://localhost:1234](http://localhost:1234).

## Testing

Per lanciare i test:
```bash
make test
```
Dato un problema che non siamo riusciti a risolvere durante il secondo Sprint, il processo non termina alla fine dei test, procedete pure con Ctrl+C.

## Project team

* Andrea Coppari, 209198
* Mattias Trettel, 209950
* Tobias Carcereri, 209493
* Stefano Rizzi, 209684

## Sentiment-analysis

Al fine di calcolare lo Starring rating è stata utilizzato un [modello](https://huggingface.co/nlptown/bert-base-multilingual-uncased-sentiment) da [Hugging Face](https://huggingface.co), che effettua una multi-label text classification tra le classi "[1, 2, 3, 4, 5] stars". Lo Starring rating non è altro che la media tra questi voti ottenuti.

È possibile effettuare una demo del calcolo con dati reali ottenuti in tempo reale da IMDb direttamente da questo repository, sono necessari [Poetry](https://python-poetry.org/docs/#installation) e [Pyenv](https://github.com/pyenv/pyenv#installation). 

```bash
cd scraping/

# per installare (SOLO SU VIRTUAL ENVIRONMENT) le dipendenze necessarie e scaricare il modello di HF transformers
make install

# per lanciare lo scraper integrato con il calcolo dello Starring rating
make scrape
```

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
