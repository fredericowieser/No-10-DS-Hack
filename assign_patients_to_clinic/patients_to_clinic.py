### Assigns Routine patients to clinics based on postcode ###
# Had to fake a column for patients called 'appointment_type_recommendation'
# which should come from the LLM 
# We didnt have postcode info for the clinics so this is fake as well
# based off the postcodes in the patient csv

# load packages
import pandas as pd
import numpy as np
import geopandas as gpd

# Load files
referrals_df = pd.read_csv('./data/GP Request.csv')
clinics_df = pd.read_csv('./data/GP Clinics.csv')
patients_df =pd.read_csv('./data/patients_plus_lat_long.csv')


### random postcodes for clinics ###
# Postcodes with approximate coords
postcode_coords = {
    "AB0": (57.15, -2.10),   # Aberdeen area
    "AL1": (51.75, -0.33),   # St Albans
    "B1":  (52.48, -1.90),   # Birmingham
}

# Flatten to unique locations
locations = clinics_df["location"].dropna().unique()


# Assign each clinic randomly to a postcode area
np.random.seed(42)
postcode_keys = list(postcode_coords.keys())
assigned_postcodes = np.random.choice(postcode_keys, size=len(locations))

# Generate random coords near the assigned postcode area
def random_near(base_lat, base_lon, max_offset_km=5):
    # 1 degree latitude ≈ 111 km
    lat_offset = np.random.uniform(-max_offset_km/111, max_offset_km/111)
    # Longitude scaling depends on latitude
    lon_offset = np.random.uniform(-max_offset_km/111, max_offset_km/111) / np.cos(np.radians(base_lat))
    return base_lat + lat_offset, base_lon + lon_offset

coords = []
for pc in assigned_postcodes:
    base_lat, base_lon = postcode_coords[pc]
    coords.append(random_near(base_lat, base_lon))

# Build location→coords mapping
location_coords = pd.DataFrame({
    "location": locations,
    "postcode_anchor": assigned_postcodes,
    "lat": [c[0] for c in coords],
    "long": [c[1] for c in coords]
})

# Merge back
clinics_df = clinics_df.merge(
    location_coords, left_on="location", right_on="location", how="left"
)

### Start assigning clinics here ###
referrals_patients_gp = referrals_df.merge(
    patients_df, left_on="patient_id", right_on="person_id"
)
referrals_patients_gp = referrals_patients_gp.dropna(
    subset=["lat", "long", "appointment_type_recommendation"]
)
referrals_patients_gp = referrals_patients_gp[referrals_patients_gp["priority"] == "Routine"]


# active clinics with vacant slots
available_clinics = clinics_df[
    (~clinics_df["status"].isin(["Cancelled", "On hold"])) &
    ((clinics_df["total_vacant_slots_new"] > 0) | (clinics_df["total_vacant_slots_followup"] > 0))
].copy()

# convert to geopandas
gdf_referrals = gpd.GeoDataFrame(
    referrals_patients_gp,
    geometry=gpd.points_from_xy(referrals_patients_gp["long"], referrals_patients_gp["lat"]),
    crs="EPSG:4326"
)

gdf_clinics = gpd.GeoDataFrame(
    available_clinics,
    geometry=gpd.points_from_xy(available_clinics["long"], available_clinics["lat"]),
    crs="EPSG:4326"
)

# reproject to meters
gdf_referrals = gdf_referrals.to_crs(epsg=3857)
gdf_clinics = gdf_clinics.to_crs(epsg=3857)

# buffer to 5km
gdf_referrals["buffer"] = gdf_referrals.buffer(5000)

# spatial join
joined = gpd.sjoin(
    gdf_clinics,
    gdf_referrals.set_geometry("buffer"),
    how="inner",
    predicate="within"
)

# filter on matchign clinic
joined = joined[
    joined["clinic_type_name"] == joined["appointment_type_recommendation"]
]

# pick best clinic per patient 
joined = joined.sort_values(
    by=["referral_id", "total_vacant_slots_new", "total_vacant_slots_followup"],
    ascending=[True, False, False]
)

# drop dupes
assignments = joined.drop_duplicates(subset=["referral_id"])

# subset
final_df = assignments[['person_id', 'mrn', 'nhs_number', 'first_name', 'surname', 'sex', 'clinic_name', 'clinic_start_timestamp', 'requested_appointment_type', 'appointment_type_recommendation']]

final_df.to_csv('patients_assigned_clinics.csv')