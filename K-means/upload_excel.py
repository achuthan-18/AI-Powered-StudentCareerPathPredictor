import sys
import pandas as pd
import joblib
import json
import os
file_path = sys.argv[1]
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")
df = pd.read_excel(file_path)
cols = ["Tenth_Percentage","Twelfth_Percentage","CGPA","Coding_Skill","Project_Count",
        "Hackathon_Participation","Communication_Skill","Leadership_Skill","Internship_Experience"]
df_input = df[cols]
df_scaled = scaler.transform(df_input)
clusters = kmeans.predict(df_scaled)
df["Cluster"] = clusters
output_path = os.path.join(os.path.dirname(file_path), "clustered_output.xlsx")
df.to_excel(output_path, index=False)
result = {
    "message": "Batch prediction completed.",
    "download_path": output_path,
    "clusters": clusters.tolist()
}
print(json.dumps(result))