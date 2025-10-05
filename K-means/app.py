import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib 
df = pd.read_excel("data/Student_Clustering_Dataset_80000.xlsx")
features = [
    'Tenth_Percentage', 'Twelfth_Percentage', 'CGPA',
    'Coding_Skill', 'Project_Count', 'Hackathon_Participation',
    'Communication_Skill', 'Leadership_Skill', 'Internship_Experience'
]

X = df[features]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

k = 3  
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(X_scaled)
df['Cluster'] = kmeans.labels_

joblib.dump(kmeans, 'kmeans_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

df.to_excel("data/Student_Clustering_Result.xlsx", index=False)
print("Model, scaler, and clustered data saved successfully.")
