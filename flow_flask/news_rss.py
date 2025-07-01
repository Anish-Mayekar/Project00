# import feedparser
# import json

# # 🔹 Mapping states to their primary languages
# state_languages = {
#     "Andaman and Nicobar": ("hi", "पूरा लेख पढ़ें"),
#     "Andhra Pradesh": ("te", "సంపూర్ణ కథనాన్ని చదవండి"),
#     "Arunachal Pradesh": ("hi", "पूरा लेख पढ़ें"),
#     "Assam": ("as", "সম্পূর্ণ প্ৰবন্ধ পঢ়ক"),
#     "Bihar": ("hi", "पूरा लेख पढ़ें"),
#     "Chhattisgarh": ("hi", "पूरा लेख पढ़ें"),
#     "Chandigarh": ("hi", "पूरा लेख पढ़ें"),
#     "Daman and Diu": ("gu", "સંપૂર્ણ લેખ વાંચો"),
#     "NCT of Delhi": ("hi", "पूरा लेख पढ़ें"),
#     "Dadra and Nagar Haveli": ("gu", "સંપૂર્ણ લેખ વાંચો"),
#     "Goa": ("kok", "पूर्ण लेख वाचा"),
#     "Gujarat": ("gu", "સંપૂર્ણ લેખ વાંચો"),
#     "Himachal Pradesh": ("hi", "पूरा लेख पढ़ें"),
#     "Haryana": ("hi", "पूरा लेख पढ़ें"),
#     "Jammu and Kashmir": ("ur", "مکمل مضمون پڑھیں"),
#     "Jharkhand": ("hi", "पूरा लेख पढ़ें"),
#     "Karnataka": ("kn", "ಪೂರ್ಣ ಲೇಖನವನ್ನು ಓದಿ"),
#     "Kerala": ("ml", "മുഴുവൻ ലേഖനം വായിക്കുക"),
#     "Lakshadweep": ("ml", "മുഴുവൻ ലേഖനം വായിക്കുക"),
#     "Meghalaya": ("en", "Read the full article"),
#     "Maharashtra": ("mr", "संपूर्ण लेख वाचा"),
#     "Madhya Pradesh": ("hi", "पूरा लेख पढ़ें"),
#     "Mizoram": ("lus", "Chhiar zel rawh"),
#     "Nagaland": ("en", "Read the full article"),
#     "Orissa": ("or", "ପୂର୍ଣ୍ଣ ଲେଖ ପଢନ୍ତୁ"),
#     "Punjab": ("pa", "ਪੂਰਾ ਲੇਖ ਪੜ੍ਹੋ"),
#     "Pondicherry": ("ta", "முழு கட்டுரையை படிக்கவும்"),
#     "Rajasthan": ("hi", "पूरा लेख पढ़ें"),
#     "Sikkim": ("ne", "पूरा लेख पढ़्नुहोस्"),
#     "Telangana": ("te", "సంపూర్ణ కథనాన్ని చదవండి"),
#     "Tamil Nadu": ("ta", "முழு கட்டுரையை படிக்கவும்"),
#     "Tripura": ("bn", "সম্পূর্ণ প্রবন্ধ পড়ুন"),
#     "Uttarakhand": ("hi", "पूरा लेख पढ़ें"),
#     "Uttar Pradesh": ("hi", "पूरा लेख पढ़ें"),
#     "West Bengal": ("bn", "সম্পূর্ণ প্রবন্ধ পড়ুন"),
# }


# # 🔹 Select the state
# selected_state = "Andhra Pradesh"  # Change this to the required state
# language_code, caption = state_languages.get(selected_state, ("en", "Read the full article"))  # Default to English

# # 🔹 Google News RSS feed URL for agriculture-related topics
# rss_url = f"https://news.google.com/rss/search?q=farmers+OR+grains+OR+APMC+OR+kisan&hl={language_code}&gl=IN&ceid=IN:{language_code}"

# # 🔹 Parse RSS feed
# feed = feedparser.parse(rss_url)

# # 🔹 Convert news articles into JSON format
# news_list = []

# for entry in feed.entries[:10]:  # Get top 10 news articles
#     news_item = {
#         "title": entry.title,
#         "newspaper": entry.source.get("title", "Unknown"),  # Get source (if available)
#         "link": entry.link,
#         "caption": caption,  # Language-specific caption
#     }
#     news_list.append(news_item)

# # 🔹 Print JSON output
# print(json.dumps(news_list, indent=4, ensure_ascii=False))




import feedparser
import json

def news_rss(state):
    # 🔹 Mapping states to their primary languages
    state_languages = {
        "Andaman and Nicobar": ("hi", "पूरा लेख पढ़ें"),
        "Andhra Pradesh": ("te", "సంపూర్ణ కథనాన్ని చదవండి"),
        "Arunachal Pradesh": ("hi", "पूरा लेख पढ़ें"),
        "Assam": ("as", "সম্পূর্ণ প্ৰবন্ধ পঢ়ক"),
        "Bihar": ("hi", "पूरा लेख पढ़ें"),
        "Chhattisgarh": ("hi", "पूरा लेख पढ़ें"),
        "Chandigarh": ("hi", "पूरा लेख पढ़ें"),
        "Daman and Diu": ("gu", "સંપૂર્ણ લેખ વાંચો"),
        "NCT of Delhi": ("hi", "पूरा लेख पढ़ें"),
        "Dadra and Nagar Haveli": ("gu", "સંપૂર્ણ લેખ વાંચો"),
        "Goa": ("kok", "पूर्ण लेख वाचा"),
        "Gujarat": ("gu", "સંપૂર્ણ લેખ વાંચો"),
        "Himachal Pradesh": ("hi", "पूरा लेख पढ़ें"),
        "Haryana": ("hi", "पूरा लेख पढ़ें"),
        "Jammu and Kashmir": ("ur", "مکمل مضمون پڑھیں"),
        "Jharkhand": ("hi", "पूरा लेख पढ़ें"),
        "Karnataka": ("kn", "ಪೂರ್ಣ ಲೇಖನವನ್ನು ಓದಿ"),
        "Kerala": ("ml", "മുഴുവൻ ലേഖനം വായിക്കുക"),
        "Lakshadweep": ("ml", "മുഴുവൻ ലേഖനം വായിക്കുക"),
        "Meghalaya": ("en", "Read the full article"),
        "Maharashtra": ("mr", "संपूर्ण लेख वाचा"),
        "Madhya Pradesh": ("hi", "पूरा लेख पढ़ें"),
        "Mizoram": ("lus", "Chhiar zel rawh"),
        "Nagaland": ("en", "Read the full article"),
        "Orissa": ("or", "ପୂର୍ଣ୍ଣ ଲେଖ ପଢନ୍ତୁ"),
        "Punjab": ("pa", "ਪੂਰਾ ਲੇਖ ਪੜ੍ਹੋ"),
        "Pondicherry": ("ta", "முழு கட்டுரையை படிக்கவும்"),
        "Rajasthan": ("hi", "पूरा लेख पढ़ें"),
        "Sikkim": ("ne", "पूरा लेख पढ़्नुहोस्"),
        "Telangana": ("te", "సంపూర్ణ కథనాన్ని చదవండి"),
        "Tamil Nadu": ("ta", "முழு கட்டுரையை படிக்கவும்"),
        "Tripura": ("bn", "সম্পূর্ণ প্রবন্ধ পড়ুন"),
        "Uttarakhand": ("hi", "पूरा लेख पढ़ें"),
        "Uttar Pradesh": ("hi", "पूरा लेख पढ़ें"),
        "West Bengal": ("bn", "সম্পূর্ণ প্রবন্ধ পড়ুন"),
    }

    # 🔹 Get language code and caption for the state (default to English)
    language_code, caption = state_languages.get(state, ("en", "Read the full article"))

    # 🔹 Google News RSS feed URL for agriculture-related topics
    rss_url = f"https://news.google.com/rss/search?q=farmers+OR+grains+OR+APMC+OR+kisan&hl={language_code}&gl=IN&ceid=IN:{language_code}"

    # 🔹 Parse RSS feed
    feed = feedparser.parse(rss_url)

    # 🔹 Convert news articles into JSON format
    news_list = []

    for entry in feed.entries[:10]:  # Get top 10 news articles
        news_item = {
            "title": entry.title,
            "newspaper": entry.source.get("title", "Unknown"),  # Get source (if available)
            "link": entry.link,
            "caption": caption,  # Language-specific caption
        }
        news_list.append(news_item)

    return json.dumps(news_list, indent=4, ensure_ascii=False)

# Example usage:
# print(fetch_agriculture_news("Andhra Pradesh"))
