# Primary Care Patient Triage System

## Project Overview

This project was developed for the No. 10 Data Science Hackathon to improve access to primary care by intelligently matching patients with the right healthcare professional at the right time. The system uses machine learning models trained on synthetic patient data and ONS health survey data to optimize patient triage and appointment scheduling.

## Problem Statement

The UK government is committed to improving access to primary care and bringing back the family doctor experience. However, with increasing demand and limited GP availability, there's a need for intelligent systems that can:

- Triage patients to appropriate healthcare professionals (GP vs Nurse)
- Prioritize appointments based on clinical need and patient complexity
- Balance clinical requirements, patient preferences, and system efficiency

## Solution Architecture

### Machine Learning Models

The project includes two main ML models built with XGBoost:

1. **Priority Classification Model** (`model.py`)
   - Predicts appointment priority levels (Low, Medium, High, Urgent)
   - Features: patient demographics, comorbidities, request text analysis, historical patterns

2. **Professional Type Assignment Model** (`model_apt.py`)
   - Determines whether a patient should see a GP or Nurse
   - Binary classification based on clinical complexity and patient preferences

### Data Processing Pipeline

**Data Sources:**
- Synthetic patient data (demographics, comorbidities, appointments history)
- ONS Health Insights Survey (patient satisfaction and preferences)
- GP clinic availability data
- Historical appointment patterns

**Feature Engineering** (`clean_data.py`, `clean_data_apt.py`):
- Age calculation from date of birth
- Comorbidity counting and categorization
- Text analysis of referral notes (urgency keywords, note length)
- Regional satisfaction scores from ONS data
- Temporal features (request timing, day of week)

### Web Application

Built with React and TypeScript, the application provides:

**Patient Portal:**
- Medical request submission form
- Preference selection (GP vs any available professional)
- Emergency warning system for red flag symptoms

**Clinician Portal:**
- Patient triage dashboard with AI recommendations
- Urgency-grouped patient lists (Red, Amber, Green)
- Detailed patient information and medical history
- Call log management system

## Technology Stack

**Backend/ML:**
- Python 3.x
- XGBoost for classification
- Pandas & NumPy for data processing
- Scikit-learn for model evaluation
- Matplotlib & Seaborn for visualization

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn-ui component library
- React Router for navigation
- React Hook Form for form management

**Data Storage:**
- Supabase integration for data persistence
- CSV files for ML model training

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Required Python packages: `pandas`, `numpy`, `xgboost`, `scikit-learn`, `matplotlib`, `seaborn`

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd No-10-DS-Hack
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install Python dependencies:**
```bash
pip install pandas numpy xgboost scikit-learn matplotlib seaborn joblib
```

4. **Run the development server:**
```bash
npm run dev
```

### Training the Models

1. **Prepare the priority prediction model:**
```bash
python clean_data.py
python model.py
```

2. **Prepare the professional type assignment model:**
```bash
python clean_data_apt.py
python model_apt.py
```

### Data Analysis

Explore ONS survey data insights:
```bash
python gp_survey_data_analysis.py
```

## Key Features

### Intelligent Triage
- **Priority Scoring:** Automatic classification of appointment urgency based on patient history, comorbidities, and request details
- **Professional Matching:** AI-powered assignment to GP or Nurse based on clinical complexity
- **Preference Integration:** Balances patient preferences with clinical need and system capacity

### Clinical Decision Support
- **Risk Stratification:** Identifies high-risk patients requiring GP attention
- **Resource Optimization:** Maximizes use of nursing staff for appropriate cases
- **Emergency Detection:** Flags urgent cases requiring immediate attention

### User Experience
- **Streamlined Forms:** Intuitive patient request submission
- **Dashboard Views:** Organized triage interface for clinical staff
- **Real-time Updates:** Dynamic priority adjustments based on changing conditions

## Model Performance

The XGBoost models achieve high accuracy in:
- **Priority Classification:** Multi-class prediction with detailed confusion matrices
- **Professional Assignment:** Binary classification optimized for healthcare resource allocation
- **Feature Importance:** Clear insights into which factors drive triage decisions

## Future Enhancements

- Integration with NHS appointment booking systems
- Real-time capacity management across multiple practices
- Patient outcome tracking and model refinement
- Mobile application for improved accessibility
- Integration with community diagnostic centers and pharmacies

## Development

**Build for production:**
```bash
npm run build
```

**Lint code:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```
