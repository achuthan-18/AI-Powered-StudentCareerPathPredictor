import sys
import json
import pandas as pd
import numpy as np
import joblib
from pydantic import BaseModel, Field, ValidationError
import argparse
import os

class StudentInput(BaseModel):
    Tenth_Percentage: float = Field(ge=0, le=100)
    Twelfth_Percentage: float = Field(ge=0, le=100)
    CGPA: float = Field(ge=0, le=10)
    Coding_Skill: float = Field(ge=0, le=10)
    Project_Count: int = Field(ge=0)
    Hackathon_Participation: int = Field(ge=0)
    Communication_Skill: float = Field(ge=0, le=10)
    Leadership_Skill: float = Field(ge=0, le=10)
    Internship_Experience: int = Field(ge=0)

def validate_input(input_dict):
    try:
        student = StudentInput(**input_dict)
        return student, None
    except ValidationError as e:
        return None, e.json()


MODEL_PATH = "kmeans_model.pkl"
SCALER_PATH = "scaler.pkl"

kmeans = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

cluster_info = {
    0: {
        "name": "Product Company Ready",
        "description": "Ideal for top product-based tech companies.",
        "tips": ["Focus on competitive coding", "Participate in high-level projects", "Contribute to open-source"],
        "recommended_roles": ["Software Developer", "Backend Engineer", "ML Engineer"]
    },
    1: {
        "name": "IT Service Ready",
        "description": "Suitable for IT service companies and consulting roles.",
        "tips": ["Improve communication skills", "Gain internship experience", "Focus on practical projects"],
        "recommended_roles": ["IT Analyst", "Support Engineer", "QA Engineer"]
    },
    2: {
        "name": "Needs Support",
        "description": "Needs guidance to improve skills for industry readiness.",
        "tips": ["Work on projects", "Participate in hackathons", "Enhance coding skills", "Consider mentorship"],
        "recommended_roles": ["Internships", "Learning Programs", "Bootcamps"]
    }
}
def predict_student(input_dict):
    student, error = validate_input(input_dict)
    if error:
        return {"error": error}

    cols = ["Tenth_Percentage","Twelfth_Percentage","CGPA","Coding_Skill","Project_Count",
            "Hackathon_Participation","Communication_Skill","Leadership_Skill","Internship_Experience"]
    df_input = pd.DataFrame([student.model_dump()], columns=cols)
    df_scaled = scaler.transform(df_input)
    cluster = kmeans.predict(df_scaled)[0]

    result = cluster_info.get(cluster, {})
    result["cluster"] = int(cluster)
    return result

def predict_batch(file_path, output_path="batch_predictions.xlsx"):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format. Use CSV or Excel.")

    
    results = []
    for i, row in df.iterrows():
        row_dict = row.to_dict()
        result = predict_student(row_dict)
        results.append(result.get("cluster_name", "Error"))

    df["Predicted_Cluster"] = results
    df.to_excel(output_path, index=False)
    print(f"Batch prediction completed: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Student Career Path Predictor")
    parser.add_argument("--single", type=str, help="JSON string of single student input")
    parser.add_argument("--batch", type=str, help="Excel or CSV file path for batch prediction")
    parser.add_argument("--output", type=str, default="batch_predictions.xlsx", help="Output file path for batch predictions")
    args = parser.parse_args()

    if args.single:
        input_dict = json.loads(args.single)
        result = predict_student(input_dict)
        print(json.dumps(result, indent=4))
    elif args.batch:
        predict_batch(args.batch, args.output)
    else:
        print("Please provide either --single or --batch input.")
