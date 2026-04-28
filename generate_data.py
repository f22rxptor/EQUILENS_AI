import pandas as pd
import numpy as np

# Generate a synthetic "UCI Adult-like" dataset with intentional bias
np.random.seed(42)
n_samples = 1000

# Features
age = np.random.randint(18, 70, n_samples)
education_num = np.random.randint(1, 16, n_samples)
hours_per_week = np.random.randint(10, 60, n_samples)
gender = np.random.choice(['Male', 'Female'], n_samples)
race = np.random.choice(['White', 'Black', 'Other'], n_samples, p=[0.7, 0.2, 0.1])

# Target: Income >50K (0 or 1)
# Intentionally adding bias: Males and higher education/hours have higher chance
# Probability score
prob = (
    (age / 70) * 0.2 + 
    (education_num / 16) * 0.4 + 
    (hours_per_week / 60) * 0.3 + 
    np.where(gender == 'Male', 0.15, 0) # Bias factor
)
income = (prob + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)

df = pd.DataFrame({
    'age': age,
    'education-num': education_num,
    'hours-per-week': hours_per_week,
    'gender': gender,
    'race': race,
    'income': income
})

df.to_csv('backend/data/adult_demo.csv', index=False)
print("Demo dataset created: backend/data/adult_demo.csv")
