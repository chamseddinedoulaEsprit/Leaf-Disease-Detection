# 🌱 Leaf Disease Detection

Leaf disease detection is a crucial multi-platform project in agriculture, focusing on the automated identification and diagnosis of diseases and stress conditions affecting plant leaves.

This solution is composed of:

* **🌐 Web Application (React)** for browser-based usage.
* **📱 Mobile Application (React Native)** for farmers in the field.
* **⚙️ Node.js Server** for authentication, user management, and serving frontend apps.
* **🧠 Flask Server (API)** dedicated to Machine Learning inference and image analysis.

By analyzing leaf images, the system enables early detection, precise treatment, and promotes sustainable farming practices. It empowers farmers with valuable insights into plant health, contributing to:
✅ Improved crop yields
✅ Reduced environmental impact
✅ Enhanced food security

---

## 📊 Dataset

The dataset contains **87,000 RGB images** of healthy and diseased crop leaves categorized into **38 classes**.

It follows an 80/20 training-validation split and includes **33 test images**.

**Classes Example:**

```
0 : 'Apple scab'
1 : 'Apple black rot'
2 : 'Apple cedar apple rust'
3 : 'Apple healthy'
...
37 : 'Tomato healthy'
```

---

## 🔥 Features

* **1. Disease Detection (Flask API)** – Upload a leaf image and get prediction.
* **2. ChatBot (React/Node.js)** – Interactive assistant to guide farmers.
* **3. Multi-Platform Support** – Use via web or mobile.

---

## 🏗️ Architecture

```
        ┌────────────┐
        │   React    │  <-- Web App (Frontend)
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │ Node.js    │  <-- Backend server for Auth + Routing
        └─────┬──────┘
              │ REST API
        ┌─────▼──────┐
        │  Flask API │  <-- ML Model for Leaf Disease Detection
        └────────────┘
              │
        ┌─────▼──────┐
        │ ReactNative│  <-- Mobile App connected to Node.js + Flask
        └────────────┘
```

---

## ⚙️ Installation

### 🔹 Backend (Flask API)

```bash
# Create Virtual Environment
python -m venv myenv
myenv\Scripts\activate  # Windows
source myenv/bin/activate # Linux/Mac

# Install requirements
pip install -r requirements.txt

# Run Flask server
python app.py
```

### 🔹 Backend (Node.js Server)

```bash
# Install dependencies
npm install

# Run server
npm start
```

### 🔹 Frontend (React Web)

```bash
cd client
npm install
npm start
```

### 🔹 Mobile (React Native)

```bash
cd mobile
npm install
npm run android   # For Android
npm run ios       # For iOS
```

---

## 🚀 About Me

I'm a student passionate about **AI, full-stack development, and sustainable agriculture** 🌍.

---

## 📚 Lessons Learned

### Data Handling

* Preprocessing and augmenting image datasets.
* Converting images into tensors.

### Device Agnostic Code

* Training with GPU/CPU compatible code.

### Transfer Learning

* Using pretrained models to boost accuracy.

### Model Evaluation

* Accuracy, confusion matrix, F1-score.

### Model Management

* Saving, loading, and updating trained models.

### Full-Stack Integration

* Connecting ML models (Flask) with **React/React Native apps** through **Node.js** backend.
