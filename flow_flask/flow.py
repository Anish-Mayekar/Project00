from flask import Flask, render_template, request
from spelling import spelling
import difflib
from web_scrap_apmc import web_scrap_apmc
from mystore import mystore
from news_rss import news_rss
from use_web import use_web
import json
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_all', methods=['POST'])
def get_all():
    data=request.json['data']
    crop=spelling(data['crop'])
    offline=web_scrap_apmc(data['state'],crop)
    offline = json.loads(offline)
    online=mystore(crop)
    online= json.loads(online)
    news_fin=news_rss(data['state'])
    news_fin= json.loads(news_fin)
    use_web()
    with open("offline_data.json", "w", encoding="utf-8") as f:
        json.dump(offline, f, indent=4, ensure_ascii=False)

    with open("online_data.json", "w", encoding="utf-8") as f:
        json.dump(online, f, indent=4, ensure_ascii=False)

    with open("news_data.json", "w", encoding="utf-8") as f:
        json.dump(news_fin, f, indent=4, ensure_ascii=False)

    return {"message": "Data saved successfully"}




if __name__ == "__main__":
    app.run(debug=True, port=5003)



