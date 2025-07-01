# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import chromedriver_autoinstaller
# import json

# def use_web():
  
#     driver = None  # Initialize driver as None
#     try:
#         # Auto-install ChromeDriver
#         chromedriver_autoinstaller.install()

#         # Configure headless mode (optional)
#         chrome_options = Options()
#         chrome_options.add_argument("--headless")  # Run in background

#         # Initialize WebDriver
#         driver = webdriver.Chrome(options=chrome_options)
#         driver.get("https://agriwelfare.gov.in/en/Major")

#         # Wait for the table to load
#         wait = WebDriverWait(driver, 10)
#         table_xpath = "//table[contains(@class, 'table-bordered table-striped testdatatable')]"  
#         wait.until(EC.presence_of_element_located((By.XPATH, table_xpath)))

#         # Find all rows in the table (Skipping the header row)
#         rows = driver.find_elements(By.XPATH, f"{table_xpath}//tr")[1:]
#         output_filename="useful_web.json"
#         # Extract data and store in a list
#         data = []
#         for row in rows:
#             try:
#                 title = row.find_element(By.XPATH, "./td[2]").text  # Extract title from 2nd column
#                 links = row.find_elements(By.XPATH, ".//td[4]//a[@href]")  # Extract links from 4th column

#                 # Store multiple links if present
#                 links_list = [link.get_attribute("href") for link in links]

#                 # Append data to list
#                 data.append({"title": title, "links": links_list})
#             except Exception as e:
#                 print(f"Error processing row: {e}")

#         # Save data as a JSON file
#         with open(output_filename, "w", encoding="utf-8") as f:
#             json.dump(data, f, indent=4, ensure_ascii=False)

#         return "success"
    
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return "failed"

#     finally:
#         if driver:
#             driver.quit()  # Ensure browser closes

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
import json

def use_web():
    driver = None  # Initialize driver as None
    try:
        # Auto-install ChromeDriver
        chromedriver_autoinstaller.install()

        # Configure headless mode (optional)
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background

        # Initialize WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        driver.get("https://agriwelfare.gov.in/en/Major")

        # Wait for the table to load
        wait = WebDriverWait(driver, 10)
        table_xpath = "//table[contains(@class, 'table-bordered table-striped testdatatable')]"  
        wait.until(EC.presence_of_element_located((By.XPATH, table_xpath)))

        # Find all rows in the table (Skipping the header row)
        rows = driver.find_elements(By.XPATH, f"{table_xpath}//tr")[1:]
        output_filename = "useful_web.json"

        # Extract data and store in a list
        data = []
        for row in rows:
            try:
                title = row.find_element(By.XPATH, "./td[2]").text  # Extract title from 2nd column
                links = row.find_elements(By.XPATH, ".//td[4]//a[@href]")  # Extract links from 4th column

                # Exclude links containing ".pdf"
                links_list = [link.get_attribute("href") for link in links if ".pdf" not in link.get_attribute("href").lower()]

                # Append only if there are valid links
                if links_list:
                    data.append({"title": title, "links": links_list})
            except Exception as e:
                print(f"Error processing row: {e}")

        # Save data as a JSON file
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return "success"

    except Exception as e:
        print(f"An error occurred: {e}")
        return "failed"

    finally:
        if driver:
            driver.quit()  # Ensure browser closes
