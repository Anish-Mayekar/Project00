# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# import time
# import re
# from dotenv import load_dotenv
# import os
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.action_chains import ActionChains
# from selenium.webdriver.chrome.options import Options
# import statistics
# load_dotenv()
# mystore = os.getenv("mystore")


# chrome_options = Options()
# chrome_options.add_argument("--headless")  # Run in background
# chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration (recommended for headless)
# chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
# chrome_options.add_argument("--disable-dev-shm-usage")



# # Set up the WebDriver
# driver = webdriver.Chrome(options=chrome_options)

# # Open the website
# driver.get(mystore)  # Replace with actual URL
# time.sleep(5)  # Wait for page to load

# # Find the search box and enter "wheat"
# search_box = driver.find_element(By.XPATH, '//*[@id="searchtext"]')  # Replace with actual XPATH
# search_box.send_keys("rice")
# search_box.send_keys(Keys.RETURN)
# time.sleep(5)  # Wait for results to load

# product_list_div = WebDriverWait(driver, 30).until(
#     EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'product-list-items')]"))
# )

# # Scroll to bring product list into view
# # driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", product_list_div)

# # Get all product elements within the list
# product_elements = product_list_div.find_elements(By.XPATH, ".//div[contains(@class, 'col product-grid-col')]")[:20]

# prices_per_kg = []


# for product in product_elements:
#     try:
#         # Extract seller name
#         seller_name = product.find_element(By.XPATH, ".//a[contains(@class, 'product_seller_name')]").text.strip()
#         product_name_element = product.find_element(By.XPATH, ".//div[contains(@class, 'product-name text-dark')]/a[contains(@class, 'twoline_ellipsis')]")
#         product_name = product_name_element.text.strip()
        
        
#         if any(keyword in seller_name.lower() for keyword in ["producer", "fpo"]) and not any(keyword in product_name.lower() for keyword in ["flour", "seeds"]):

#             # Extract price and weight
#             price_text = product.find_element(By.XPATH, ".//span[contains(@class, 'price-new')]").text.strip()
#             weight_text = product.find_element(By.XPATH, ".//div[contains(@class, 'product_netqty_unit text-dark ms-fs-14 my-1')]/span").text.strip()

#             # Extract numerical values
#             price = float(re.search(r"\d+", price_text.replace(",", "")).group())  # Extract price
#             weight = float(re.search(r"\d+", weight_text.replace(",", "")).group())  # Extract weight
            
#             # # Convert to kg if necessary (assumes weight in g or kg)
#             if "kg" in weight_text.lower():
#                 pass  # Do nothing, weight is already in kg
#             else:
#                 weight /= 1000  # Convert grams to kg
#             price_per_kg = price / weight
#             prices_per_kg.append(price_per_kg)

#             # print(f"{seller_name}, Price per kg: ₹{price_per_kg:.2f}")

#     except Exception as e:
#         print(f"Error processing product: {e}")
#         continue

# if prices_per_kg:
#     min_price = min(prices_per_kg)  # Minimum price
#     max_price = max(prices_per_kg)  # Maximum price
#     mode_price = statistics.mode(prices_per_kg)  # Most frequently occurring price

#     print(f"Min Price: ₹{min_price:.2f}/Kg")
#     print(f"Max Price: ₹{max_price:.2f}/Kg")
#     print(f"Mode Price: ₹{mode_price:.2f}/Kg")
# else:
#     print("\nNo matching products found.")

# # Close the browser
# driver.quit()



import os
import time
import re
import json
import statistics
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def mystore(crop):
    # Load environment variables
    load_dotenv()
    mystore = os.getenv("mystore")

    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  
    chrome_options.add_argument("--disable-gpu")  
    chrome_options.add_argument("--no-sandbox")  
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize WebDriver
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(mystore)  
    time.sleep(5)  

    # Find search box and enter crop name
    search_box = driver.find_element(By.XPATH, '//*[@id="searchtext"]')  
    search_box.send_keys(crop)
    search_box.send_keys(Keys.RETURN)
    time.sleep(5)  

    # Locate product list
    try:
        product_list_div = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'product-list-items')]"))
        )
    except:
        driver.quit()
        return json.dumps({"error": "No products found or site not accessible."}, indent=4)

    # Get product elements
    product_elements = product_list_div.find_elements(By.XPATH, ".//div[contains(@class, 'col product-grid-col')]")[:20]

    prices_per_kg = []

    for product in product_elements:
        try:
            seller_name = product.find_element(By.XPATH, ".//a[contains(@class, 'product_seller_name')]").text.strip()
            product_name_element = product.find_element(By.XPATH, ".//div[contains(@class, 'product-name text-dark')]/a[contains(@class, 'twoline_ellipsis')]")
            product_name = product_name_element.text.strip()

            # Filter relevant products
            if any(keyword in seller_name.lower() for keyword in ["producer", "fpo"]) and not any(keyword in product_name.lower() for keyword in ["flour", "seeds"]):
                
                # Extract price and weight
                price_text = product.find_element(By.XPATH, ".//span[contains(@class, 'price-new')]").text.strip()
                weight_text = product.find_element(By.XPATH, ".//div[contains(@class, 'product_netqty_unit text-dark ms-fs-14 my-1')]/span").text.strip()

                price = float(re.search(r"\d+", price_text.replace(",", "")).group())  
                weight = float(re.search(r"\d+", weight_text.replace(",", "")).group())  
                
                # Convert weight to kg if needed
                if "kg" not in weight_text.lower():
                    weight /= 1000  
                
                price_per_kg = price / weight
                prices_per_kg.append(price_per_kg)

        except Exception as e:
            print(f"Error processing product: {e}")
            continue

    driver.quit()

    # Compute min, max, and mode prices
    if prices_per_kg:
        result = {
            "crop": crop,
            "min_price_per_kg": round(min(prices_per_kg), 2),
            "max_price_per_kg": round(max(prices_per_kg), 2),
            "mode_price_per_kg": round(statistics.mode(prices_per_kg), 2)
        }
    else:
        result = {"error": f"No valid price data found for {crop}"}

    return json.dumps(result, indent=4)


