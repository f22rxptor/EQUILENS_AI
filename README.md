# EquiLens AI 🛡️

**EquiLens AI** is an open-source auditing dashboard designed to detect and mitigate bias in AI-driven decision systems (recruitment, loans, etc.).

## 🚀 Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Key Features
- **Bias Detection**: Automated check for Disparate Impact (4/5ths rule) and Equalized Odds.
- **Explainable AI (XAI)**: SHAP-based feature importance visualizations.
- **Counterfactual Simulator**: "What-If" scenarios to test model robustness against demographic shifts.
- **Compliance Logging**: All audits are logged for regulatory transparency.

## ⚖️ Ethical Foundation
EquiLens AI is aligned with **UN Sustainable Development Goal 10: Reduced Inequalities**. For a deep dive into our ethical framework, see [GUIDE.md](./GUIDE.md).

## 📂 Project Structure
- `backend/`: FastAPI Fairness Engine (Python).
- `frontend/`: React Dashboard (Vite + Recharts).
- `system_architecture.md`: Technical design documentation.
- `implementation_plan.md`: Development roadmap.

---
Built with ⚖️ by EquiLens AI Team.
