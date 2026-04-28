import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

class BiasEngine:
    def __init__(self, data_path):
        self.df = pd.read_csv(data_path)
        self.model = None
        self.features = ['age', 'education-num', 'hours-per-week']
        self._train_model()

    def _train_model(self):
        # Prepare data for simple classification
        X = self.df[self.features]
        y = self.df['income']
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X, y)

    def calculate_disparate_impact(self):
        # Probability of income=1 for Male vs Female
        selection_rates = {}
        for g in ['Male', 'Female']:
            group_df = self.df[self.df['gender'] == g]
            selection_rate = group_df['income'].mean()
            selection_rates[g] = selection_rate
        
        # Disparate Impact = (Rate for Female) / (Rate for Male)
        # Assuming Male is the privileged group for this demo
        di_gender = selection_rates['Female'] / selection_rates['Male'] if selection_rates['Male'] > 0 else 1.0
        
        return {
            "gender": round(di_gender, 2),
            "race": 0.85, # Placeholder for race
            "age": 0.92  # Placeholder for age
        }

    def get_feature_importance(self):
        importances = self.model.feature_importances_
        results = []
        for i, feat in enumerate(self.features):
            results.append({
                "feature": feat.capitalize(),
                "value": float(importances[i]),
                "type": "positive"
            })
        
        # Add gender as a manual correlation feature to show bias
        gender_corr = self.df[self.df['gender'] == 'Male']['income'].mean() - self.df[self.df['gender'] == 'Female']['income'].mean()
        results.append({
            "feature": "Gender Bias",
            "value": float(gender_corr),
            "type": "negative" if gender_corr > 0 else "positive"
        })
        
        return results

    def calculate_overall_bias(self):
        di = self.calculate_disparate_impact()
        # Simple score: 1 - min(di.values())
        min_impact = min(di.values())
        return round(1.0 - min_impact, 2)
