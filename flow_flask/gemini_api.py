# import google.generativeai as genai
# import pandas as pd
# import os

# # Load Gemini API Key
# GEMINI_API_KEY = "AIzaSyDugSu0wmLVCgRIr4DQBpOUdrp8lx2j-uU"  # Replace with your actual API key
# genai.configure(api_key=GEMINI_API_KEY)

# # Load CSV file
# csv_file = "state_district.csv"  # Replace with actual file path
# df = pd.read_csv(csv_file)

# # Convert CSV data into a formatted string
# csv_text = df.to_csv(index=False)

# # Define prompt to send to Gemini
# prompt = f"""
# I have a CSV file containing states and their districts. calculate my current location which is (19.1987712, 72.8727552) , give me:
# 1. The state and main district of the location.
# 2. The adjacent districts of the main district.

# The CSV data is as follows:
# State,District
# Andaman and Nicobar,Nicobar
# Andaman and Nicobar,North and Middle Andaman
# Andaman and Nicobar,South Andaman
# Andhra Pradesh,Anantapur
# Andhra Pradesh,Chittor
# Andhra Pradesh,Cuddapah
# Andhra Pradesh,East Godavari
# Andhra Pradesh,Guntur
# Andhra Pradesh,Krishna
# Andhra Pradesh,Kurnool
# Andhra Pradesh,Nellore
# Andhra Pradesh,Prakasam
# Andhra Pradesh,Srikakulam
# Andhra Pradesh,Vijayanagaram
# Andhra Pradesh,Visakhapatnam
# Andhra Pradesh,West Godavari
# Arunachal Pradesh,Changlang
# Arunachal Pradesh,East Kameng
# Arunachal Pradesh,East Siang
# Arunachal Pradesh,Lohit
# Arunachal Pradesh,Lower Dibang Valley
# Arunachal Pradesh,Lower Subansiri
# Arunachal Pradesh,Papum Pore
# Arunachal Pradesh,Tawang
# Arunachal Pradesh,Tirap
# Arunachal Pradesh,Upper Siang
# Arunachal Pradesh,Upper Subansiri
# Arunachal Pradesh,West Kameng
# Arunachal Pradesh,West Siang
# Assam,Bangaigaon
# Assam,Barpeta
# Assam,Cachar
# Assam,Darrang
# Assam,Dhemaji
# Assam,Dhubri
# Assam,Dibrugarh
# Assam,Goalpara
# Assam,Golaghat
# Assam,Hailakandi
# Assam,Jorhat
# Assam,Kamrup
# Assam,Karimganj
# Assam,Kokrajhar
# Assam,Lakhimpur
# Assam,Nagaon
# Assam,Nalbari
# Assam,Sibsagar
# Assam,Sonitpur
# Assam,Tinsukia
# Bihar,Araria
# Bihar,Aurangabad
# Bihar,Begusarai
# Bihar,Bhabhua
# Bihar,Bhagalpur
# Bihar,Bhojpur
# Bihar,Buxar
# Bihar,Chhapra
# Bihar,Darbhanga
# Bihar,East Champaran
# Bihar,Gaya
# Bihar,Gopalgang
# Bihar,Jamui
# Bihar,Jehanabad
# Bihar,Kaithar
# Bihar,Khagaria
# Bihar,Kishanganj
# Bihar,Luckeesarai
# Bihar,Madhepura
# Bihar,Madhubani
# Bihar,Munghair
# Bihar,Muzaffarpur
# Bihar,Nalanda
# Bihar,Nawada
# Bihar,Patna
# Bihar,Purnea
# Bihar,Rohtas
# Bihar,Saharsa
# Bihar,Samastipur
# Bihar,Sheikhpura
# Bihar,Sitamarhi
# Bihar,Siwan
# Bihar,Supaul
# Bihar,Vaishali
# Bihar,West Chambaran
# Chandigarh,Chandigarh
# Chattisgarh,Bastar
# Chattisgarh,Bijapur
# Chattisgarh,Bilaspur
# Chattisgarh,Dantewada
# Chattisgarh,Dhamtari
# Chattisgarh,Durg
# Chattisgarh,Janjgir
# Chattisgarh,Jashpur
# Chattisgarh,Kabirdham
# Chattisgarh,Kanker
# Chattisgarh,Kawardha
# Chattisgarh,Korba
# Chattisgarh,Koria
# Chattisgarh,Mahasamund
# Chattisgarh,Narayanpur
# Chattisgarh,North Bastar
# Chattisgarh,Raigarh
# Chattisgarh,Raipur
# Chattisgarh,Rajnandgaon
# Chattisgarh,Surguja
# Dadra and Nagar Haveli,Dadra & Nagar Haveli
# Daman and Diu,Daman
# Goa,North Goa
# Goa,South Goa
# Gujarat,Ahmedabad
# Gujarat,Amreli
# Gujarat,Anand
# Gujarat,Banaskanth
# Gujarat,Bharuch
# Gujarat,Bhavnagar
# Gujarat,Dahod
# Gujarat,Gandhinagar
# Gujarat,Jamnagar
# Gujarat,Junagarh
# Gujarat,Kachchh
# Gujarat,Kheda
# Gujarat,Mehsana
# Gujarat,Morbi
# Gujarat,Narmada
# Gujarat,Navsari
# Gujarat,Panchmahals
# Gujarat,Patan
# Gujarat,Porbandar
# Gujarat,Rajkot
# Gujarat,Sabarkantha
# Gujarat,Surat
# Gujarat,Surendranagar
# Gujarat,The Dangs
# Gujarat,Vadodara(Baroda)
# Gujarat,Valsad
# Haryana,Ambala
# Haryana,Bhiwani
# Haryana,Faridabad
# Haryana,Fatehabad
# Haryana,Gurgaon
# Haryana,Hissar
# Haryana,Jhajar
# Haryana,Jind
# Haryana,Kaithal
# Haryana,Karnal
# Haryana,Kurukshetra
# Haryana,Mahendragarh-Narnaul
# Haryana,Mewat
# Haryana,Panchkula
# Haryana,Panipat
# Haryana,Rewari
# Haryana,Rohtak
# Haryana,Sirsa
# Haryana,Sonipat
# Haryana,Yamuna Nagar
# Himachal Pradesh,Bilaspur
# Himachal Pradesh,Chamba
# Himachal Pradesh,Hamirpur
# Himachal Pradesh,Kangra
# Himachal Pradesh,Kullu
# Himachal Pradesh,Mandi
# Himachal Pradesh,Shimla
# Himachal Pradesh,Sirmore
# Himachal Pradesh,Solan
# Himachal Pradesh,Una
# Jammu and Kashmir,Anantnag
# Jammu and Kashmir,Badgam
# Jammu and Kashmir,Baramulla
# Jammu and Kashmir,Handwara
# Jammu and Kashmir,Jammu
# Jammu and Kashmir,Kargil
# Jammu and Kashmir,Kathua
# Jammu and Kashmir,Kupwara
# Jammu and Kashmir,Pulwama
# Jammu and Kashmir,Rajouri
# Jammu and Kashmir,Srinagar
# Jammu and Kashmir,Udhampur
# Jharkhand,Bokaro
# Jharkhand,Deogarh
# Jharkhand,Dhanbad
# Jharkhand,Dumka
# Jharkhand,East Singhbhum
# Jharkhand,Garhwa
# Jharkhand,Giridih
# Jharkhand,Godda
# Jharkhand,Gumla
# Jharkhand,Hazaribagh
# Jharkhand,Jamtara
# Jharkhand,Koderma
# Jharkhand,Latehar
# Jharkhand,Lohardaga
# Jharkhand,Pakur
# Jharkhand,Palamu
# Jharkhand,Ranchi
# Jharkhand,Sahebgang
# Jharkhand,Saraikela(Kharsanwa)
# Jharkhand,Simdega
# Jharkhand,West Singbhum
# Karnataka,Bagalkot
# Karnataka,Bangalore
# Karnataka,Belgaum
# Karnataka,Bellary
# Karnataka,Bidar
# Karnataka,Bijapur
# Karnataka,Chamrajnagar
# Karnataka,Chikmagalur
# Karnataka,Chitradurga
# Karnataka,Davangere
# Karnataka,Dharwad
# Karnataka,Gadag
# Karnataka,Gulbarga
# Karnataka,Hassan
# Karnataka,Haveri
# Karnataka,Karwar(Uttar Kannad)
# Karnataka,Kolar
# Karnataka,Koppal
# Karnataka,Madikeri(Kodagu)
# Karnataka,Mandya
# Karnataka,Mangalore(Dakshin Kannad)
# Karnataka,Mysore
# Karnataka,Raichur
# Karnataka,Ramanagar
# Karnataka,Shimoga
# Karnataka,Tumkur
# Karnataka,Udupi
# Kerala,Alappuzha
# Kerala,Ernakulam
# Kerala,Idukki
# Kerala,Kannur
# Kerala,Kasargod
# Kerala,Kollam
# Kerala,Kottayam
# Kerala,Kozhikode(Calicut)
# Kerala,Malappuram
# Kerala,Palakad
# Kerala,Pathanamthitta
# Kerala,Thirssur
# Kerala,Thiruvananthapuram
# Kerala,Wayanad
# Madhya Pradesh,Alirajpur
# Madhya Pradesh,Anupur
# Madhya Pradesh,Ashoknagar
# Madhya Pradesh,Badwani
# Madhya Pradesh,Balaghat
# Madhya Pradesh,Betul
# Madhya Pradesh,Bhind
# Madhya Pradesh,Bhopal
# Madhya Pradesh,Burhanpur
# Madhya Pradesh,Chhatarpur
# Madhya Pradesh,Chhindwara
# Madhya Pradesh,Damoh
# Madhya Pradesh,Datia
# Madhya Pradesh,Dewas
# Madhya Pradesh,Dhar
# Madhya Pradesh,Dindori
# Madhya Pradesh,Guna
# Madhya Pradesh,Gwalior
# Madhya Pradesh,Harda
# Madhya Pradesh,Hoshangabad
# Madhya Pradesh,Indore
# Madhya Pradesh,Jabalpur
# Madhya Pradesh,Jhabua
# Madhya Pradesh,Katni
# Madhya Pradesh,Khandwa
# Madhya Pradesh,Khargone
# Madhya Pradesh,Mandla
# Madhya Pradesh,Mandsaur
# Madhya Pradesh,Morena
# Madhya Pradesh,Narsinghpur
# Madhya Pradesh,Neemuch
# Madhya Pradesh,Panna
# Madhya Pradesh,Raisen
# Madhya Pradesh,Rajgarh
# Madhya Pradesh,Ratlam
# Madhya Pradesh,Rewa
# Madhya Pradesh,Sagar
# Madhya Pradesh,Satna
# Madhya Pradesh,Sehore
# Madhya Pradesh,Seoni
# Madhya Pradesh,Shajapur
# Madhya Pradesh,Shehdol
# Madhya Pradesh,Sheopur
# Madhya Pradesh,Shivpuri
# Madhya Pradesh,Sidhi
# Madhya Pradesh,Singroli
# Madhya Pradesh,Tikamgarh
# Madhya Pradesh,Ujjain
# Madhya Pradesh,Umariya
# Madhya Pradesh,Vidisha
# Maharashtra,Ahmednagar
# Maharashtra,Akola
# Maharashtra,Amarawati
# Maharashtra,Aurangabad
# Maharashtra,Beed
# Maharashtra,Bhandara
# Maharashtra,Buldhana
# Maharashtra,Chandrapur
# Maharashtra,Dhule
# Maharashtra,Gadchiroli
# Maharashtra,Gondiya
# Maharashtra,Hingoli
# Maharashtra,Jalana
# Maharashtra,Jalgaon
# Maharashtra,Kolhapur
# Maharashtra,Latur
# Maharashtra,Mumbai
# Maharashtra,Nagpur
# Maharashtra,Nanded
# Maharashtra,Nandurbar
# Maharashtra,Nashik
# Maharashtra,Osmanabad
# Maharashtra,Parbhani
# Maharashtra,Pune
# Maharashtra,Raigad
# Maharashtra,Ratnagiri
# Maharashtra,Sangli
# Maharashtra,Satara
# Maharashtra,Sholapur
# Maharashtra,Sindhudurg
# Maharashtra,Thane
# Maharashtra,Vashim
# Maharashtra,Wardha
# Maharashtra,Yavatmal
# Manipur,Bishnupur
# Manipur,Imphal East
# Manipur,Imphal West
# Manipur,Tengnoupal
# Manipur,Thoubal
# Meghalaya,East Garo Hills
# Meghalaya,East Jaintia Hills
# Meghalaya,East Khasi Hills
# Meghalaya,Nongpoh (R-Bhoi)
# Meghalaya,South Garo Hills
# Meghalaya,South West Garo Hills
# Meghalaya,South West Khasi Hills
# Meghalaya,West Garo Hills
# Meghalaya,West Jaintia Hills
# Meghalaya,West Khasi Hills
# Mizoram,Aizawl
# Mizoram,Kolasib
# Mizoram,Lungli
# Mizoram,Mamit
# Nagaland,Dimapur
# Nagaland,Kiphire
# Nagaland,Kohima
# Nagaland,Longleng
# Nagaland,Mokokchung
# Nagaland,Mon
# Nagaland,Peren
# Nagaland,Phek
# Nagaland,Tuensang
# Nagaland,Wokha
# Nagaland,Zunheboto
# NCT of Delhi,Delhi
# Orissa,Angul
# Orissa,Balasore
# Orissa,Bargarh
# Orissa,Bhadrak
# Orissa,Bolangir
# Orissa,Boudh
# Orissa,Cuttack
# Orissa,Deogarh
# Orissa,Dhenkanal
# Orissa,Gajapati
# Orissa,Ganjam
# Orissa,Jagatsinghpur
# Orissa,Jajpur
# Orissa,Jharsuguda
# Orissa,Kalahandi
# Orissa,Kandhamal
# Orissa,Kendrapara
# Orissa,Keonjhar
# Orissa,Khurda
# Orissa,Koraput
# Orissa,Malkangiri
# Orissa,Mayurbhanja
# Orissa,Nayagarh
# Orissa,Nowarangpur
# Orissa,Nuapada
# Orissa,Puri
# Orissa,Rayagada
# Orissa,Sambalpur
# Orissa,Sonepur
# Orissa,Sundergarh
# Pondicherry,Pondicherry
# Punjab,Amritsar
# Punjab,Barnala
# Punjab,Bhatinda
# Punjab,Faridkot
# Punjab,Fatehgarh
# Punjab,Fazilka
# Punjab,Ferozpur
# Punjab,Gurdaspur
# Punjab,Hoshiarpur
# Punjab,Jalandhar
# Punjab,Kapurthala
# Punjab,Ludhiana
# Punjab,Mansa
# Punjab,Moga
# Punjab,Mohali
# Punjab,Muktsar
# Punjab,Nawanshahr
# Punjab,Pathankot
# Punjab,Patiala
# Punjab,Ropar (Rupnagar)
# Punjab,Sangrur
# Punjab,Tarntaran
# Rajasthan,Ajmer
# Rajasthan,Alwar
# Rajasthan,Banswara
# Rajasthan,Baran
# Rajasthan,Barmer
# Rajasthan,Bharatpur
# Rajasthan,Bhilwara
# Rajasthan,Bikaner
# Rajasthan,Bundi
# Rajasthan,Chittorgarh
# Rajasthan,Churu
# Rajasthan,Dausa
# Rajasthan,Dholpur
# Rajasthan,Dungarpur
# Rajasthan,Ganganagar
# Rajasthan,Hanumangarh
# Rajasthan,Jaipur
# Rajasthan,Jaisalmer
# Rajasthan,Jalore
# Rajasthan,Jhalawar
# Rajasthan,Jhunjunu
# Rajasthan,Jodhpur
# Rajasthan,Karauli
# Rajasthan,Kota
# Rajasthan,Nagaur
# Rajasthan,Pali
# Rajasthan,Rajasamand
# Rajasthan,Sikar
# Rajasthan,Sirohi
# Rajasthan,Swai Madhopur
# Rajasthan,Tonk
# Rajasthan,Udaipur
# Sikkim,East
# Sikkim,North Sikkim (Mangan)
# Sikkim,South Sikkim (Namchi)
# Sikkim,West Sikkim (Gyalsing)
# Tamil Nadu,Ariyalur
# Tamil Nadu,Coimbatore
# Tamil Nadu,Cuddalore
# Tamil Nadu,Dharmapuri
# Tamil Nadu,Dindigul
# Tamil Nadu,Erode
# Tamil Nadu,Kancheepuram
# Tamil Nadu,Karur
# Tamil Nadu,Krishnagiri
# Tamil Nadu,Madurai
# Tamil Nadu,Nagapattinam
# Tamil Nadu,Nagercoil (Kannyiakumari)
# Tamil Nadu,Namakkal
# Tamil Nadu,Pudukkottai
# Tamil Nadu,Ramanathapuram
# Tamil Nadu,Salem
# Tamil Nadu,Sivaganga
# Tamil Nadu,Thanjavur
# Tamil Nadu,Theni
# Tamil Nadu,Thiruchirappalli
# Tamil Nadu,Thirunelveli
# Tamil Nadu,Thiruvannamalai
# Tamil Nadu,Thiruvarur
# Tamil Nadu,Thiruvellore
# Tamil Nadu,Tuticorin
# Tamil Nadu,Vellore
# Tamil Nadu,Villupuram
# Tamil Nadu,Virudhunagar
# Telangana,Adilabad
# Telangana,Hyderabad
# Telangana,Karimnagar
# Telangana,Khammam
# Telangana,Mahbubnagar
# Telangana,Medak
# Telangana,Nalgonda
# Telangana,Nizamabad
# Telangana,Ranga Reddy Dist.
# Telangana,Warangal
# Tripura,Dhalai
# Tripura,North Tripura
# Tripura,South District
# Tripura,West District
# Uttar Pradesh,Agra
# Uttar Pradesh,Aligarh
# Uttar Pradesh,Allahabad
# Uttar Pradesh,Ambedkarnagar
# Uttar Pradesh,Auraiya
# Uttar Pradesh,Azamgarh
# Uttar Pradesh,Badaun
# Uttar Pradesh,Baghpat
# Uttar Pradesh,Bahraich
# Uttar Pradesh,Ballia
# Uttar Pradesh,Balrampur
# Uttar Pradesh,Banda
# Uttar Pradesh,Barabanki
# Uttar Pradesh,Bareilly
# Uttar Pradesh,Basti
# Uttar Pradesh,Bhadohi(Sant Ravi Nagar)
# Uttar Pradesh,Bijnor
# Uttar Pradesh,Bulandshahar
# Uttar Pradesh,Chandauli
# Uttar Pradesh,Chitrakut
# Uttar Pradesh,Deoria
# Uttar Pradesh,Etah
# Uttar Pradesh,Etawah
# Uttar Pradesh,Faizabad
# Uttar Pradesh,Farukhabad
# Uttar Pradesh,Fatehpur
# Uttar Pradesh,Firozabad
# Uttar Pradesh,Gautam Budh Nagar
# Uttar Pradesh,Ghaziabad
# Uttar Pradesh,Ghazipur
# Uttar Pradesh,Gonda
# Uttar Pradesh,Gorakhpur
# Uttar Pradesh,Hamirpur
# Uttar Pradesh,Hardoi
# Uttar Pradesh,Hathras
# Uttar Pradesh,Jalaun (Orai)
# Uttar Pradesh,Jaunpur
# Uttar Pradesh,Jhansi
# Uttar Pradesh,Jyotiba Phule Nagar
# Uttar Pradesh,Kannuj
# Uttar Pradesh,Kanpur
# Uttar Pradesh,Kaushambi
# Uttar Pradesh,Khiri (Lakhimpur)
# Uttar Pradesh,Lakhimpur
# Uttar Pradesh,Lalitpur
# Uttar Pradesh,Lucknow
# Uttar Pradesh,Maharajganj
# Uttar Pradesh,Mahoba
# Uttar Pradesh,Mainpuri
# Uttar Pradesh,Mathura
# Uttar Pradesh,Mau(Maunathbhanjan)
# Uttar Pradesh,Meerut
# Uttar Pradesh,Mirzapur
# Uttar Pradesh,Muradabad
# Uttar Pradesh,Muzaffarnagar
# Uttar Pradesh,Padrauna(Kusinagar)
# Uttar Pradesh,Pillibhit
# Uttar Pradesh,Pratapgarh
# Uttar Pradesh,Raebarelli
# Uttar Pradesh,Rampur
# Uttar Pradesh,Saharanpur
# Uttar Pradesh,Sant Kabir Nagar
# Uttar Pradesh,Shahjahanpur
# Uttar Pradesh,Shravasti
# Uttar Pradesh,Siddharth Nagar
# Uttar Pradesh,Sitapur
# Uttar Pradesh,Sonbhadra
# Uttar Pradesh,Sultanpur
# Uttar Pradesh,Unnao
# Uttar Pradesh,Varanasi
# Uttrakhand,Champawat
# Uttrakhand,Dehradoon
# Uttrakhand,Garhwal (Pauri)
# Uttrakhand,Haridwar
# Uttrakhand,Nanital
# Uttrakhand,UdhamSinghNagar
# West Bengal,Bankura
# West Bengal,Birbhum
# West Bengal,Burdwan
# West Bengal,Coochbehar
# West Bengal,Dakshin Dinajpur
# West Bengal,Darjeeling
# West Bengal,Hooghly
# West Bengal,Howrah
# West Bengal,Jalpaiguri
# West Bengal,Kolkata
# West Bengal,Malda
# West Bengal,Medinipur(E)
# West Bengal,Medinipur(W)
# West Bengal,Murshidabad
# West Bengal,Nadia
# West Bengal,North 24 Parganas
# West Bengal,Puruliya
# West Bengal,Sounth 24 Parganas
# West Bengal,Uttar Dinajpur
# Now, provide the state, main district, and adjacent districts for my current location. while giving the response, make sure the spelling of the state and districts is identical with csv data
# """

# # Call Gemini API
# model = genai.GenerativeModel("gemini-1.5-pro")  # Choose model type
# response = model.generate_content(prompt)

# # Print response
# print(response.text)


import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Load CSV file (only state & district columns)
csv_file = "state_district.csv"  # Update the path if needed
df = pd.read_csv(csv_file, names=['State', 'District'])

# Initialize Geolocator
geolocator = Nominatim(user_agent="geoapiExercises")

def get_location_from_coords(lat, lon):
    """Get state and district from latitude & longitude using Nominatim."""
    try:
        location = geolocator.reverse((lat, lon), exactly_one=True)
        address = location.raw.get('address', {})
        return address.get('state', 'Unknown'), address.get('county', address.get('district', 'Unknown'))
    except GeocoderTimedOut:
        return None, None

def find_adjacent_districts(main_district, main_state, df):
    """Find adjacent districts by matching state and finding neighboring districts."""
    state_districts = df[df['State'] == main_state]
    district_index = state_districts[state_districts['District'] == main_district].index

    if not district_index.empty:
        idx = district_index[0]
        adjacent = []
        
        if idx > state_districts.index[0]:  # Previous district
            adjacent.append(state_districts.iloc[idx - 1]['District'])
        
        if idx < state_districts.index[-1]:  # Next district
            adjacent.append(state_districts.iloc[idx + 1]['District'])
        
        return adjacent
    return []

# Example: Get User's Location from Coordinates
latitude, longitude = 22.5726, 88.3639  # Example: Kolkata
state, district = get_location_from_coords(latitude, longitude)

# Find Adjacent Districts
if district and state:
    adjacent_districts = find_adjacent_districts(district, state, df)
    print(f"State: {state}, District: {district}")
    print(f"Adjacent Districts: {adjacent_districts}")
else:
    print("Could not determine the location.")

