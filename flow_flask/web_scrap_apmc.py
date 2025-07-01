# import os
# import time
# import csv
# import tempfile
# import datetime
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import Select, WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import chromedriver_autoinstaller
# import csv
# import json
# from collections import defaultdict
# from dotenv import load_dotenv
# from avg_price_apmc import avg_price_apmc

# # Load environment variables
# load_dotenv()
# enam = os.getenv("enam")
# arg = os.getenv("arg")

# # Install ChromeDriver automatically
# chromedriver_autoinstaller.install()

# # Set up Selenium options
# options = Options()
# options.add_argument("--headless")  # Run in background (no UI)
# options.add_argument("--no-sandbox")
# options.add_argument("--disable-dev-shm-usage")

# # Use a unique Chrome profile
# temp_dir = tempfile.mkdtemp()
# options.add_argument(f"--user-data-dir={temp_dir}")

# # Start WebDriver
# driver = webdriver.Chrome(options=options)
# driver.get(arg)

# # Create WebDriverWait instance
# wait = WebDriverWait(driver, 30)

# # Ensure page is fully loaded
# wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

# # Get the latest year and month
# latest_year = datetime.datetime.now().year
# latest_month = datetime.datetime.now().strftime("%B")  # Full month name

# # Select Year
# year_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboYear"]')))
# Select(year_dropdown).select_by_visible_text(str(latest_year))
# time.sleep(2)

# # Select Month
# month_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboMonth"]')))
# Select(month_dropdown).select_by_visible_text(latest_month)
# time.sleep(2)

# # Select State (Maharashtra)
# state_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboState"]')))
# Select(state_dropdown).select_by_visible_text("Maharashtra")
# time.sleep(2)

# # Select Commodity (Apple)
# commodity_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboCommodity"]')))
# Select(commodity_dropdown).select_by_visible_text("Rice")
# time.sleep(2)

# # Click Submit button
# submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="cphBody_btnSubmit"]')))
# submit_button.click()
# time.sleep(5)  # Wait for table to load

# # Extract Table Data and Save to CSV
# csv_filename = "crop_prices.csv"
# with open(csv_filename, "w", newline="", encoding="utf-8") as file:
#     writer = csv.writer(file)
#     writer.writerow(["Market", "Arrival Date", "Arrivals (Tonnes)", "Variety",
#                      "Minimum Price (Rs./Quintal)", "Maximum Price (Rs./Quintal)", "Modal Price (Rs./Quintal)"])

#     try:
#         # Locate the table using the given XPath
#         table = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_gridRecords"]')))
#         rows = table.find_elements(By.TAG_NAME, "tr")

#         if len(rows) > 1:
#             for row in rows[1:]:  # Skip header row
#                 cols = row.find_elements(By.TAG_NAME, "td")
#                 if len(cols) == 7:  # Ensure it matches the expected columns
#                     row_data = [col.text.strip() for col in cols]
#                     writer.writerow(row_data)  # Save row in CSV
#             avg_price_apmc(csv_filename)            
            

#         else:
#             print(f"⚠️ No data available for Maharashtra - rice ({latest_month} {latest_year})")

#     except Exception as e:
#         print("❌ No data found:", e)

# # Close browser
# driver.quit()





import os
import time
import csv
import tempfile
import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
from dotenv import load_dotenv
import csv
import json
from collections import defaultdict

def avg_price_apmc(csv_filename:str):

    district_prices = defaultdict(lambda: {"min": [], "max": [], "modal": []})

    try:
        with open(csv_filename, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)  # Skip header row
            prev_market = None

            for row in reader:
                try:
                    # Read district/market name
                    market = row[0].strip() if row[0].strip() else prev_market  

                    # Read price columns and convert to int
                    min_price = int(row[4].strip())
                    max_price = int(row[5].strip())
                    modal_price = int(row[6].strip())

                    # Store prices in dictionary
                    district_prices[market]["min"].append(min_price)
                    district_prices[market]["max"].append(max_price)
                    district_prices[market]["modal"].append(modal_price)

                    prev_market = market  # Store the last valid market name
                except ValueError:
                    print(f"Skipping row with invalid data: {row}")

        # Compute average prices
        avg_prices = {}
        for market, prices in district_prices.items():
            avg_prices[market] = {
                "average_min_price": round((sum(prices["min"]) / len(prices["min"]))/100, 2) if prices["min"] else 0,
                "average_max_price": round((sum(prices["max"]) / len(prices["max"]))/100, 2) if prices["max"] else 0,
                "average_modal_price": round((sum(prices["modal"]) / len(prices["modal"]))/100, 2) if prices["modal"] else 0,
            }

        
        
        print(avg_prices)
    except FileNotFoundError:
        return json.dumps({"error": "File not found."}, indent=4)

# def web_scrap_apmc(state, crop):
#     # Load environment variables
#     load_dotenv()
#     arg = os.getenv("arg")
    
#     # Install ChromeDriver automatically
#     chromedriver_autoinstaller.install()
    
#     # Set up Selenium options
#     options = Options()
#     options.add_argument("--headless")  # Run in background (no UI)
#     options.add_argument("--no-sandbox")
#     options.add_argument("--disable-dev-shm-usage")
    
#     # Use a unique Chrome profile
#     temp_dir = tempfile.mkdtemp()
#     options.add_argument(f"--user-data-dir={temp_dir}")
    
#     # Start WebDriver
#     driver = webdriver.Chrome(options=options)
#     driver.get(arg)
    
#     # Create WebDriverWait instance
#     wait = WebDriverWait(driver, 30)
    
#     # Ensure page is fully loaded
#     wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    
#     # Get the latest year and month
#     latest_year = datetime.datetime.now().year
#     latest_month = datetime.datetime.now().strftime("%B")  # Full month name
    
#     # Select Year
#     year_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboYear"]')))
#     Select(year_dropdown).select_by_visible_text(str(latest_year))
#     time.sleep(2)
    
#     # Select Month
#     month_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboMonth"]')))
#     Select(month_dropdown).select_by_visible_text(latest_month)
#     time.sleep(2)
    
#     # Select State
#     state_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboState"]')))
#     Select(state_dropdown).select_by_visible_text(state)
#     time.sleep(2)
    
#     # Select Commodity
#     commodity_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboCommodity"]')))
#     Select(commodity_dropdown).select_by_visible_text(crop)
#     time.sleep(2)
    
#     # Click Submit button
#     submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="cphBody_btnSubmit"]')))
#     submit_button.click()
#     time.sleep(5)  # Wait for table to load
    
#     # Extract Table Data and Save to CSV
#     csv_filename = "crop_prices.csv"
#     with open(csv_filename, "w", newline="", encoding="utf-8") as file:
#         writer = csv.writer(file)
#         writer.writerow(["Market", "Arrival Date", "Arrivals (Tonnes)", "Variety",
#                          "Minimum Price (Rs./Quintal)", "Maximum Price (Rs./Quintal)", "Modal Price (Rs./Quintal)"])
    
#         try:
#             # Locate the table using the given XPath
#             table = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_gridRecords"]')))
#             rows = table.find_elements(By.TAG_NAME, "tr")
    
#             if len(rows) > 1:
#                 for row in rows[1:]:  # Skip header row
#                     cols = row.find_elements(By.TAG_NAME, "td")
#                     if len(cols) == 7:  # Ensure it matches the expected columns
#                         row_data = [col.text.strip() for col in cols]
#                         writer.writerow(row_data)  # Save row in CSV
                
                
                
#             else:
#                 print(f"⚠️ No data available for {state} - {crop} ({latest_month} {latest_year})")
        
#         except Exception as e:
#             print( e)
    
#     # Close browser
#     driver.quit()
#     return None


import os
import time
import csv
import tempfile
import datetime
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
from collections import defaultdict
from dotenv import load_dotenv

def web_scrap_apmc(state, crop):
    # Load environment variables
    load_dotenv()
    arg = os.getenv("arg")
    
    # Install ChromeDriver automatically
    chromedriver_autoinstaller.install()
    
    # Set up Selenium options
    options = Options()
    options.add_argument("--headless")  # Run in background (no UI)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    # Use a unique Chrome profile
    temp_dir = tempfile.mkdtemp()
    options.add_argument(f"--user-data-dir={temp_dir}")
    
    # Start WebDriver
    driver = webdriver.Chrome(options=options)
    driver.get(arg)
    
    # Create WebDriverWait instance
    wait = WebDriverWait(driver, 30)
    
    # Ensure page is fully loaded
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    
    # Get the latest year and month
    latest_year = datetime.datetime.now().year
    latest_month = datetime.datetime.now().strftime("%B")  # Full month name
    
    # Select Year
    year_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboYear"]')))
    Select(year_dropdown).select_by_visible_text(str(latest_year))
    time.sleep(2)
    
    # Select Month
    month_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboMonth"]')))
    Select(month_dropdown).select_by_visible_text(latest_month)
    time.sleep(2)
    
    # Select State
    state_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboState"]')))
    Select(state_dropdown).select_by_visible_text(state)
    time.sleep(2)
    
    # Select Commodity
    commodity_dropdown = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_cboCommodity"]')))
    Select(commodity_dropdown).select_by_visible_text(crop)
    time.sleep(2)
    
    # Click Submit button
    submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="cphBody_btnSubmit"]')))
    submit_button.click()
    time.sleep(5)  # Wait for table to load
    
    # Extract Table Data and Save to CSV
    csv_filename = f"crop_prices.csv"
    district_prices = defaultdict(lambda: {"min": [], "max": [], "modal": []})  # Dictionary to store district-wise prices

    with open(csv_filename, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Market", "Arrival Date", "Arrivals (Tonnes)", "Variety",
                         "Minimum Price (Rs./Quintal)", "Maximum Price (Rs./Quintal)", "Modal Price (Rs./Quintal)"])
    
        try:
            # Locate the table using the given XPath
            table = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="cphBody_gridRecords"]')))
            rows = table.find_elements(By.TAG_NAME, "tr")
    
            if len(rows) > 1:
                for row in rows[1:]:  # Skip header row
                    cols = row.find_elements(By.TAG_NAME, "td")
                    if len(cols) == 7:  # Ensure it matches the expected columns
                        row_data = [col.text.strip() for col in cols]
                        writer.writerow(row_data)  # Save row in CSV

                        # Read district/market name
                        market = row_data[0]

                        # Read price columns (convert to int)
                        try:
                            min_price = int(row_data[4])
                            max_price = int(row_data[5])
                            modal_price = int(row_data[6])

                            # Store in dictionary
                            district_prices[market]["min"].append(min_price)
                            district_prices[market]["max"].append(max_price)
                            district_prices[market]["modal"].append(modal_price)
                        except ValueError:
                            print(f"Skipping row with invalid data: {row_data}")

            else:
                print(f"⚠️ No data available for {state} - {crop} ({latest_month} {latest_year})")
                driver.quit()
                return None
    
        except Exception as e:
            print("❌ Error fetching data:", e)
            driver.quit()
            return None

    # Close browser
    driver.quit()

    # Compute and format average prices
    avg_prices = {}
    for market, prices in district_prices.items():
        avg_prices[market] = {
            "average_min_price": round(sum(prices["min"]) / len(prices["min"]) / 100, 2) if prices["min"] else 0,
            "average_max_price": round(sum(prices["max"]) / len(prices["max"]) / 100, 2) if prices["max"] else 0,
            "average_modal_price": round(sum(prices["modal"]) / len(prices["modal"]) / 100, 2) if prices["modal"] else 0
        }

    return json.dumps(avg_prices, indent=4)  # Return as JSON string

